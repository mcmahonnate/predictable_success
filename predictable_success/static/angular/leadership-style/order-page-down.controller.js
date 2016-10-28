    angular
        .module('leadership-style')
        .controller('OrderPageDownController', OrderPageDownController);

    function OrderPageDownController(analytics, LeadershipStyleTeamService, $modalInstance) {
        var vm = this;
        vm.cancel = cancel;
        activate();

        function activate(){
            analytics.setPage('/order-page/down/');
            analytics.trackPage();
            LeadershipStyleTeamService.followup()
        }

        function cancel() {
            analytics.trackEvent('cancel button', 'click', null);
            $modalInstance.dismiss();
        }
    }