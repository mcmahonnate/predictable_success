angular
    .module('checkins')
    .factory('CheckInsReportService', CheckInsReportService);

function CheckInsReportService($http, $log) {
    return {
        getCheckInsReport: getCheckInsReport
    };

    function getCheckInsReport(start_date, end_date) {
        return $http.get('/api/v1/checkins/reports/', {params:{start_date: start_date, end_date: end_date}})
            .then(success)
            .catch(fail);

        function success(response) {
            return response.data;
        }

        function fail(response) {
            $log.error('getCheckInReport failed');
        }
    }
}