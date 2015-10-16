angular
    .module('feedback')
    .factory('FeedbackSubmissionService', FeedbackSubmissionService);

function FeedbackSubmissionService($log, FeedbackSubmissionResource, Employee) {
    return {
        getFeedbackSubmission: getFeedbackSubmission,
        getEmployees: getEmployees,
        respondToFeedbackRequest: respondToFeedbackRequest,
        giveUnsolicitedFeedback: giveUnsolicitedFeedback
    };

    function getFeedbackSubmission(id) {
        return FeedbackSubmissionResource.get({id: id}, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getFeedbackSubmission failed');
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
            $log.error('_sendFeedback failed');
        }
    }
}
