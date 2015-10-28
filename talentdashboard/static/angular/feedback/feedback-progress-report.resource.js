angular
    .module('feedback')
    .factory('FeedbackProgressReportResource', FeedbackProgressReportResource);

function FeedbackProgressReportResource($resource) {
    return $resource('/api/v1/feedback/progress-reports/:id/');
}
