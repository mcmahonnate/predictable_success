(function() {
    angular
        .module('feedback')
        .controller('RespondToFeedbackRequestController', RespondToFeedbackRequestController);

    RespondToFeedbackRequestController.$inject = ['$routeParams', '$location', 'Notification', 'FeedbackRequestService', 'FeedbackSubmissionService'];

    function RespondToFeedbackRequestController($routeParams, $location, Notification, FeedbackRequestService, FeedbackSubmissionService) {
        BaseSubmitFeedbackController.call(this, $location);
        var vm = this;
        vm.feedbackRequest = null;

        activate();

        function activate() {
            getFeedbackRequest();
        }

        function getFeedbackRequest() {
            return FeedbackRequestService.getFeedbackRequest($routeParams.id)
                .then(function (feedbackRequest) {
                    vm.feedbackRequest = feedbackRequest;
                    vm.subject = feedbackRequest.requester;
                    return vm.feedbackRequest;
                });
        }

        this._submitFeedback = function() {
            return FeedbackSubmissionService.respondToFeedbackRequest(vm.feedbackRequest, vm.feedback)
                .then(function() {
                    Notification.success('Your feedback was saved.');
                })
                .catch(function() {
                    Notification.error('An error occurred when saving your feedback. Please try again.');
                });
        };
    }
    RespondToFeedbackRequestController.prototype = Object.create(BaseSubmitFeedbackController.prototype);
})();