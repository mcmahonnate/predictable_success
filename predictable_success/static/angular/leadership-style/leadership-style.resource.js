angular
    .module('leadership-style')
    .factory('LeadershipStyleResource', LeadershipStyleResource);

function LeadershipStyleResource($resource) {
    var actions = {
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
        }
    };
    return $resource('/api/v1/leadership-style/:id/', null, actions);
}
