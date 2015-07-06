angular.module('tdb.controllers.checkins', [])

    .controller('AddEditCheckInCtrl', ['$scope', '$rootScope', '$routeParams', 'CheckIn', 'CheckInType', 'Engagement', 'Employee', function ($scope, $rootScope, $routeParams, CheckIn, CheckInType, Engagement, Employee) {
        $scope.checkin = new CheckIn();
        $scope.engagement = new Engagement();
        $scope.tasks = [];
        $scope.navQuery = '';
        $scope.selectedEmployee = null;

        CheckInType.query({}, function(data) {
            $scope.checkinTypes = data;
        });

        // TODO: Solr-ize this
        if (!$scope.employees) {
            Employee.query({}, function(data) {
                $scope.employees = data;
            });
        }

        $scope.selectEmployee = function(employee) {
            $scope.navQuery = '';
            $scope.selectedEmployee = employee;
            $scope.checkin.employee = employee.id;
        };

        $scope.save = function (form) {
            if(form.$invalid) return;
            $scope.checkin.date = new Date(Date.now());
            $scope.checkin.$save(function (value) {
                // save engagement, if any
                // save tasks, if any
                // what here?
            });
        };

        $scope.cancel = function() {
            $scope.selectedEmployee = null;
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