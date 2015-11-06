    angular
        .module('feedback')
        .controller('FeedbackDigestController', FeedbackDigestController);

    function FeedbackDigestController($routeParams, $window, $location, $scope, analytics, FeedbackDigestService, Notification) {
        analytics.trackPage($scope, $location.absUrl(), $location.url());
        var vm = this;
        vm.digestId = $routeParams.id;
        vm.digest = null;
        vm.getDigest = getDigest;
        vm.printDigest = printDigest;
        activate();

        function activate() {
            getDigest();
        }

        function getDigest() {
            return FeedbackDigestService.getDigest(vm.digestId)
                .then(function (data) {
                    vm.digest = data;
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
    }
