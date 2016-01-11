angular
    .module('checkins')
    .controller('CheckInController', CheckInController);

function CheckInController(CheckInsService, Comment, Employee, EmployeeSearch, Happiness, Notification, Task, analytics, $location, $modal, $q, $rootScope, $routeParams, $scope, $window) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());

    var vm = this;
    vm.employees = []
    vm.checkin = {date: new Date(Date.now())};
    vm.checkinTypes = [];
    vm.newComment = null;
    vm.happiness = new Happiness({assessment: 0});
    vm.comments = [];
    vm.tasks = [];
    vm.employeeSearch = '';
    vm.selectEmployee = selectEmployee;
    vm.newTask = newTask;
    vm.editTask = editTask;
    vm.saveSummary = saveSummary;
    vm.saveCheckin = saveCheckin;
    vm.deleteTask = deleteTask;
    vm.deleteCheckin = deleteCheckin;
    vm.showSearch = false;
    vm.addComment = addComment;

    activate();

    function activate() {
        initializeNewComment()
        getEmployees();
        getCheckInTypes();
        if ($routeParams.checkinId) {
            getCheckIn();
        } else {
            getEmployee();
        }
    }

    function initializeNewComment() {
        vm.newComment = new Comment({content:'', include_in_daily_digest:true});
        vm.newComment.expandTextArea = false;
    }


    function getEmployee() {
        if ($routeParams.id) {
            Employee.get({id:$routeParams.id}).$promise
                .then(function(employee){
                        vm.selectedEmployee = employee;
                        vm.checkin.employee = vm.happiness.employee = employee.id;
                    }, function(error){
                        vm.showSearch = true;
                    }
                );
        } else {
            vm.showSearch = true;
        }
    }

    function getCheckIn() {
        CheckInsService.getCheckIn($routeParams.checkinId)
            .then(function(checkin){
                    vm.checkin = checkin;
                    vm.comments = vm.checkin.comments;
                }, function(error){
                    Notification.success("Sorry we had a problem opening this checkin.");
                }
            );
    }

    function getEmployees() {
        return EmployeeSearch.query().$promise
            .then(function (data) {
                vm.employees = data;
                return vm.employees;
            });
    }

    function getCheckInTypes() {
        CheckInsService.getTypes()
            .then(function (data) {
                vm.checkinTypes = data;
                return vm.checkinTypes;
            });
    }

    function selectEmployee(employee) {
        employee.id = employee.pk;
        vm.employeeSearch = employee.full_name;
        vm.selectedEmployee = employee;
        vm.checkin.employee = vm.happiness.employee = employee.id;
        vm.showSearch = false;
    }

    function newTask() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: '/static/angular/partials/_modals/add-edit-task.html',
            controller: 'AddEditTaskCtrl',
            resolve: {
                task: function () {
                    return new Task({employee: vm.checkin.employee});
                }
            }
        });
        modalInstance.result.then(
            function (newTask) {
                vm.tasks.push(newTask);
            }
        );
    };

    function editTask(task) {
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
                $rootScope.replaceItemInList(vm.tasks, task, editedTask);
            }
        );
    };

    function saveSummary(checkin) {
        var data = {summary: checkin.summary, id: checkin.id, employee: checkin.employee.id, type: checkin.type.id};
        CheckInsService.update(data)
            .then(function () {
                vm.showSummaryEdit = false;
                Notification.success("Saved!");
            }, function(error){
                Notification.success("Uh oh! We had a problem saving your edits!");
            });
    }

    function saveCheckin(form) {
        if(form.$invalid) return;

        var saveHappiness = function() {
            if(vm.happiness.assessment) {
                return vm.happiness.$save();
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
                vm.checkin.happiness = newHappiness.id;
            }
            // Save the CheckIn
            vm.checkin.type = vm.checkin.type.id;
            CheckInsService.save(vm.checkin)
            .then(function(newCheckin) {
                var promises = [];
                // Save the Tasks, if any
                angular.forEach(vm.tasks, function(task) {
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
    }

    function deleteTask(task) {
        $rootScope.removeItemFromList(vm.tasks, task);
    }

    function deleteCheckin(checkin) {
        if ($window.confirm('Are you sure you want to delete this check-in?')) {
            var data = {id: checkin.id};

            CheckIn.remove(data, function() {
                $location.path("/checkin");
                Notification.success("Successfully deleted check-in!");
            });
        }
    }

    function addComment(form) {
        if (form.$invalid) return;
        Comment.addToCheckIn({ id:$routeParams.checkinId}, vm.newComment, function(comment) {
            initializeNewComment();
            vm.comments.push(comment);
        });
    }
}