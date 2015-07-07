angular.module('tdb.controllers.checkins', [])

    .controller('AddEditCheckInCtrl', ['$scope', '$rootScope', '$routeParams', 'CheckIn', 'CheckInType', 'Happiness', 'Employee', function ($scope, $rootScope, $routeParams, CheckIn, CheckInType, Happiness, Employee) {
        var initialize = function() {
            $scope.checkin = new CheckIn();
            $scope.happiness = new Happiness({assessment: 0});
            $scope.tasks = [];
            $scope.employeeSearch = '';
            $scope.selectedEmployee = null;
        };
        initialize();

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
            $scope.employeeSearch = '';
            $scope.selectedEmployee = employee;
            $scope.checkin.employee = $scope.happiness.employee = employee.id;
        };

        $scope.save = function (form) {
            if(form.$invalid) return;

            var saveCheckin = function() {
                $scope.checkin.date = new Date(Date.now());
                $scope.checkin.$save(function (checkin) {
                    $scope.checkin.id = checkin.id;
                    if($scope.tasks.length > 0) {
                        // save tasks

                    }
                    // redirect to checkin page
                });
            };

            if($scope.happiness.assessment) {
                $scope.happiness.$save(function(happiness) {
                    $scope.checkin.happiness = happiness.id;
                    saveCheckin();
                });
            } else {
                saveCheckin();
            }
        };

        $scope.cancel = function() {
            initialize();
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