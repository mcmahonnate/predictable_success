angular.module('tdb.controllers.tasks', [])

    .controller('AddEditTaskCtrl', ['$scope', '$modalInstance', '$routeParams', 'Coach', 'Task', 'task', function ($scope, $modalInstance, $routeParams, Coach, Task, task) {
        $scope.task = angular.copy(task);

        $scope.datePicker = {
            isOpen: false,
            dateFormat: 'mediumDate'
        };

        $scope.coaches = Coach.query();

        $scope.taskIsBeingEdited = function() {
            return $scope.task.id && $scope.task.id > 0;
        };

        $scope.save = function () {
            if (!$scope.task.description) return;

            if($scope.taskIsBeingEdited()) {
                Task.update($scope.task, (function (value) {
                    $modalInstance.close(value);
                }));
            } else {
                $scope.task.$save(function (value) {
                    $modalInstance.close(value);
                });
            }
        };

        $scope.openDatePicker = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.datePicker.isOpen = true;
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        }
    }])

    .controller('TaskListCtrl', ['$scope', '$attrs', '$modal', 'Task', function ($scope, $attrs, $modal, Task) {
        var employee_id = $scope.employee ? $scope.employee.id : null;
        $scope.canAddNew = false;

        if (employee_id) {
            $scope.canAddNew = true;
            $scope.todos = Task.query({ employee_id: employee_id, completed: false });
            $scope.done = Task.query({ employee_id: employee_id, completed: true });
        } else {
            $scope.todos = Task.query({completed: false, filter: 'mine'});
            $scope.done = Task.query({completed: true, filter: 'mine'});
        }

        $scope.todoTab = 'todo';
        $scope.doneTab = 'done';
        $scope.activeTab = $scope.todoTab;

        $scope.setActiveTab = function (tab) {
            $scope.activeTab = tab;
        };

        $scope.newTask = function () {
            if (!$scope.canAddNew) return;
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/static/angular/partials/_widgets/add-edit-task.html',
                controller: 'AddEditTaskCtrl',
                resolve: {
                    task: function () {
                        return new Task({employee: employee_id});
                    }
                }
            });

            modalInstance.result.then(
                function (newTask) {
                    $scope.todos.push(newTask);
                    $scope.setActiveTab($scope.todoTab);
                }
            );
        };

        $scope.editTask = function (task) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/static/angular/partials/_widgets/add-edit-task.html',
                controller: 'AddEditTaskCtrl',
                resolve: {
                    task: function () {
                        return task
                    }
                }
            });

            modalInstance.result.then(
                function (editedTask) {
                    replaceItemInList($scope.todos, task, editedTask);
                }
            );
        };

        $scope.deleteTask = function (task) {
            task.$delete();
            removeItemFromList($scope.todos, task);
        };

        $scope.toggleCompleted = function (task) {
            Task.update(task);
        };

        var removeItemFromList = function (list, item) {
            var index = list.indexOf(item);
            list.splice(index, 1);
        };

        var replaceItemInList = function (list, currentItem, newItem) {
            var index = list.indexOf(currentItem);
            list.splice(index, 1);
            list.splice(index, 0, newItem);
        }
    }]);