(function() {
    angular
        .module('feedback')
        .controller('RequestFeedbackController', RequestFeedbackController);

    RequestFeedbackController.$inject = ['ReviewersService', 'FeedbackRequestService'];

    function RequestFeedbackController(ReviewersService, FeedbackRequestService) {
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
            return FeedbackRequestService.sendFeedbackRequests(vm.selectedReviewers, vm.message)
                .then(function(result) {
                    return result;
                });
        }
    }
})();