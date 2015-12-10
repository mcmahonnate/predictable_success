angular
        .module('feedback')
        .controller('ShareFeedbackController', ShareFeedbackController);

    function ShareFeedbackController($scope, $modalInstance, $location, analytics, digest, FeedbackDigestService, FeedbackSubmissionService, Notification) {
        var vm = this;
        vm.digest = digest;
        vm.shareDigest = shareDigest;
        vm.cancel = cancel;
        vm.employees = [];
        vm.send_to = null;

        activate();

        function activate() {
            getEmployees();
        }

        function cancel() {
            $modalInstance.dismiss();
        }

        function getEmployees() {
            return FeedbackSubmissionService.getEmployees()
                .then(function (employees) {
                    vm.employees = employees;
                    return vm.employees;
                });
        }

        function shareDigest(employee) {
            analytics.trackEvent($scope, $location.absUrl(), 'Feedback Share', 'sent', vm.digest.subject.id);
            Notification.success("Your feedback has been sent to " + vm.send_to.full_name);
            $modalInstance.close();
        }
    }