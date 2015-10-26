angular
    .module('feedback')
    .controller('FeedbackController', FeedbackController);

function FeedbackController(FeedbackRequestService, $modal, $location) {
    var vm = this;
    vm.feedbackRequests = [];
    vm.myRecentlySentRequests = [];
    vm.requestFeedback = requestFeedback;
    vm.giveUnsolicitedFeedback = giveUnsolicitedFeedback;
    activate();

    function activate() {
        getMyRecentlySentRequests();
        getFeedbackRequests();
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
