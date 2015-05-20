angular.module('tdb.services.tasks', ['ngResource'])

.factory('MyTasks', ['$resource', function($resource) {
    return $resource('/api/v1/tasks/mine/');
}])

.factory('Task', ['$resource', function($resource) {
    var extraMethods = {
        'update': {
            method: 'PUT'
        }
    };
    return $resource('/api/v1/tasks/:id/', {id:'@id'}, extraMethods);
}])
;