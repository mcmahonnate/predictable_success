(function() {
angular
    .module('feedback')
    .factory('FeedbackRequestResource', FeedbackRequestResource);

FeedbackRequestResource.$inject = ['$resource'];

function FeedbackRequestResource($resource) {
    var actions = {
        'sendFeedbackRequests': {
            method: 'POST',
            isArray: true
        }
    };
    return $resource('/api/v1/feedback/requests/:id/', null, actions);
}
})();
