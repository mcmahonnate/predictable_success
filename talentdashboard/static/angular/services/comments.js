angular.module('tdb.services.comments', ['ngResource'])

    .factory('Comment', ['$resource', function ($resource) {
        var actions = {
            'update': {
                method: 'PUT',
                isArray: false
            },
            'getCheckInComments': {
                'method': 'GET',
                'url': '/api/v1/comments/checkins/:id/'
            },
            'addToCheckIn': {
                'method': 'POST',
                'url': '/api/v1/comments/checkins/:id/'
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