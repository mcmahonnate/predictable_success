(function() {
angular
    .module('feedback')
    .factory('FeedbackAPI', FeedbackAPI);

FeedbackAPI.$inject = ['$http', '$log', 'FeedbackRequestResource', 'FeedbackSubmissionResource', 'Employee'];

function FeedbackAPI($http, $log, FeedbackRequestResource, FeedbackSubmissionResource, Employee) {
    return {
        getFeedbackRequest: getFeedbackRequest,
        sendFeedbackRequests: sendFeedbackRequests,
        getFeedbackRequests: getFeedbackRequests,
        getPotentialReviewers: getPotentialReviewers,
        getEmployees: getEmployees,
        respondToFeedbackRequest: respondToFeedbackRequest,
        giveUnsolicitedFeedback: giveUnsolicitedFeedback
    };

    function sendFeedbackRequests(reviewers, message) {
        var requests = [];

        for(var i=0; i < reviewers.length; i++) {
            requests.push({reviewer: reviewers[i].id, message: message});
        }

        return FeedbackRequestResource.sendFeedbackRequests(requests, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('sendFeedbackRequests failed');
        }
    }

    function getFeedbackRequest(id) {
        return FeedbackRequestResource.get({id: id}, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getFeedbackRequest failed');
        }
    }

    function getFeedbackRequests() {
        return FeedbackRequestResource.getFeedbackRequests(null, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getFeedbackRequests failed');
        }
    }

    function getEmployees() {
        return Employee.query(null, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getEmployees failed');
        }
    }

    function getPotentialReviewers() {
        return $http.get('/api/v1/feedback/potential-reviewers/')
            .then(success)
            .catch(fail);

        function success(response) {
            return response.data;
        }

        function fail(response) {
            $log.error('getPotentialReviewers failed');
        }
    }

    function getFeedbackProgressReportForEmployee(employee_id) {
        var url = '/api/v1/feedback/progress-reports/' + employee_id + '/';
        return $http.get(url)
            .then(success)
            .catch(fail);

        function success(response) {
            return response.data;
        }

        function fail(response) {
            $log.error('getFeedbackProgressReportForEmployee failed');
        }
    }

    function respondToFeedbackRequest(feedbackRequest, feedback)
    {
        var submission = _map_feedback_to_submission(feedback);
        submission.feedback_request = feedbackRequest.id;
        submission.subject = feedbackRequest.requester.id;
        return _sendFeedback(submission);
    }

    function giveUnsolicitedFeedback(subject, feedback)
    {
        var submission = _map_feedback_to_submission(feedback);
        submission.subject = subject.id;
        return _sendFeedback(submission);
    }

    function _map_feedback_to_submission(feedback) {
        return {
            excels_at: feedback.excelsAt,
            could_improve_on: feedback.couldImproveOn,
            anonymous: feedback.anonymous
        };
    }

    function _sendFeedback(submission) {
        return FeedbackSubmissionResource.save(submission, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('respondToFeedbackRequest failed');
        }
    }
}
})();