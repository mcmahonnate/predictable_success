angular
    .module('feedback')
    .factory('FeedbackSubmissionService', FeedbackSubmissionService);

function FeedbackSubmissionService($http, $log, FeedbackSubmissionResource, Employee) {
    return {
        getFeedbackSubmission: getFeedbackSubmission,
        updateCoachSummary: updateCoachSummary,
        getEmployees: getEmployees,
        respondToFeedbackRequest: respondToFeedbackRequest,
        giveUnsolicitedFeedback: giveUnsolicitedFeedback,
        getFeedbackIveSubmitted: getFeedbackIveSubmitted,
        updateExcelsWasHelpful: updateExcelsWasHelpful,
        updateCouldImproveOnWasHelpful: updateCouldImproveOnWasHelpful
    };

    function getFeedbackIveSubmitted() {
        var url = '/api/v1/feedback/submissions/my/';
        return $http.get(url)
            .then(success)
            .catch(fail);

        function success(response) {
            return response.data;
        }

        function fail(response) {
            $log.error('getFeedbackIveSubmitted failed');
        }
    }

    function getFeedbackSubmission(id) {
        return FeedbackSubmissionResource.get({id: id}, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getFeedbackSubmission failed');
        }
    }

    function updateCoachSummary(submission) {
        return FeedbackSubmissionResource.updateCoachSummary({id: submission.id}, submission, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('updateCoachSummary');
        }
    }

    function updateExcelsWasHelpful(submission) {
        submission.excels_at_was_helpful = !submission.excels_at_was_helpful;
        return FeedbackSubmissionResource.updateWasHelpful({id: submission.id}, submission, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('updateWasHelpful');
        }
    }

    function updateCouldImproveOnWasHelpful(submission) {
        submission.could_improve_on_was_helpful = !submission.could_improve_on_was_helpful;
        return FeedbackSubmissionResource.updateWasHelpful({id: submission.id}, submission, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('updateWasHelpful');
        }
    }    

    function getEmployees() {
        return Employee.query({show_hidden: true, view_all: true}, success, fail).$promise;

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
