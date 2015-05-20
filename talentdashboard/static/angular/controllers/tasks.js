angular.module('tdb.controllers.tasks', [])

    .controller('CreateTaskCtrl', ['$scope', '$modalInstance', '$routeParams', 'Coach', 'Task', 'employeeId', function($scope, $modalInstance, $routeParams, Coach, Task, employeeId) {
        $scope.task = new Task(
            {
                employee: employeeId,
                description: '',
                assigned_to: null,
                due_date: null
            }
        );
        $scope.coaches = Coach.query();
        $scope.save = function () {
            if(!$scope.task.description) return;

            $scope.task.$save(function (result) {
                $modalInstance.close(result);
            });
        };

        $scope.cancel = function() {
            $modalInstance.dismiss();
        }
    }])

    .controller('EditTaskCtrl', ['$scope', '$modalInstance', 'Coach', 'Task', 'task', function($scope, $modalInstance, Coach, Task, task) {
        $scope.task = new Task(
            {
                id: task.id,
                employee: task.employee.id,
                assigned_to: task.assigned_to ? task.assigned_to.id : null,
                assigned_by: task.assigned_by ? task.assigned_by.id : null,
                due_date: task.due_date,
                completed: task.completed,
                description: task.description
            }
        );
        $scope.coaches = Coach.query();

        $scope.save = function () {
            if(!$scope.task.description) return;
            Task.update($scope.task, (function (value) {
                $modalInstance.close(value);
            }));
        };

        $scope.cancel = function() {
            $modalInstance.dismiss();
        }
    }])

    .controller('TaskListCtrl', ['$scope', '$attrs', '$modal', 'Task', function ($scope, $attrs, $modal, Task) {
        var employee_id = $scope.employee ? $scope.employee.id : null;
        $scope.canAddNew = false;

        if(employee_id) {
            // Employee view
            $scope.canAddNew = true;
            $scope.todos = Task.query({ employee_id: employee_id, completed: false });
            $scope.done = Task.query({ employee_id: employee_id, completed: true });
        } else {
            // "My" view
            $scope.todos = Task.query({completed: false, filter: 'mine'});
            $scope.done = Task.query({completed: true, filter: 'mine'});
        }

        $scope.todoTab = 'todo';
        $scope.doneTab = 'done';
        $scope.activeTab = $scope.todoTab;

        $scope.setActiveTab = function(tab) {
            $scope.activeTab = tab;
        };

        $scope.newTask = function() {
            if(!$scope.canAddNew) return;
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/static/angular/partials/_widgets/add-edit-task.html',
                controller: 'CreateTaskCtrl',
                resolve: {
                    employeeId: function() { return employee_id }
                }
            });

            modalInstance.result.then(
                function (newTask) {
                    $scope.todos.push(newTask);
                    $scope.setActiveTab($scope.todoTab);
                }
            );
        };

        $scope.editTask = function(task) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/static/angular/partials/_widgets/add-edit-task.html',
                controller: 'EditTaskCtrl',
                resolve: {
                    task: function() { return task }
                }
            });

            modalInstance.result.then(
                function (editedTask) {
                    replaceItemInList($scope.todos, task, editedTask);
                }
            );
        };

        $scope.deleteTask = function(task) {
            task.$delete();
            removeItemFromList($scope.todos, task);
        };

        $scope.toggleCompleted = function(task) {
            task.completed = !task.completed;
            Task.update(new Task(
            {
                id: task.id,
                employee: task.employee.id,
                assigned_to: task.assigned_to ? task.assigned_to.id : null,
                assigned_by: task.assigned_by ? task.assigned_by.id : null,
                due_date: task.due_date,
                completed: task.completed,
                description: task.description
            }));
        };

        var removeItemFromList = function(list, item) {
            var index = list.indexOf(item);
            list.splice(index, 1);
        };

        var replaceItemInList = function(list, currentItem, newItem) {
            var index = list.indexOf(currentItem);
            list.splice(index, 1);
            list.splice(index, 0, newItem);
        }
    }]);