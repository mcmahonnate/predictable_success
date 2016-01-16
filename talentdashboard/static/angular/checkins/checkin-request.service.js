angular
    .module('checkins')
    .factory('CheckInRequestService', CheckInRequestService);

function CheckInRequestService($http, $log, CheckInRequestResource) {
    return {
        getMyCheckInRequests: getMyCheckInRequests,
        getMyCheckInToDos: getMyCheckInToDos,
        sendCheckInRequest: sendCheckInRequest,
        cancelRequest: cancelRequest
    };

    function getMyCheckInRequests() {
        return CheckInRequestResource.getMyCheckInRequests(null, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getMyCheckInRequests failed');
        }
    }

    function getMyCheckInToDos() {
        return CheckInRequestResource.getMyCheckInToDos(null, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getMyCheckInToDos failed');
        }
    }

    function sendCheckInRequest(host) {
        return CheckInRequestResource.sendCheckInRequest({'host': host}, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('sendCheckInRequest failed');
        }
    }

    function cancelRequest(request) {
        return CheckInRequestResource.cancelRequest({'id': request.id}, request, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('cancelRequest failed');
        }
    }

}