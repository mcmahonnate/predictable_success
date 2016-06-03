angular
    .module('profile')
    .controller('ProfileController', ProfileController);

function ProfileController(Employee, ThirdParties, analytics, $location, $rootScope, $routeParams, $scope) {
    /* Since this page can be the root for some users let's make sure we capture the correct page */
    var location_url = $location.url().indexOf('/profile') < 0 ? '/profile' : $location.url();
    analytics.trackPage($scope, $location.absUrl(), location_url);
    var vm = this;
    vm.employee = null;
    vm.moreInfoCollapse = true;
    vm.filterCommentsByType = filterCommentsByType;
    vm.filterCommentsByView = filterCommentsByView;
    vm.filterCommentsByThirdParty = filterCommentsByThirdParty;
    vm.filter = {type: null, view: 'me', third_party: null};
    vm.third_parties = [];

    activate();

    function activate() {
        resetFilter();
        getEmployee();
        getThirdParties();
    };

    function getEmployee() {
        Employee.get(
            {id: $routeParams.id},
            function (data) {
                vm.employee = data;
                vm.employee.hire_date = $rootScope.parseDate(vm.employee.hire_date);
            }
        );
    }

    function getThirdParties() {
        ThirdParties.query(
            null,
            function (data) {
                vm.third_parties = data;
            }
        )
    }

    function filterCommentsByType(type) {
        vm.filter.type = type;
        filterComments();
    }

    function filterCommentsByView(view) {
        vm.filter.view = view;
        filterComments();
    }

    function filterCommentsByThirdParty(third_party) {
        vm.filter.type = 'thirdpartyevent';
        vm.filter.third_party = third_party;
        filterComments();

    }

    function filterComments() {
        $scope.$broadcast('filterComments', vm.filter);
        resetFilter()
    }

    function resetFilter() {
        vm.filter.type = null;
        vm.filter.third_party = null;
    }

}