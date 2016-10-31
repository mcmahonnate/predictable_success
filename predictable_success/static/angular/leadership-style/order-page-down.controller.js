    angular
        .module('leadership-style')
        .controller('OrderPageDownController', OrderPageDownController);

    function OrderPageDownController(analytics, LeadershipStyleTeamService, $modalInstance) {
        analytics.setPage('/order-page/down');
        analytics.trackPage();
        var vm = this;
        vm.cancel = cancel;
        activate();

        function activate(){
            LeadershipStyleTeamService.followup()
        }

        function cancel() {
            analytics.trackEvent('cancel button', 'click', null);
            $modalInstance.close();
        }
    }