    angular
        .module('leadership-style')
        .controller('TeaseController', TeaseController);

    function TeaseController(tease, $modalInstance) {
        var vm = this;
        vm.tease = tease;
        vm.cancel = cancel;

        function cancel() {
            $modalInstance.dismiss();
        }
    }