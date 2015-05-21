angular.module('tdb.services.tasks', ['ngResource'])

    .factory('MyTasks', ['$resource', function ($resource) {
        return $resource('/api/v1/tasks/mine/');
    }])

    .factory('Task', ['$resource', '$filter', function ($resource, $filter) {
        var fromServer = function(task) {
            var copy = angular.copy(task);
            copy.due_date = copy.due_date ? new Date(copy.due_date) : null;
            copy.created_date = copy.created_date ? new Date(copy.created_date) : null;
            return copy
        };

        var manyFromServer = function(taskList) {
            var newList = [];
            for(var index = 0; index < taskList.length; index++) {
                newList.push(fromServer(taskList[index]));
            }
            return newList;
        };

        var forEditing = function (task) {
            var copy = angular.copy(task);
            copy.employee = copy.employee.id;
            copy.assigned_to = copy.assigned_to ? copy.assigned_to.id : null;
            copy.assigned_by = copy.assigned_by ? copy.assigned_by.id : null;
            copy.due_date = copy.due_date ? copy.due_date.toISOString() : null;
            return copy;
        };

        var forCreating = function (task) {
            var copy = angular.copy(task);
            copy.assigned_to = copy.assigned_to ? copy.assigned_to.id : null;
            copy.assigned_by = copy.assigned_by ? copy.assigned_by.id : null;
            copy.due_date = copy.due_date ? copy.due_date.toISOString() : null;
            return copy;
        };

        var actions = {
            'get': {
                method: 'GET',
                transformResponse: [
                    angular.fromJson,
                    fromServer
                ]
            },
            'query': {
                method: 'GET',
                isArray: true,
                transformResponse: [
                    angular.fromJson,
                    manyFromServer
                ]
            },
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