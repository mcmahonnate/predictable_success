angular
    .module('feedback')
    .factory('FeedbackProgressReportResource', FeedbackProgressReportResource);

function FeedbackProgressReportResource($resource) {
    return $resource('/api/v1/feedback/reports/coachees/:id/');
}
