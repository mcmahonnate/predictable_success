angular.module('tdb.controllers.checkins', [])

    .controller('AddEditCheckInCtrl', ['$scope', '$rootScope', '$routeParams', 'CheckIn', 'Employee', 'Customers', function ($scope, $rootScope, $routeParams, CheckIn, Employee, Customers) {
        $scope.checkin = new CheckIn();
        $scope.navQuery = '';
        $scope.selectedEmployee = '';

        //employee lookup
        if (!$scope.employees) { $scope.employees = Employee.query();} //!important browser cache buster

        //select employee
        $scope.selectEmployee = function(employee) {
            $scope.navQuery = '';
            $scope.selectedEmployee = employee;
            $scope.checkin.employee = employee.id;
        }

        $scope.save = function (form) {
            if(form.$invalid) return;
            $scope.checkin.$save(function (value) {
                $modalInstance.close(value);
            });
        };

        //show search
        $scope.showSearch = function() {
            $scope.selectedEmployee = '';
        };
    }])

    .controller('CheckInsCtrl', ['$scope', '$rootScope', '$modalInstance', '$routeParams', 'CheckIn', function ($scope, $rootScope, $modalInstance, $routeParams, CheckIn) {
        
        CheckIn.get(query, function(data) {
            $scope.checkins = data.results;
            angular.forEach($scope.checkins, function (checkin) {
                $scope.checkins.push(checkin);
            });
        });        

    }]);