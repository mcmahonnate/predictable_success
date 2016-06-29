angular
    .module('profile')
    .factory('CoachProfileResource', CoachProfileResource);

function CoachProfileResource($resource) {
    var actions = {
        'create': {
            method: 'POST'
        },
        'get': {
            method: 'GET',
            url: '/api/v1/org/employees/:id/coaching/profile/'
        },
        'update': {
            url: '/api/v1/org/coaches/profile/:id/update/',
            method: 'PUT'
        },
    }
    return $resource('/api/v1/org/coaches/profile/', null, actions);
}