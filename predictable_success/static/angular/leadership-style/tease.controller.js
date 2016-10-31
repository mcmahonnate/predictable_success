    angular
        .module('leadership-style')
        .controller('TeaseController', TeaseController);

    function TeaseController(analytics, tease, $modalInstance) {
        analytics.setPage('/style-description');
        analytics.trackPage();
        var vm = this;
        vm.tease = tease;
        vm.cancel = cancel;

        function cancel() {
            analytics.trackEvent("close button", "click", null);
            $modalInstance.close();
        }
    }