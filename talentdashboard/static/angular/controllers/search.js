angular.module('tdb.controllers.search', [])

    .controller('SearchCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$modal', 'Employee', 'Customers', 'Team', function ($scope, $rootScope, $routeParams, $location, $modal, Employee, Customers, Team) {

        //clear search
        $scope.navQuery = '';

        if (!$scope.employees) {
            $scope.employees = Employee.query(); //!important browser cache buster
        }

        Customers.get(function (data) {
            $scope.customer = data;
        });

        if (!$scope.employees && $rootScope.currentUser.can_view_company_dashboard) {
            $scope.employees = Employee.query();
        }
 	}]);