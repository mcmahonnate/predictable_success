(function() {
    angular
        .module('feedback')
        .controller('UnsolicitedFeedbackController', UnsolicitedFeedbackController);

    UnsolicitedFeedbackController.$inject = ['$location', 'Notification', 'FeedbackSubmissionService'];

    function UnsolicitedFeedbackController($location, Notification, FeedbackSubmissionService) {
        BaseSubmitFeedbackController.call(this, $location);
        var vm = this;
        vm.employees = [];
        vm.subject = null;

        activate();

        function activate() {
            getEmployees();
        }

        function getEmployees() {
            return FeedbackSubmissionService.getEmployees()
                .then(function (employees) {
                    vm.employees = employees;
                    return vm.employees;
                });
        }

        this._submitFeedback = function() {
            return FeedbackSubmissionService.giveUnsolicitedFeedback(vm.subject, vm.feedback)
                .then(function(response) {
                    Notification.success('Your feedback was saved.');
                })
                .catch(function(response) {
                    Notification.error('An error occurred when saving your feedback. Please try again.');
                });
        }
    }
    UnsolicitedFeedbackController.prototype = Object.create(BaseSubmitFeedbackController.prototype);
})();