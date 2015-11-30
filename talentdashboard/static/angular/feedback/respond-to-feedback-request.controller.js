    angular
        .module('feedback')
        .controller('RespondToFeedbackRequestController', RespondToFeedbackRequestController);

    function RespondToFeedbackRequestController($routeParams, $location, $scope, $modal, $rootScope, $timeout, analytics, Notification, FeedbackRequestService, FeedbackSubmissionService) {
        analytics.trackPage($scope, $location.absUrl(), $location.url());
        BaseSubmitFeedbackController.call(this, $location, $modal, $rootScope);
        var vm = this;
        vm.feedbackRequest = null;
        vm.goTo = goTo;

        activate();

        function activate() {
            getFeedbackRequest();
        }

        function goTo(path) {
            var cancel = confirm("Are you sure you want to lose all the great feedback you've already written?");
            if (cancel == true) {
                $location.path(path);
                $('.modal').modal('hide');
                $('.modal-backdrop').remove();
                $('body').removeClass('modal-open');
            }
        };

        function getFeedbackRequest() {
            return FeedbackRequestService.getFeedbackRequest($routeParams.id)
                .then(function (feedbackRequest) {
                    vm.feedbackRequest = feedbackRequest;
                    vm.subject = feedbackRequest.requester;
                    return vm.feedbackRequest;
                })
                .catch(function() {
                    Notification.error("You don't have access to this feedback request.");
                    $location.path('/feedback/');
                });
        }

        this._submitFeedback = function() {
            return FeedbackSubmissionService.respondToFeedbackRequest(vm.feedbackRequest, vm.feedback)
                .then(function() {

                    /* Big succes message */
                    $rootScope.successMessage = true;
                    $rootScope.successMessageRecipient = vm.feedbackRequest.requester;
                    
                    /* Hide success message after 10 seconds */
                    $timeout(function() {
                        $rootScope.hideMessage = true;
                    }, 15000); 
                })
                .catch(function() {
                    Notification.error('An error occurred when saving your feedback. Please try again.');
                });
        };
    }
    RespondToFeedbackRequestController.prototype = Object.create(BaseSubmitFeedbackController.prototype);
