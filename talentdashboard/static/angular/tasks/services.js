angular.module('tdb.tasks.services', ['ngResource'])

    .factory('Task', ['$resource', function ($resource) {
        var checkedPaged  = function(response) {
            if (response.page) {
                response.results = manyFromServer(response.results);
                return response;
            } else {
                return fromServer(response);
            }
        };

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
                    checkedPaged
                ]
            },
            'query': {
                method: 'GET',
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
                ],
                transformResponse: [
                    angular.fromJson,
                    fromServer
                ]
            },
            'update': {
                method: 'PUT',
                transformRequest: [
                    forEditing,
                    angular.toJson
                ],
                transformResponse: [
                    angular.fromJson,
                    fromServer
                ]
            },
            'delete': {
                'method': 'DELETE'
            }
        };

        var Task = $resource('/api/v1/tasks/:id/', {id: '@id'}, actions);
        return Task;
    }])

    .factory('EmployeeToDo', ['$resource', '$http', function($resource, $http) {
        var actions = {
            'addNew': { method:'POST', data:{description:'@description', completed: '@completed', assigned_to_id: '@assigned_to_id', due_date: '@due_date', owner_id: '@owner_id'}, isArray: false },
            'update': { method:'PUT', data:{description:'@description'}, isArray: false },
            'remove': { method:'DELETE' },
        }
        var EmployeeToDo = $resource('/api/v1/tasks/employees/:id/', {id:'@id', completed: '@completed'}, actions);

        EmployeeToDo.getReportForCompany = function(days_ahead) {
            var params = {id: 'all-employees', days_ahead: days_ahead};
            return this.query(params);
        };

        return EmployeeToDo;
    }])

    .factory('TaskReport', ['$resource', '$http', function($resource, $http) {
        var res = $resource('/api/v1/reports/tasks');
        return res;
    }])

    .factory('ToDo', ['$resource', '$http', function($resource, $http) {
        var actions = {
            'update': { method:'PUT', data:{description:'@description', completed: '@completed', assigned_to_id: '@assigned_to_id', due_date: '@due_date'}, isArray: false },
            'remove': { method:'DELETE' },
        }
        var res = $resource('/api/v1/tasks/:id/', {id:'@id'}, actions);
        return res;
    }])
;