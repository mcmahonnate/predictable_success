angular
    .module('profile')
    .controller('ProfileController', ProfileController);

function ProfileController(Employee, analytics, $location, $rootScope, $routeParams, $scope) {
    /* Since this page can be the root for some users let's make sure we capture the correct page */
    var location_url = $location.url().indexOf('/profile') < 0 ? '/profile' : $location.url();
    analytics.trackPage($scope, $location.absUrl(), location_url);
    var vm = this;
    vm.employee = null;
    vm.moreInfoCollapse = true;
    vm.filterCommentsByType = filterCommentsByType;
    vm.filterCommentsByView = filterCommentsByView;
    vm.filter = {type: null, view: 'me'};
    vm.filterCommentsDone = false;

    activate();

    function activate() {
        getEmployee();
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

    function filterCommentsByType(type) {
        vm.filter.type = type;
        vm.filterCommentsDone = false;
        filterComments();
    }

    function filterCommentsByView(view) {
        vm.filter.view = view;
        vm.filterCommentsDone = false;
        filterComments();
    }

    function filterComments() {
        $scope.$broadcast('filterComments', vm.filter);
    }


    $scope.$on("filterCommentsDone", function(e, finished) {
        vm.filterCommentsDone = finished;
        $scope.$apply();
    })


}