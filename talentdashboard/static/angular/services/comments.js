angular.module('tdb.services.comments', ['ngResource'])

    .factory('Comment', ['$resource', function ($resource) {
        var actions = {
            'getCheckInComments': {
                'method': 'GET',
                'isArray': true,
                'url': '/api/v1/checkins/:id/comments/'
            }
        };
        return $resource('/api/v1/comments/:id/', {id: '@id'}, actions);
    }])
;