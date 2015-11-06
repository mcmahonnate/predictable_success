angular
    .module('feedback')
    .controller('FeedbackController', FeedbackController);

function FeedbackController(FeedbackRequestService, FeedbackDigestService, analytics, $modal, $location, $scope) {
    /* Since this page can be the root for some users let's make sure we capture the correct page */
    var location_url = $location.url().indexOf('/feedback') < 0 ? '/feedback' : $location.url();
    analytics.trackPage($scope, $location.absUrl(), location_url);

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
