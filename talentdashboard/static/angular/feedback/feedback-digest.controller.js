    angular
        .module('feedback')
        .controller('FeedbackDigestController', FeedbackDigestController);

    function FeedbackDigestController($routeParams, $window, FeedbackDigestService) {
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
                });
        }

        function printDigest() {
            $window.print();
        }
    }
