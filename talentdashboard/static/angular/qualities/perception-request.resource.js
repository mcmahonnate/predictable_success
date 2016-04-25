angular
    .module('qualities')
    .factory('PerceptionRequestResource', PerceptionRequestResource);

function PerceptionRequestResource($resource) {
    var actions = {
        'sendPerceptionRequests': {
            method: 'POST',
            isArray: true
        },
        'getPerceptionRequests': {
            url: '/api/v1/qualities/requests/todo/',
            method: 'GET',
            isArray: true
        },
        'getMyRecentlySentRequests': {
            url: '/api/v1/qualities/requests/recently-sent/',
            method: 'GET',
            isArray: true
        }
    };
    return $resource('/api/v1/qualities/requests/:id/', null, actions);
}
