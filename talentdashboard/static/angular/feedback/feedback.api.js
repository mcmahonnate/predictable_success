(function() {
angular
    .module('feedback')
    .factory('FeedbackAPI', FeedbackAPI);

FeedbackAPI.$inject = ['$http', '$log', 'FeedbackRequestResource', 'FeedbackSubmissionResource'];

function FeedbackAPI($http, $log, FeedbackRequestResource, FeedbackSubmissionResource) {
    return {
        getFeedbackRequest: getFeedbackRequest,
        sendFeedbackRequests: sendFeedbackRequests,
        getFeedbackRequests: getFeedbackRequests,
        getPotentialReviewers: getPotentialReviewers,
        respondToFeedbackRequest: respondToFeedbackRequest,
    };

    function sendFeedbackRequests(reviewers, message) {
        var requests = [];

        for(var i=0; i < reviewers.length; i++) {
            requests.push({reviewer: reviewers[i].id, message: message});
        }

        return FeedbackRequestResource.sendFeedbackRequests(requests).$promise
            .then(complete)
            .catch(failed);

        function complete(response) {
            return response;
        }

        function failed(error) {
            console.log.error('sendFeedbackRequests failed.' + error.data);
        }
    }

    function getFeedbackRequest(id) {
        return FeedbackRequestResource.get({id: id}).$promise
            .then(getFeedbackRequestsComplete)
            .catch(getFeedbackRequestsFailed);

        function getFeedbackRequestsComplete(response) {
            return response;
        }

        function getFeedbackRequestsFailed(error) {
            $log.error('getFeedbackRequests failed');
        }
    }

    function getFeedbackRequests() {
        return FeedbackRequestResource.getFeedbackRequests().$promise
            .then(getFeedbackRequestsComplete)
            .catch(getFeedbackRequestsFailed);

        function getFeedbackRequestsComplete(response) {
            return response;
        }

        function getFeedbackRequestsFailed(error) {
            $log.error('getFeedbackRequests failed');
        }
    }

    function getPotentialReviewers() {
        return $http.get('/api/v1/feedback/potential-reviewers/')
            .then(getPotentialReviewersComplete)
            .catch(getPotentialReviewersFailed);

        function getPotentialReviewersComplete(response) {
            return response.data;
        }

        function getPotentialReviewersFailed(error) {
            $log.error('getPotentialReviewers failed');
        }
    }

    function respondToFeedbackRequest(feedbackRequest, excelsAt, couldImproveOn, anonymous)
    {
        var submission = {
            feedback_request: feedbackRequest.id,
            subject: feedbackRequest.requester.id,
            excels_at: excelsAt,
            could_improve_on: couldImproveOn,
            anonymous: anonymous
        };
        return FeedbackSubmissionResource.save(submission).$promise
            .then(success)
            .catch(fail);

        function success(response) {
            return response;
        }

        function fail(error) {
            $log.error('respondToFeedbackRequest failed');
        }

    }
}
})();