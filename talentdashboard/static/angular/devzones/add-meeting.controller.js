angular
    .module('devzones')
    .controller('AddMeetingController', AddMeetingController);

function AddMeetingController(ConversationService, EmployeeSearch, MeetingService, Notification, $modalInstance, $rootScope) {
    var vm = this;
    vm.meeting = null;
    vm.panel_index = -1;
    vm.busy = false;
    vm.name = '';
    vm.employees = [];
    vm.participants = [];
    vm.conversations = [];
    vm.cancel = cancel;
    vm.save = save;
    activate();

    function activate() {
        getEmployees();
        if (vm.meeting) {
            vm.name = vm.meeting.name;
            vm.participants = vm.meeting.participants
        }
    }

    function cancel() {
        $modalInstance.dismiss();
    }

    function getEmployees() {
        return EmployeeSearch.query().$promise
            .then(function (data) {
                vm.employees = data;
                return vm.employees;
            });
    }

    function save() {
        vm.busy = true;
        var participant_ids = [];
        angular.forEach(vm.participants, function(value, key) {
            participant_ids.push(value.pk ? value.pk : value.id);
        });
        MeetingService.create({name: vm.name, participants: participant_ids})
            .then(function (meeting) {
                var conversations = [];
                angular.forEach(vm.participants, function(participant, key) {
                    angular.forEach(participant.employeesRepresented, function(employee, key) {
                        var conversation = {meeting: meeting.id, development_lead: participant.pk ? participant.pk : participant.id, employee: employee.pk ? employee.pk : employee.id}
                        conversations.push(conversation);
                    });
                });
                ConversationService.create(conversations)
                    .then(function (converstaions) {
                        $modalInstance.close(meeting);
                        Notification.success('Your meeting has been saved.')
                    })
            })
    }
}