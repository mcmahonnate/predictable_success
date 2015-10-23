angular
    .module('feedback')
    .factory('FeedbackDigestService', FeedbackDigestService);

function FeedbackDigestService($log, $http) {
    return {
        getCurrentDigestForEmployee: getCurrentDigestForEmployee,
        addSubmissionToCurrentDigest: addSubmissionToCurrentDigest,
        updateSummaryOfCurrentDigest: updateSummaryOfCurrentDigest
    };

    function getCurrentDigestForEmployee(employeeId) {
        var url = '/api/v1/feedback/coachees/' + employeeId + '/digests/current/';
        return $http.get(url)
            .then(success)
            .catch(fail);

        function success(response) {
            return response.data;
        }

        function fail(response) {
            $log.error('getCurrentDigestForEmployee failed');
        }
    }

    function addSubmissionToCurrentDigest(submission) {
        var url = '/api/v1/feedback/coachees/' + submission.subject.id + '/digests/current/submissions/';
        return $http.post(url, {'submission': submission.id})
            .then(success)
            .catch(fail);

        function success(response) {
            return response.data;
        }

        function fail(response) {
            $log.error('addSubmissionToDigest failed');
        }
    }

    function updateSummaryOfCurrentDigest(submission) {
        var url = '/api/v1/feedback/coachees/' + submission.subject.id + '/digests/current/summary/';
        return $http.post(url, {'summary': submission.summary})
            .then(success)
            .catch(fail);

        function success(response) {
            return response.data;
        }

        function fail(response) {
            $log.error('updateSummaryOfCurrentDigest failed');
        }
    }
}