angular
    .module('devzones')
    .factory('DevZonesReportService', DevZonesReportService);

function DevZonesReportService($http, $log) {
    return {
        getDevZonesReport: getDevZonesReport
    };

    function getDevZonesReport(start_date, end_date) {
        return $http.get('/api/v1/devzones/reports/', {params:{start_date: start_date, end_date: end_date}})
            .then(success)
            .catch(fail);

        function success(response) {
            return response.data;
        }

        function fail(response) {
            $log.error('getDevZonesReport failed');
        }
    }
}