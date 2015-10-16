angular
    .module('feedback')
    .factory('FeedbackSubmissionResource', FeedbackSubmissionResource);

function FeedbackSubmissionResource($resource) {
    return $resource('/api/v1/feedback/submissions/:id/');
}
