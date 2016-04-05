angular
    .module('devzones')
    .controller('LeaderAssessmentController', LeaderAssessmentController);

function LeaderAssessmentController(compactView, conversation, ConversationService, DevZoneService, Notification, $modalInstance, $rootScope) {
    var vm = this;
    vm.compactView = compactView;
    vm.conversation = conversation;
    vm.panel_index = 0;
    vm.busy = false;
    vm.employeeZone = null;
    vm.selectedAnswer = null;
    vm.notes = '';
    vm.is_draft = false;
    vm.saveAssessment = saveAssessment;
    vm.sendDraft = sendDraft;
    vm.zones = [];
    vm.cancel = cancel;
    vm.close = close;
    vm.isCollapsed = isCollapsed;
    activate();

    function activate() {
        if (vm.conversation.development_lead_assessment) {
            vm.selectedAnswer = vm.conversation.development_lead_assessment.zone.id;
            vm.notes = vm.conversation.development_lead_assessment.notes;
            vm.is_draft = vm.conversation.development_lead_assessment.is_draft;
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

    function saveAssessment(close, send) {
        vm.busy = true;
        var assessor_id = send ? vm.conversation.development_lead.id : $rootScope.currentUser.employee.id
        if (!vm.conversation.development_lead_assessment) {
            DevZoneService.createEmployeeZone({employee: vm.conversation.employee.id, assessor: assessor_id, zone: vm.selectedAnswer, notes: vm.notes, is_draft: vm.is_draft})
                .then(function (employeeZone) {
                    vm.employeeZone = employeeZone;
                    vm.conversation.development_lead_assessment = employeeZone;
                    vm.conversation.development_lead_assessment.notes = vm.notes;
                    updateConversation(close, send);
                })
        } else {
            DevZoneService.updateEmployeeZone({id: vm.conversation.development_lead_assessment.id, assessor: assessor_id, zone: vm.selectedAnswer, notes: vm.notes, is_draft: vm.is_draft})
                .then(function (employeeZone) {
                    vm.employeeZone = employeeZone;
                    updateConversation(close, send);
                })
        }
    }

    function updateConversation(close, send) {
        ConversationService.update({id: vm.conversation.id, development_lead_assessment: vm.employeeZone.id})
            .then(function (conversation) {
                vm.conversation = conversation;
                vm.busy = false;
                sendNotification(send);
                if (close) {
                    vm.close();
                }
            })
    }

    function sendDraft() {
        vm.is_draft = true;
        saveAssessment(true, true);
    }

    function sendNotification(send) {
        if (send) {
            Notification.success('Saved and sent to ' + vm.conversation.development_lead.full_name)
        } else {
            Notification.success('Saved!')
        }
    }

    function close() {
        if (vm.conversation) {
            $modalInstance.close(vm.conversation);
        } else {
            $modalInstance.close();
        }
    }
}