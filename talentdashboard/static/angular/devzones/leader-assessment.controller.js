angular
    .module('devzones')
    .controller('LeaderAssessmentController', LeaderAssessmentController);

function LeaderAssessmentController(DevZoneService, Notification, $modalInstance) {
    var vm = this;
    vm.busy = false;
    vm.selectedAnswer = null;
    vm.zones = [];
    vm.cancel = cancel;
    vm.isCollapsed = isCollapsed;
    activate();

    function activate() {
        getZones();
    }

    function isCollapsed(zone) {
        if (vm.selectedAnswer==zone) {
            return false
        }
        return true
    }

    function getZones(){
        vm.busy = true;
        DevZoneService.getZones()
            .then(function(zones){
                vm.zones = zones;
                vm.busy = false;
            }, function(){
                vm.busy = false;
            }
        )
    }

    function cancel() {
        $modalInstance.dismiss();
    }

}