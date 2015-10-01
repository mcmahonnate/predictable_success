(function() {
angular
    .module('feedback')
    .factory('ReviewersService', ReviewersService);

ReviewersService.$inject = ['$http', '$log'];

function ReviewersService($http, $log) {
    return {
        getPotentialReviewers: getPotentialReviewers
    };

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
}
})();