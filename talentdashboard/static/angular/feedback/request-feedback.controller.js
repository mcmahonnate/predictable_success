(function() {
    angular
        .module('feedback')
        .controller('RequestFeedbackController', RequestFeedbackController);

    RequestFeedbackController.$inject = ['ReviewersService', 'FeedbackRequestService', 'Notification'];

    function RequestFeedbackController(ReviewersService, FeedbackRequestService, Notification) {
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
            FeedbackRequestService.sendFeedbackRequests(vm.selectedReviewers, vm.message)
                .then(function() {
                    Notification.success("Success!");
                    // Show success/navigate to dashboard?
                });
        }
    }
})();