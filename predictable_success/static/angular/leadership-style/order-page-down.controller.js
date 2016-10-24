    angular
        .module('leadership-style')
        .controller('OrderPageDownController', OrderPageDownController);

    function OrderPageDownController(LeadershipStyleTeamService, $modalInstance) {
        var vm = this;
        vm.cancel = cancel;
        activate();

        function activate(){
            LeadershipStyleTeamService.followup()
        }

        function cancel() {
            $modalInstance.dismiss();
        }
    }