angular
    .module('feedback')
    .factory('FeedbackRequestResource', FeedbackRequestResource);

function FeedbackRequestResource($resource) {
    var actions = {
        'getFeedbackRequests': {
            url: '/api/v1/feedback/requests/todo/',
            method: 'GET',
            isArray: true
        },
        'getMyRecentlySentRequests': {
            url: '/api/v1/feedback/requests/recently-sent/',
            method: 'GET',
            isArray: true
        },
        'poke': {
            method: 'PUT',
            isArray: true
        },
        'sendFeedbackRequests': {
            method: 'POST',
            isArray: true
        },
    };
    return $resource('/api/v1/feedback/requests/:id/', null, actions);
}
