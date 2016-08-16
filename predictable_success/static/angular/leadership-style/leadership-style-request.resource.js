angular
    .module('leadership-style')
    .factory('LeadershipStyleRequestResource', LeadershipStyleRequestResource);

function LeadershipStyleRequestResource($resource) {
    var actions = {
        'getMyRecentlySentRequests': {
            url: '/api/v1/leadership-style/requests/recently-sent/',
            method: 'GET',
            isArray: true
        },
        'getLeadershipStyleRequests': {
            url: '/api/v1/leadership-style/requests/todo/',
            method: 'GET',
            isArray: true
        },
        'getRequest': {
            method: 'GET',
        },
        'sendLeadershipStyleRequests': {
            method: 'POST',
            isArray: true
        },
    };
    return $resource('/api/v1/leadership-style/requests/:id/', null, actions);
}
