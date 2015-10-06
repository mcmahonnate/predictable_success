(function() {
angular
    .module('feedback')
    .factory('FeedbackSubmissionResource', FeedbackSubmissionResource);

FeedbackSubmissionResource.$inject = ['$resource'];

function FeedbackSubmissionResource($resource) {
    return $resource('/api/v1/feedback/submissions/:id/');
}
})();