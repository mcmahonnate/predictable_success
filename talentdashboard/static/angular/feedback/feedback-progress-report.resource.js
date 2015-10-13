(function() {
angular
    .module('feedback')
    .factory('FeedbackProgressReportResource', FeedbackProgressReportResource);

FeedbackProgressReportResource.$inject = ['$resource'];

function FeedbackProgressReportResource($resource) {
    return $resource('/api/v1/feedback/progress-reports/:id/');
}
})();
