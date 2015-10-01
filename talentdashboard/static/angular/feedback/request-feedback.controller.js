(function() {
    angular
        .module('feedback')
        .controller('RequestFeedbackController', RequestFeedbackController);

    RequestFeedbackController.$inject = ['ReviewersService'];

    function RequestFeedbackController(ReviewersService) {
        var vm = this;
        vm.potentialReviewers = [];
        vm.selectedReviewers = [];
        vm.message = '';
        vm.sendFeedbackRequests = sendFeedbackRequests;

        activate();

        function activate() {
            return getPotentialReviewers();
        }

        function getPotentialReviewers() {
            return ReviewersService.getPotentialReviewers()
                .then(function (data) {
                    vm.potentialReviewers = data;
                    return vm.potentialReviewers;
                });
        }

        function sendFeedbackRequests() {

        }
    }
})();