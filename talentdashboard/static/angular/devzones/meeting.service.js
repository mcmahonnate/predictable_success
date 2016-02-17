angular
    .module('devzones')
    .factory('MeetingService', MeetingService);

function MeetingService($http, $log, DevZoneResource) {
    return {
        getMeeting: getMeeting
    }

    function getMeeting(meetingId) {
        var url = '/api/v1/devzones/meetings/' + meetingId + '/';
        return $http.get(url)
            .then(success)
            .catch(fail);

        function success(response) {
            return response.data;
        }

        function fail(response) {
            $log.error('getMeeting failed');
        }
    }
}