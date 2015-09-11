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
;