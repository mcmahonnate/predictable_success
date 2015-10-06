(function() {
    angular
        .module('feedback')
        .controller('FeedbackController', FeedbackController);

    FeedbackController.$inject = ['FeedbackAPI'];

    function FeedbackController(FeedbackAPI) {
        var vm = this;
        // Properties
        vm.feedbackRequests = [];

        activate();

        function activate() {
            getFeedbackRequests();
        }

        function getFeedbackRequests() {
            return FeedbackAPI.getFeedbackRequests()
                .then(function (data) {
                    vm.feedbackRequests = data;
                    return vm.feedbackRequests;
                });
        }
    }
})();