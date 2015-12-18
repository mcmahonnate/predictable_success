angular.module('tdb.checkins.controllers', [])

    .controller('AddEditCheckInCtrl', ['$rootScope', '$scope', '$q', '$routeParams', '$location', '$modal', 'CheckIn', 'CheckInType', 'Happiness', 'Task', 'Employee', 'Notification', '$window', 'analytics', function ($rootScope, $scope, $q, $routeParams, $location, $modal, CheckIn, CheckInType, Happiness, Task, Employee, Notification, $window, analytics) {
        analytics.trackPage($scope, $location.absUrl(), $location.url());
        var initialize = function() {
            $scope.checkin = new CheckIn({date: new Date(Date.now())});
            $scope.happiness = new Happiness({assessment: 0});
            $scope.tasks = [];
            $scope.employeeSearch = '';

        };
        initialize();


        CheckInType.query({}, function(data) {
            $scope.checkinTypes = data;
        });

        // TODO: Solr-ize this
        if (!$scope.employees) {
            Employee.query({show_hidden: true, u: $rootScope.currentUser.id}, function(data) {
                $scope.employees = data;
            });
        }

        $scope.selectEmployee = function(employee) {
            $scope.employeeSearch = employee.full_name;
            $scope.selectedEmployee = employee;
            $scope.checkin.employee = $scope.happiness.employee = employee.id;
            $scope.showSearch = false;
        };


        // View switch
        $scope.$watch('view', function () {

            // New Check-in
            if ($scope.view == 'new') { 
                if ($routeParams.id) { 
                    Employee.get({id:$routeParams.id})
                        .$promise.then(
                            //success
                            function(employee){
                                $scope.selectedEmployee = employee;
                                $scope.checkin.employee = $scope.happiness.employee = employee.id;
                            },
                            //error
                            function( error ){
                                $scope.showSearch = true;
                            }
                        );
                } else {
                    $scope.showSearch = true;
                }  
            }

            // Check-in Details
            if ($scope.view == 'detail') { 
                $scope.loadCheckin = CheckIn.get({ id : $routeParams.checkinId }, function(data) {
                    $scope.checkin = data;
                }, function(response) {
                    if(response.status === 404) {
                         $location.url('checkin');
                    }
                });
            }   
        });


        $scope.newTask = function(form) {
            if(form.$invalid) return;
            $scope.newTask = new Task();
        };


        $scope.newTask = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/static/angular/partials/_modals/add-edit-task.html',
                controller: 'AddEditTaskCtrl',
                resolve: {
                    task: function () {
                        return new Task({employee: $scope.selectedEmployee.id});
                    }
                }
            });

            modalInstance.result.then(
                function (newTask) {
                    $scope.tasks.push(newTask);
                }
            );
        };

        $scope.editTask = function(task) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/static/angular/partials/_modals/add-edit-task.html',
                controller: 'AddEditTaskCtrl',
                resolve: {
                    task: function () {
                        return task;
                    }
                }
            });

            modalInstance.result.then(
                function (editedTask) {
                    $rootScope.replaceItemInList($scope.tasks, task, editedTask);   
                }
            );
        };


        $scope.saveSummary = function (checkin) {
            data = {summary: checkin.summary, id: checkin.id, employee: checkin.employee.id, type: checkin.type.id};
            CheckIn.update(data, function() {
                $scope.showSummaryEdit = false;
                Notification.success("Saved!");
            });
        }

        $scope.saveCheckin = function (form) {
            if(form.$invalid) return;

            var saveHappiness = function() {
                if($scope.happiness.assessment) {
                    return $scope.happiness.$save();
                } else {
                    var deferred = $q.defer();
                    deferred.resolve(null);
                    return deferred.promise;
                }
            };

            // Save the Happiness, if any
            saveHappiness()
            .then(function(newHappiness) {
                if(newHappiness) {
                    $scope.checkin.happiness = newHappiness.id;
                }
                // Save the CheckIn
                $scope.checkin.type = $scope.checkin.type.id;
                $scope.checkin.$save()
                .then(function(newCheckin) {
                    var promises = [];
                    // Save the Tasks, if any
                    angular.forEach($scope.tasks, function(task) {
                       task.checkin = newCheckin.id;
                       promises.push(task.$save());
                    });
                    $q.all(promises).then(function() {
                        // Redirect to the CheckIn detail
                        $location.path("/checkins/" + newCheckin.id);
                        Notification.success("Successfully created Check-in!");
                    });
                })
            });
        };

        $scope.deleteTask = function(task) {
            $rootScope.removeItemFromList($scope.tasks, task);
        };

        $scope.deleteCheckin = function(checkin) {
            if ($window.confirm('Are you sure you want to delete this check-in?')) {
                var data = {id: checkin.id};

                CheckIn.remove(data, function() {
                    $location.path("/checkin");
                    Notification.success("Successfully deleted check-in!");    
                });
            }
        };

        $scope.cancel = function() {
            initialize();
        };

        $scope.busy = false;
    }]);
