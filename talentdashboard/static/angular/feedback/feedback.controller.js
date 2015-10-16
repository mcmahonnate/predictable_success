(function() {
    angular
        .module('feedback')
        .controller('FeedbackController', FeedbackController);

    FeedbackController.$inject = ['FeedbackRequestService', '$modal', '$location', '$filter', '$interval', '$scope'];

    function FeedbackController(FeedbackRequestService, $modal, $location, $filter, $interval, $scope) {
        var vm = this;
        var promise = null;

        // Properties
        vm.feedbackRequests = [];
        vm.myRecentlySentRequests = [];
        vm.requestFeedback = requestFeedback;
        vm.giveUnsolicitedFeedback = giveUnsolicitedFeedback;
        activate();

        function activate() {
            getMyRecentlySentRequests();
            promise = $interval(getFeedbackRequests, 1000);
        }

        function getFeedbackRequests() {
            FeedbackRequestService.getFeedbackRequests()
                .then(function (data) {
                    var feedbackRequests = data;
                    angular.forEach(feedbackRequests, function(request) {
                        var results = $filter('filter')(vm.feedbackRequests, {id: request.id});
                        if (results.length==0) { vm.feedbackRequests.push(request)}
                    });
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

        function giveUnsolicitedFeedback() {
            $location.path('/feedback/submit');
        }

        // Cancel interval on page changes
        $scope.$on('$destroy', function(){
            if (angular.isDefined(promise)) {
                $interval.cancel(promise);
                promise = undefined;
            }
        });

    }
})();