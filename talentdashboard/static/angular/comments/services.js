angular.module('tdb.comments.services', ['ngResource'])

    .factory('Comment', ['$resource', function ($resource) {
        var actions = {
            'update': {
                method: 'PUT',
                isArray: false
            },
            'getCheckInComments': {
                'method': 'GET',
                'url': '/api/v1/checkins/:id/comments/'
            },
            'addToCheckIn': {
                'method': 'POST',
                'url': '/api/v1/checkins/:id/comments/'
            },
            'addToEmployeeZone': {
                'method': 'POST',
                'url': '/api/v1/devzones/selfies/:id/comments/'
            },
            'addToProject': {
                'method': 'POST',
                'url': '/api/v1/projects/:id/comments/'
            },
            'addToEmployee': {
                'method': 'POST',
                'url': '/api/v1/comments/employees/:id/'
            },
            'addToComment': {
                'method': 'POST',
                'url': '/api/v1/comments/:id/replies/'
            }
        };
        return $resource('/api/v1/comments/:id/', {id: '@id'}, actions);
    }])

    .factory('EmployeeComments', ['$resource', '$http', function($resource, $http) {
        var actions = {
            'addNew': { method:'POST' },
            'update': { method:'PUT' }
        };
        var res = $resource('/api/v1/comments/employees/:id/', {id:'@id'}, actions);
        return res;
    }])

    .factory('CommentReport', ['$resource', '$http', function($resource, $http) {
        var res = $resource('/api/v1/reports/comments');
        return res;
    }])
;