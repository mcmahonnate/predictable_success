angular
    .module('feedback')
    .factory('FeedbackDigestService', FeedbackDigestService);

function FeedbackDigestService($log, $http) {
    return {
        getCurrentDigestForEmployee: getCurrentDigestForEmployee,
        getMyDigests: getMyDigests,
        addSubmissionToCurrentDigest: addSubmissionToCurrentDigest,
        deliverDigest: deliverDigest,
        save: save
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

    function getMyDigests() {
        var url = '/api/v1/feedback/my/digests/';
        return $http.get(url)
            .then(success)
            .catch(fail);

        function success(response) {
            return response.data;
        }

        function fail(response) {
            $log.error('getMyDigests failed');
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

    function deliverDigest(digest) {
        digest.has_been_delivered = true;
        return save(digest);
    }

    function save(digest) {
        var url = '/api/v1/feedback/coachees/' + digest.subject.id + '/digests/current/';
        return $http.post(url, digest)
            .then(success)
            .catch(fail);

        function success(response) {
            return response.data;
        }

        function fail(response) {
            $log.error('save failed');
        }
    }
}