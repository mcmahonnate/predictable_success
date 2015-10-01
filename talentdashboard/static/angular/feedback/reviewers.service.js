(function() {
angular
    .module('feedback')
    .factory('ReviewersService', ReviewersService);

ReviewersService.$inject = ['$resource'];

function ReviewersService($http) {
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
            console.log.error('getPotentialReviewers failed.' + error.data);
        }
    }
}
})();