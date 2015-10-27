angular
    .module('feedback')
    .controller('FeedbackController', FeedbackController);

function FeedbackController(FeedbackRequestService, FeedbackDigestService, $modal, $location) {
    var vm = this;
    vm.feedbackRequests = [];
    vm.myRecentlySentRequests = [];
    vm.myDigests = [];
    vm.requestFeedback = requestFeedback;
    vm.giveUnsolicitedFeedback = giveUnsolicitedFeedback;
    activate();

    function activate() {
        getMyRecentlySentRequests();
        getFeedbackRequests();
        getMyDigests();
    }

    function getFeedbackRequests() {
        FeedbackRequestService.getFeedbackRequests()
            .then(function (data) {
                vm.feedbackRequests = data;
                return vm.feedbackRequests;
            });
    }

    function getMyRecentlySentRequests() {
        FeedbackRequestService.getMyRecentlySentRequests()
            .then(function (data) {
                vm.myRecentlySentRequests = data;
                return vm.myRecentlySentRequests;
            });
    }

    function getMyDigests() {
        FeedbackDigestService.getMyDigests()
            .then(function (data) {
                vm.myDigests = data;
                return vm.myDigests;
            });
    }

    function requestFeedback() {
        var modalInstance = $modal.open({
            animation: true,
            windowClass: 'xx-dialog',
            backdrop: 'static',
            templateUrl: '/static/angular/partials/feedback/_modals/request-feedback.html',
            controller: 'RequestFeedbackController as request',
            resolve: {

            }
        });
        modalInstance.result.then(
            function (sentFeedbackRequests) {
                getMyRecentlySentRequests();
            }
        );
    }

    function giveUnsolicitedFeedback() {
        $location.path('/feedback/submit');
    }
}
