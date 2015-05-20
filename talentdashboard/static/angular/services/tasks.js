angular.module('tdb.services.tasks', ['ngResource'])

    .factory('MyTasks', ['$resource', function ($resource) {
        return $resource('/api/v1/tasks/mine/');
    }])

    .factory('Task', ['$resource', function ($resource) {
        var forEditing = function (task) {
            var copy = angular.copy(task);
            copy.employee = copy.employee.id;
            copy.assigned_to = copy.assigned_to ? copy.assigned_to.id : null;
            copy.assigned_by = copy.assigned_by ? copy.assigned_by.id : null;
            return copy;
        };

        var forCreating = function (task) {
            var copy = angular.copy(task);
            copy.assigned_to = copy.assigned_to ? copy.assigned_to.id : null;
            copy.assigned_by = copy.assigned_by ? copy.assigned_by.id : null;
            return copy;
        };

        var actions = {
            'save': {
                method: 'POST',
                transformRequest: [
                    forCreating,
                    angular.toJson
                ]
            },
            'update': {
                method: 'PUT',
                transformRequest: [
                    forEditing,
                    angular.toJson
                ]
            }
        };

        var Task = $resource('/api/v1/tasks/:id/', {id: '@id'}, actions);

        return Task;
    }])
;