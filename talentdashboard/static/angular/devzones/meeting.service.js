angular
    .module('devzones')
    .factory('MeetingService', MeetingService);

function MeetingService($http, $log, MeetingResource) {
    return {
        get: get,
        getMyMeetings: getMyMeetings
    }

    function get(meetingId) {
        return MeetingResource.get({id: meetingId}, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('get failed');
        }
    }

    function getMyMeetings() {
        return MeetingResource.getMyMeetings(null, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getMyMeetings failed');
        }
    }
}