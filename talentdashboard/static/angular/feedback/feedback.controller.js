(function() {
    angular
        .module('feedback')
        .controller('FeedbackController', FeedbackController);

    FeedbackController.$inject = ['FeedbackAPI', '$modal', '$location', '$filter', '$interval', '$scope'];

    function FeedbackController(FeedbackAPI, $modal, $location, $filter, $interval, $scope) {
        var vm = this;
        var promise = null;

        // Properties
        vm.feedbackRequests = [];
        vm.requestFeedback = requestFeedback;
        vm.giveUnsolicitedFeedback = giveUnsolicitedFeedback;
        activate();

        function activate() {
            promise = $interval(getFeedbackRequests, 1000);
        }

        function getFeedbackRequests() {
            FeedbackAPI.getFeedbackRequests()
                .then(function (data) {
                    console.log('polling');
                    var feedbackRequests = data;
                    angular.forEach(feedbackRequests, function(request) {
                        var results = $filter('filter')(vm.feedbackRequests, {id: request.id});
                        if (results.length==0) { vm.feedbackRequests.push(request)}
                    });
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