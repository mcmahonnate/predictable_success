(function() {
    angular
        .module('feedback')
        .controller('RespondToFeedbackRequestController', RespondToFeedbackRequestController);

    RespondToFeedbackRequestController.$inject = ['$routeParams', '$location', 'Notification', 'FeedbackAPI'];

    function RespondToFeedbackRequestController($routeParams, $location, Notification, FeedbackAPI) {
        var vm = this;
        vm.feedbackRequest = null;
        vm.subject = null;
        vm.excels_at = null;
        vm.could_improve_on = null;
        vm.anonymous = false;
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
                    Notification.success('Your feedback was saved.');
                    returnToDashboard();
                })
                .catch(function() {
                    Notification.error('An error occurred when saving your feedback. Please try again.');
                });
        }

        function cancel() {
            returnToDashboard();
        }

        function returnToDashboard() {
            $location.path('/feedback');
        }
    }
})();