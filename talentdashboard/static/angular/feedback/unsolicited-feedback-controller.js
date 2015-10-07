(function() {
    angular
        .module('feedback')
        .controller('UnsolicitedFeedbackController', UnsolicitedFeedbackController);

    UnsolicitedFeedbackController.$inject = ['$location', 'Notification', 'FeedbackAPI'];

    function UnsolicitedFeedbackController($location, Notification, FeedbackAPI) {
        var vm = this;
        vm.employees = [];
        vm.subject = null;
        vm.excels_at = null;
        vm.could_improve_on = null;
        vm.anonymous = false;
        vm.submitFeedback = submitFeedback;
        vm.cancel = cancel;

        activate();

        function activate() {
            getEmployees();
        }

        function getEmployees() {
            return FeedbackAPI.getEmployees()
                .then(function (employees) {
                    vm.employees = employees;
                    return vm.employees;
                });
        }

        function submitFeedback(form) {
            if(form.$invalid) return;
            var p = FeedbackAPI.giveUnsolicitedFeedback(vm.subject, vm.excels_at, vm.could_improve_on, vm.anonymous)
                .then(function(response) {
                    Notification.success('Your feedback was saved.');
                    returnToDashboard();
                })
                .catch(function(response) {
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