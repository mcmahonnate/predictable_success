(function() {
    angular
        .module('feedback')
        .controller('FeedbackController', FeedbackController);

    FeedbackController.$inject = ['FeedbackRequestService'];

    function FeedbackController(FeedbackRequestService) {
        var vm = this;
        // Properties
        vm.feedbackRequests = [];

        activate();

        function activate() {
            getFeedbackRequests();
        }

        function getFeedbackRequests() {
            return FeedbackRequestService.getFeedbackRequests()
                .then(function (data) {
                    vm.feedbackRequests = data;
                    return vm.feedbackRequests;
                });
        }
    }
})();