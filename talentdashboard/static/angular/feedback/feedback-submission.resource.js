angular
    .module('feedback')
    .factory('FeedbackSubmissionResource', FeedbackSubmissionResource);

function FeedbackSubmissionResource($resource) {
        var actions = {
            'update': {
                'method': 'PUT'
            }
        };
    return $resource('/api/v1/feedback/submissions/:id/', null, actions);
}
