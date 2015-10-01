(function() {
angular
    .module('feedback')
    .factory('FeedbackRequestService', FeedbackRequestService);

FeedbackRequestService.$inject = ['$http'];

function FeedbackRequestService($http) {
    return {
        sendFeedbackRequests: sendFeedbackRequests
    };

    function sendFeedbackRequests(reviewers, message) {
        var requests = [];

        for(var i=0; i < reviewers.length; i++) {
            requests.push({reviewer: reviewers[i].id, message: message});
        }

        return $http.post('/api/v1/feedback/requests/', requests)
            .then(complete)
            .catch(failed);

        function complete(response) {
            return response.data;
        }

        function failed(error) {
            console.log.error('sendFeedbackRequests failed.' + error.data);
        }
    }
}
})();