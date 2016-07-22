angular
    .module('feedback')
    .factory('FeedbackReportService', FeedbackReportService);

function FeedbackReportService($http, $log, FeedbackRequestResource) {
    return {
        getFeedbackReport: getFeedbackReport
    };

    function getFeedbackReport(start_date, end_date, report_type) {
        return $http.get('/api/v1/feedback/reports/employees/', {params:{start_date: start_date, end_date: end_date, report_type: report_type}})
            .then(success)
            .catch(fail);

        function success(response) {
            return response.data;
        }

        function fail(response) {
            $log.error('getFeedbackReport failed');
        }
    }
}