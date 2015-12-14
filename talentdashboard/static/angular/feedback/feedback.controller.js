angular
    .module('feedback')
    .controller('FeedbackController', FeedbackController);

function FeedbackController(FeedbackRequestService, FeedbackDigestService, FeedbackSubmissionService, analytics, $modal, $location, $scope, $rootScope, $sce, $timeout) {
    /* Since this page can be the root for some users let's make sure we capture the correct page */
    var location_url = $location.url().indexOf('/feedback') < 0 ? '/feedback' : $location.url();
    analytics.trackPage($scope, $location.absUrl(), location_url);

    var vm = this;
    vm.showWelcome = false;
    vm.feedbackRequests = [];
    vm.myRecentlySentRequests = [];
    vm.myDigests = [];
    vm.showEmptyScreen = false;
    vm.mySubmissions = [];
    vm.myHelpfulness = [];
    vm.requestFeedback = requestFeedback;
    vm.giveUnsolicitedFeedback = giveUnsolicitedFeedback;
    vm.welcome = $sce.trustAsHtml($rootScope.customer.feedback_welcome);
    vm.myRecentlySentRequestsLoaded = false;
    vm.feedbackRequestsLoaded = false;
    vm.mySubmissionsLoaded = false;
    vm.myDigestsLoaded = false;
    vm.questions = {
        excelsAtQuestion: $rootScope.customer.feedback_excels_at_question,
        couldImproveOnQuestion: $rootScope.customer.feedback_could_improve_on_question
    };
    $rootScope.successRequestMessage = false;
    $rootScope.hideMessage = false;
    $rootScope.hideRequestMessage = false;

    activate();

    function activate() {
        getMyRecentlySentRequests()
        getFeedbackRequests();
        getMySubmissions();
        getMyDigests();
        getMyHelpfulnessReport();
    };


    function checkIsEmpty() {
        if (vm.mySubmissionsLoaded && vm.feedbackRequestsLoaded && vm.myRecentlySentRequestsLoaded && vm.myDigestsLoaded) {
            if (vm.myRecentlySentRequests.length == 0 && vm.feedbackRequests.length == 0 && vm.mySubmissions.length == 0 && vm.myDigests.length == 0) {
                vm.showEmptyScreen = true;
            } else {
                vm.showEmptyScreen = false;
            }
        }
    }
    
    function getMySubmissions() {
        FeedbackSubmissionService.getFeedbackIveSubmitted()
            .then(function (data) {
                vm.mySubmissions = data;
                vm.mySubmissionsLoaded = true;
                checkIsEmpty();
                return vm.mySubmissions;
            });
    }

    function getFeedbackRequests() {
        FeedbackRequestService.getFeedbackRequests()
            .then(function (data) {
                vm.feedbackRequests = data;
                vm.feedbackRequestsLoaded = true;
                checkIsEmpty();
                return vm.feedbackRequests;
            });
    }

    function getMyRecentlySentRequests() {
        FeedbackRequestService.getMyRecentlySentRequests()
            .then(function (data) {
                vm.myRecentlySentRequests = data;
                vm.myRecentlySentRequestsLoaded = true;
                checkIsEmpty();
                return vm.myRecentlySentRequests;
            });
    }

    function getMyDigests() {
        FeedbackDigestService.getMyDigests()
            .then(function (data) {
                vm.myDigests = data;
                vm.myDigestsLoaded = true;
                checkIsEmpty();
                return vm.myDigests;
            });
    }

    function getMyHelpfulnessReport() {
        FeedbackSubmissionService.getMyHelpfulnessReport()
            .then(function (data) {
                vm.myHelpfulness = data;
                return vm.myHelpfulness;
            });
    }    

    function requestFeedback() {
        var modalInstance = $modal.open({
            animation: true,
            windowClass: 'xx-dialog fade zoom',
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
