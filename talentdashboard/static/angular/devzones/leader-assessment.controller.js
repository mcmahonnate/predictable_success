angular
    .module('devzones')
    .controller('LeaderAssessmentController', LeaderAssessmentController);

function LeaderAssessmentController(conversation, DevZoneService, Notification, $modalInstance, $rootScope) {
    var vm = this;
    vm.conversation = conversation;
    vm.busy = false;
    vm.assessment = null;
    vm.employeeZone = null;
    vm.selectedAnswer = null;
    vm.saveAssessment = saveAssessment;
    vm.zones = [];
    vm.cancel = cancel;
    vm.isCollapsed = isCollapsed;
    activate();

    function activate() {
        if (vm.conversation.development_lead_assessment) {
            vm.selectedAnswer = vm.conversation.development_lead_assessment.zone.id;
            vm.assessment = vm.conversation.development_lead_assessment;
        }
        getZones();
    }

    function isCollapsed(zone) {
        if (vm.selectedAnswer==zone.id) {
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

    function saveAssessment() {
        vm.busy = true;
        if (!vm.assessment) {
            DevZoneService.createEmployeeZone({employee: vm.conversation.employee.id, assessor: $rootScope.currentUser.employee.id, zone: vm.selectedAnswer})
                .then(function (employeeZone) {
                    vm.employeeZone = employeeZone;
                    DevZoneService.updateConversation({id: vm.conversation.id, development_lead_assessment: vm.employeeZone.id})
                        .then(function (conversation) {
                            vm.busy = false;
                            $modalInstance.close(vm.employeeZone);
                            Notification.success('Your assessment has been saved.')
                        })
                })
        } else {
            DevZoneService.updateEmployeeZone({id: vm.conversation.development_lead_assessment.id, zone: vm.selectedAnswer})
                .then(function (employeeZone) {
                    vm.busy = false;
                    $modalInstance.close(employeeZone);
                    Notification.success('Your assessment has been saved.')
                })
        }
    }
}