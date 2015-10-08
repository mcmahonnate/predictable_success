(function() {
    angular
        .module('feedback')
        .controller('FeedbackController', FeedbackController);

    FeedbackController.$inject = ['FeedbackAPI', '$modal'];

    function FeedbackController(FeedbackAPI, $modal) {
        var vm = this;
        // Properties
        vm.feedbackRequests = [];
        vm.requestFeedback = requestFeedback;
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

        function requestFeedback() {
            var modalInstance = $modal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: '/static/angular/partials/feedback/_modals/request-feedback.html',
                controller: 'RequestFeedbackController as request',
                resolve: {

                }
            });
            modalInstance.result.then(
                function (e, l) {

                }
            );
        };

    }
})();