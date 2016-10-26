    angular
        .module('leadership-style')
        .controller('TeaseController', TeaseController);

    function TeaseController(tease, $modalInstance) {
        console.log('test');
        var vm = this;
        vm.tease = tease;
        console.log(tease);
        vm.cancel = cancel;

        function cancel() {
            $modalInstance.dismiss();
        }
    }