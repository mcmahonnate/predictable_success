angular.module('tdb.controllers.tasks', [])

    .controller('AddEditTaskCtrl', ['$scope', '$rootScope', '$modalInstance', '$routeParams', 'Users', 'Task', 'task', function ($scope, $rootScope, $modalInstance, $routeParams, Users, Task, task) {
        $scope.task = angular.copy(task);
        $scope.task.assigned_by = $rootScope.currentUser.employee;
        $scope.datePicker = {
            isOpen: false,
            dateFormat: 'mediumDate'
        };

        $scope.coaches = Users.query();

        $scope.taskIsBeingEdited = function() {
            return $scope.task.id && $scope.task.id > 0;
        };

        $scope.save = function (form) {
            if(form.$invalid) return;
            $modalInstance.close($scope.task);
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

    .controller('TaskListCtrl', ['$rootScope', '$scope', '$attrs', '$modal', 'Task', function ($rootScope, $scope, $attrs, $modal, Task) {
        var employee_id = $scope.employee ? $scope.employee.id : null;
        $scope.view = $attrs.view;
        $scope.filter = $attrs.filter;
        $scope.pageSize = $attrs.pageSize;
        $scope.canAddNew = false;
        $scope.todos = [];
        $scope.done = [];

        $scope.loadTasks = function(completed) {
            $scope.busy = true;

            var page;
            var filter = $scope.filter;

            if (!$scope.page_size) {
                var page_size = 5;
            }    

            if (completed) {page = $scope.done_page + 1}
            else {page = $scope.todo_page + 1}

            var query = {completed: completed, filter: filter, page: page, page_size: 20};
            
            if (employee_id) {
                $scope.canAddNew = true;
                query = {employee_id: employee_id, completed: completed, page: page, page_size: page_size};
            }

            Task.get(query, function(data) {
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

        $scope.newTask = function () {
            if (!$scope.canAddNew) return;
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/static/angular/partials/_modals/add-edit-task.html',
                controller: 'AddEditTaskCtrl',
                resolve: {
                    task: function () {
                        return new Task({employee: employee_id});
                    }
                }
            });

            modalInstance.result.then(
                function (newTask) {
                    newTask.$save(function(result) {
                        $scope.todos.push(result);
                    });
                }
            );
        };

        $scope.editTask = function (task) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/static/angular/partials/_modals/add-edit-task.html',
                controller: 'AddEditTaskCtrl',
                resolve: {
                    task: function () {
                        return task
                    }
                }
            });

            modalInstance.result.then(
                function (editedTask) {
                    Task.update(editedTask, function(result) {
                        $rootScope.replaceItemInList($scope.todos, task, result);
                    });
                }
            );
        };

        $scope.deleteTask = function (task) {
            Task.delete(task, function() {
                $rootScope.removeItemFromList($scope.todos, task);
            });
        };

        $scope.toggleCompleted = function (task) {
            Task.update(task);
        };

        $scope.loadTasks(false); //load todos
        $scope.loadTasks(true); //load done todos

    }]);