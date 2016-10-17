angular
    .module('leadership-style')
    .factory('LeadershipStyleResource', LeadershipStyleResource);

function LeadershipStyleResource($resource) {
    var actions = {
        'complete': {
            method: 'PUT',
            url: '/api/v1/leadership-style/:id/finish/'
        },
        'create': {
            method: 'POST',
            url: '/api/v1/leadership-style/create/'
        },
        'get': {
            method: 'GET',
            url: '/api/v1/leadership-style/:id/'
        },
        'getMy': {
            method: 'GET',
            url: '/api/v1/leadership-style/:id/'
        },
        'getTeases': {
            method: 'GET',
            url: '/api/v1/leadership-style/teases/',
            isArray: true
        },
        'getUnfinished': {
            method: 'GET',
            url: '/api/v1/leadership-style/unfinished/'
        },
        'retake': {
            method: 'PUT',
            url: '/api/v1/leadership-style/:id/retake/'
        },
        'share': {
            method: 'PUT',
            url: '/api/v1/leadership-style/:id/share/'
        },
        'update': {
            method: 'PUT',
            url: '/api/v1/leadership-style/:id/update/'
        },
        'goToPreviousQuestion': {
            method: 'PUT',
            url: '/api/v1/leadership-style/:id/previous-question/'
        }
    };
    return $resource('/api/v1/leadership-style/:id/', null, actions);
}
