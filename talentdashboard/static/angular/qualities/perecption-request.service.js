angular
    .module('qualities')
    .factory('PerceptionRequestService', PerceptionRequestService);

function PerceptionRequestService($log, PerceptionRequestResource) {
    return {
        sendPerceptionRequests: sendPerceptionRequests,
        getMyRecentlySentRequests: getMyRecentlySentRequests
    };

    function sendPerceptionRequests(reviewers, message, category) {
        var requests = [];

        for(var i=0; i < reviewers.length; i++) {
            var reviewer_id = reviewers[i].pk ? reviewers[i].pk : reviewers[i].id
            requests.push({reviewer: reviewer_id, message: message, category: category.id});
        }

        return PerceptionRequestResource.sendPerceptionRequests(requests, success, fail).$promise;

        function success(sentPerceptionRequests) {
            return sentPerceptionRequests;
        }

        function fail(response) {
            $log.error('sendPerceptionRequests failed');
        }
    }

    function getMyRecentlySentRequests() {
        return PerceptionRequestResource.getMyRecentlySentRequests(null, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getMyRecentlySentRequests failed');
        }
    }
}