angular.module('tdb.controllers.checkins', [])

    .controller('AddEditCheckInCtrl', ['$scope', '$q', '$routeParams', 'CheckIn', 'CheckInType', 'Happiness', 'Employee', function ($scope, $q, $routeParams, CheckIn, CheckInType, Happiness, Employee) {
        var initialize = function() {
            $scope.checkin = new CheckIn({date: new Date(Date.now())});
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

            var saveHappiness = function() {
                if($scope.happiness.assessment) {
                    return $scope.happiness.$save();
                } else {
                    var deferred = $q.defer();
                    deferred.resolve($scope.happiness);
                    return deferred.promise;
                }
            };

            saveHappiness()
            .then(function(newHappiness) {
                if(newHappiness.id) {
                    $scope.checkin.happiness = newHappiness.id;
                }
                $scope.checkin.$save()
                .then(function(newCheckin) {
                    if($scope.tasks.length > 0) {
                        // save tasks
                    }
                    // redirect to checkin page
                })
            });
        };

        $scope.cancel = function() {
            initialize();
        };
    }])

    .controller('CheckInsCtrl', ['$scope', '$modalInstance', '$routeParams', 'CheckIn', function ($scope, $modalInstance, $routeParams, CheckIn) {
        CheckIn.get(query, function(data) {
            $scope.checkins = data.results;
            angular.forEach($scope.checkins, function (checkin) {
                $scope.checkins.push(checkin);
            });
        });
    }]);