angular
    .module('feedback')
    .factory('FeedbackRequestResource', FeedbackRequestResource);

function FeedbackRequestResource($resource) {
    var actions = {
        'sendFeedbackRequests': {
            method: 'POST',
            isArray: true
        },
        'getFeedbackRequests': {
            url: '/api/v1/feedback/requests/todo/',
            method: 'GET',
            isArray: true
        },
        'getMyRecentlySentRequests': {
            url: '/api/v1/feedback/requests/recently-sent/',
            method: 'GET',
            isArray: true
        }
    };
    return $resource('/api/v1/feedback/requests/:id/', null, actions);
}
