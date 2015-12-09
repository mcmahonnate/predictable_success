    angular
        .module('feedback')
        .controller('FeedbackDigestController', FeedbackDigestController);

    function FeedbackDigestController($routeParams, $window, $location, $scope, $rootScope, analytics, FeedbackDigestService, Notification) {
        analytics.trackPage($scope, $location.absUrl(), $location.url());
        var vm = this;
        vm.digestId = $routeParams.id;
        vm.digest = null;
        vm.getDigest = getDigest;
        vm.printDigest = printDigest;
        vm.goTo = goTo;
        vm.coach = null;
        vm.employee = null;
        vm.questions = {
            excelsAtQuestion: $rootScope.customer.feedback_excels_at_question,
            couldImproveOnQuestion: $rootScope.customer.feedback_could_improve_on_question
        };
        activate();

        function activate() {
            getDigest();
        }

        function getDigest() {
            return FeedbackDigestService.getDigest(vm.digestId)
                .then(function (data) {
                    vm.digest = data;
                    vm.coach = vm.digest.delivered_by;
                    vm.employee = vm.digest.subject;
                    return vm.digest;
                })
                .catch(function() {
                    Notification.error("You don't have access to this feedback digest.");
                    $location.path('/feedback/');
                });
        }

        function printDigest() {
            $window.print();
        }

        function goTo(path) {
            $location.path(path);
        };
    }
