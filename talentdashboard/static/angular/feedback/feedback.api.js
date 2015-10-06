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
            .then(success)
            .catch(fail);

        function success(response) {
            return response;
        }

        function fail(error) {
            $log.error('sendFeedbackRequests failed');
        }
    }

    function getFeedbackRequest(id) {
        return FeedbackRequestResource.get({id: id}).$promise
            .then(success)
            .catch(fail);

        function success(response) {
            return response;
        }

        function fail(error) {
            $log.error('getFeedbackRequest failed');
        }
    }

    function getFeedbackRequests() {
        return FeedbackRequestResource.getFeedbackRequests().$promise
            .then(success)
            .catch(fail);

        function success(response) {
            return response;
        }

        function fail(error) {
            $log.error('getFeedbackRequests failed');
        }
    }

    function getPotentialReviewers() {
        return $http.get('/api/v1/feedback/potential-reviewers/')
            .then(success)
            .catch(fail);

        function success(response) {
            return response.data;
        }

        function fail(error) {
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