(function() {
    angular
        .module('feedback')
        .controller('ChangeCoachController', ChangeCoachController);

    ChangeCoachController.$inject = ['CoachService'];

    function ChangeCoachController(CoachService) {
        var vm = this;
        vm.availableCoaches = [];
        vm.selectedCoach = null;
        vm.changeCoach = changeCoach;

        activate();

        function activate() {
            return getAvailableCoaches();
        }

        function getAvailableCoaches() {
            return CoachService.getAvailableCoaches()
                .then(function (data) {
                    vm.availableCoaches = data;
                    return vm.availableCoaches;
                });
        }

        function changeCoach() {
            CoachService.changeCoach(vm.selectedCoach)
                .then(function() {
                    // success, then what?
                })
        }
    }
})();