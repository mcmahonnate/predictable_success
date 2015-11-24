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
    vm.requestFeedback = requestFeedback;
    vm.giveUnsolicitedFeedback = giveUnsolicitedFeedback;
    vm.welcome = $sce.trustAsHtml($rootScope.customer.feedback_welcome);
    vm.questions = {
        excelsAtQuestion: $rootScope.customer.feedback_excels_at_question,
        couldImproveOnQuestion: $rootScope.customer.feedback_could_improve_on_question
    };
    activate();

    function activate() {
        getMyRecentlySentRequests()
        getFeedbackRequests();
        getMySubmissions();
        getMyDigests();
        toggleEmptyScreenMode();
    };

    function toggleEmptyScreenMode() {
        setTimeout(function () {
            if(!vm.myRecentlySentRequests.length && !vm.feedbackRequests.length && !vm.mySubmissions.length && !vm.myDigests) {
                $scope.$apply(function() {
                   vm.showEmptyScreen = true; 
                });
                console.log('Welcome to Scoutmap! "There is always space for improvement, no matter how long you’ve been in the business." -Oscar De La Hoya');
            }
        }, 500);
    }
    
    function getMySubmissions() {
        FeedbackSubmissionService.getFeedbackIveSubmitted()
            .then(function (data) {
                vm.mySubmissions = data;
                return vm.mySubmissions;
            });
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
