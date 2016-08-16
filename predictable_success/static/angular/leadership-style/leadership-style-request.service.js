angular
    .module('leadership-style')
    .factory('LeadershipStyleRequestService', LeadershipStyleRequestService);

function LeadershipStyleRequestService($log, LeadershipStyleRequestResource) {
    return {
        sendLeadershipStyleRequests: sendLeadershipStyleRequests,
        getMyRecentlySentRequests: getMyRecentlySentRequests,
        getRequest: getRequest
    };

    function sendLeadershipStyleRequests(reviewers, message) {
        var requests = [];

        for(var i=0; i < reviewers.length; i++) {
            var reviewer_id = reviewers[i].pk ? reviewers[i].pk : reviewers[i].id
            requests.push({reviewer: reviewer_id, message: message});
        }

        return LeadershipStyleRequestResource.sendLeadershipStyleRequests(requests, success, fail).$promise;

        function success(sentLeadershipStyleRequests) {
            return sentLeadershipStyleRequests;
        }

        function fail(response) {
            $log.error('sendLeadershipStyleRequests failed');
        }
    }

    function getMyRecentlySentRequests() {
        return LeadershipStyleRequestResource.getMyRecentlySentRequests(null, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getMyRecentlySentRequests failed');
        }
    }

    function getRequest(id) {
        return LeadershipStyleRequestResource.getRequest({id: id}, null, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getRequest failed');
        }
    }
}