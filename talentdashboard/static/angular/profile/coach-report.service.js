angular
    .module('profile')
    .factory('CoachReportService', CoachReportService);

function CoachReportService($http, $log, CoachProfileResource) {
    return {
        getCoachCapacityReport: getCoachCapacityReport,
        getCoachBlacklistReport: getCoachBlacklistReport
    };

    function getCoachCapacityReport() {
        return $http.get('/api/v1/org/coaches/report/')
            .then(success)
            .catch(fail);

        function success(response) {
            return response.data;
        }

        function fail(response) {
            $log.error('getCoachCapacityReport failed');
        }
    }

    function getCoachBlacklistReport() {
        return $http.get('/api/v1/org/coaches/report/blacklist/')
            .then(success)
            .catch(fail);

        function success(response) {
            return response.data;
        }

        function fail(response) {
            $log.error('getCoachBlacklistReport failed');
        }
    }
}