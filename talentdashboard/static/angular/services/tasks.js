angular.module('tdb.services.tasks', ['ngResource'])

    .factory('MyTasks', ['$resource', function ($resource) {
        return $resource('/api/v1/tasks/mine/');
    }])

    .factory('Task', ['$resource', function ($resource) {
        var forEditing = function (task) {
            var copy = angular.copy(task);
            return {
                    id: copy.id,
                    employee: copy.employee.id,
                    assigned_to: copy.assigned_to ? copy.assigned_to.id : null,
                    assigned_by: copy.assigned_by ? copy.assigned_by.id : null,
                    due_date: copy.due_date,
                    completed: copy.completed,
                    description: copy.description
                };
        };

        var extraMethods = {
            'update': {
                method: 'PUT',
                transformRequest: [
                    forEditing,
                    angular.toJson
                ]
            }
        };

        var Task = $resource('/api/v1/tasks/:id/', {id: '@id'}, extraMethods);

        return Task;
    }])
;