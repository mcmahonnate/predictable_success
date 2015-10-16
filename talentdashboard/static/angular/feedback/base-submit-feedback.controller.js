    angular
        .module('feedback')
        .controller('BaseSubmitFeedbackController', BaseSubmitFeedbackController);

    function BaseSubmitFeedbackController($location) {
        var vm = this;
        vm.feedback = {
            excelsAt: null,
            couldImproveOn: null,
            anonymous: false
        };
        vm.cancel = cancel;
        vm.submitFeedback = submitFeedback;

        function cancel() {
            returnToDashboard();
        }

        function submitFeedback(form) {
            if(form.$invalid) return;
            return this._submitFeedback()
                .then(returnToDashboard);
        }

        function returnToDashboard() {
            $location.path('/feedback');
        }
    }
