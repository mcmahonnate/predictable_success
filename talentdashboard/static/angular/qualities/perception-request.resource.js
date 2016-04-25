angular
    .module('qualities')
    .factory('PerceptionRequestResource', PerceptionRequestResource);

function PerceptionRequestResource($resource) {
    var actions = {
        'getMyRecentlySentRequests': {
            url: '/api/v1/qualities/requests/recently-sent/',
            method: 'GET',
            isArray: true
        },
        'getPerceptionRequests': {
            url: '/api/v1/qualities/requests/todo/',
            method: 'GET',
            isArray: true
        },
        'getRequest': {
            method: 'GET',
        },
        'sendPerceptionRequests': {
            method: 'POST',
            isArray: true
        },
    };
    return $resource('/api/v1/qualities/requests/:id/', null, actions);
}
