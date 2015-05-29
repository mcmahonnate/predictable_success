angular.module('tdb.controllers.tasks', [])

    .controller('AddEditTaskCtrl', ['$scope', '$rootScope', '$modalInstance', '$routeParams', 'Coach', 'Task', 'task', function ($scope, $rootScope, $modalInstance, $routeParams, Coach, Task, task) {
        $scope.task = angular.copy(task);
        $scope.task.assigned_by = $rootScope.currentUser.employee;
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
        $scope.todos = [];
        $scope.done = [];
        $scope.loadTasks = function(completed) {
            $scope.busy = true;

            var page;
            if (completed) {page = $scope.done_page + 1}
            else {page = $scope.todo_page + 1}

            var query = {completed: completed, filter: 'mine', page: page};
            if (employee_id) {
                $scope.canAddNew = true;
                query = {employee_id: employee_id, completed: completed, page: page};
            }

            Task.get(query, function(data) {
                console.log(query);
                $scope.new_todos = data.results;
                angular.forEach($scope.new_todos, function (todo) {
                    if (completed) {
                        $scope.done_has_next = data.has_next;
                        $scope.done_page = data.page;
                        $scope.done.push(todo);
                    } else {
                        $scope.todo_has_next = data.has_next;
                        $scope.todo_page = data.page;
                        $scope.todos.push(todo);
                    }
                });
                $scope.busy = false;
            });
        };
        $scope.busy = false;
        $scope.done_has_next = true;
        $scope.todo_has_next = true;
        $scope.done_page = 0;
        $scope.todo_page = 0;
        $scope.loadTasks(false); //load todos
        $scope.loadTasks(true); //load done todos

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