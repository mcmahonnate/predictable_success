(function() {
    angular
        .module('feedback')
        .controller('RespondToFeedbackRequestController', RespondToFeedbackRequestController);

    RespondToFeedbackRequestController.$inject = ['$routeParams', '$location', 'FeedbackAPI'];

    function RespondToFeedbackRequestController($routeParams, $location, FeedbackAPI) {
        var vm = this;
        // Properties
        vm.feedbackRequest = null;
        vm.subject = null;
        vm.excels_at = null;
        vm.could_improve_on = null;
        vm.anonymous = false;
        // Methods
        vm.submitFeedback = submitFeedback;
        vm.cancel = cancel;

        activate();

        function activate() {
            getFeedbackRequest();
        }

        function getFeedbackRequest() {
            return FeedbackAPI.getFeedbackRequest($routeParams.id)
                .then(function (feedbackRequest) {
                    vm.feedbackRequest = feedbackRequest;
                    vm.subject = feedbackRequest.requester;
                    return vm.feedbackRequest;
                });
        }

        function submitFeedback(form) {
            if(form.$invalid) return;
            FeedbackAPI.respondToFeedbackRequest(vm.feedbackRequest, vm.excels_at, vm.could_improve_on, vm.anonymous)
                .then(function() {
                    returnToDashboard();
                })
        }

        function cancel() {
            returnToDashboard();
        }

        function returnToDashboard() {
            $location.path('/feedback');
        }
    }
})();