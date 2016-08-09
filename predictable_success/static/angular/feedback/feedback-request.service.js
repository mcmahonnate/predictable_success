angular
    .module('feedback')
    .factory('FeedbackRequestService', FeedbackRequestService);

function FeedbackRequestService($http, $log, FeedbackRequestResource) {
    return {
        getFeedbackRequest: getFeedbackRequest,
        sendFeedbackRequests: sendFeedbackRequests,
        getFeedbackRequests: getFeedbackRequests,
        getPotentialReviewers: getPotentialReviewers,
        getFeedbackProgressReportForEmployee: getFeedbackProgressReportForEmployee,
        getFeedbackProgressReportForEmployees: getFeedbackProgressReportForEmployees,
        getMyRecentlySentRequests: getMyRecentlySentRequests,
        poke: poke
    };

    function poke(requests, message, employee_id, coach_id) {
        return FeedbackRequestResource.poke({id: 'poke'}, {message: message, requests: requests, employee_id: employee_id, coach_id: coach_id}, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('poke failed');
        }
    }

    function sendFeedbackRequests(reviewers, message) {
        var requests = [];

        for(var i=0; i < reviewers.length; i++) {
            requests.push({reviewer: reviewers[i].id, message: message});
        }

        return FeedbackRequestResource.sendFeedbackRequests(requests, success, fail).$promise;

        function success(sentFeedbackRequests) {
            return sentFeedbackRequests;
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

    function getMyRecentlySentRequests() {
        return FeedbackRequestResource.getMyRecentlySentRequests(null, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getMyRecentlySentRequests failed');
        }
    }

    function getFeedbackProgressReportForEmployee(employee_id) {
        var url = '/api/v1/feedback/reports/coachees/' + employee_id + '/';
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

    function getFeedbackProgressReportForEmployees() {
        var url = '/api/v1/feedback/reports/coachees/';
        return $http.get(url)
            .then(success)
            .catch(fail);

        function success(response) {
            return response.data;
        }

        function fail(response) {
            $log.error('getFeedbackProgressReportForEmployees failed');
        }
    }
}
