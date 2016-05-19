angular
    .module('profile')
    .controller('ProfileController', ProfileController);

function ProfileController(Employee, analytics, $location, $rootScope, $routeParams, $scope) {
    /* Since this page can be the root for some users let's make sure we capture the correct page */
    var location_url = $location.url().indexOf('/profile') < 0 ? '/profile' : $location.url();
    analytics.trackPage($scope, $location.absUrl(), location_url);
    var vm = this;
    vm.employee = null;

    Employee.get(
        {id: $routeParams.employeeId},
        function (data) {
            vm.employee = data;
            vm.employee.hire_date = $rootScope.parseDate(vm.employee.hire_date);
        }
    );
}