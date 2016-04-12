angular
    .module('devzones')
    .controller('AddEditMeetingController', AddEditMeetingController);

function AddEditMeetingController(ConversationService, EmployeeSearch, meeting, MeetingService, Notification, $modalInstance, $rootScope) {
    var vm = this;
    vm.meeting = meeting;
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
            vm.participants = vm.meeting.participants;
            angular.forEach(vm.meeting.participants, function(participant, key) {
                participant.employeesRepresented = [];
                findConversationsForParticipant(participant);
            });
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

    function findConversationsForParticipant(participant) {
        angular.forEach(vm.meeting.conversations, function(conversation, key) {
            if (conversation.development_lead.id == participant.id) {
                participant.employeesRepresented.push(conversation.employee);
            }
        });
    }

    function getConversationByEmployee(employee_id) {
        var array_index = null;
        angular.forEach(vm.meeting.conversations, function(conversation, index) {
            if (conversation.employee.id == employee_id) {
                array_index = index;
            }
        });
        return array_index!=null ? vm.meeting.conversations[array_index] : null;
    }

    function getConversatonsToDelete() {
        var conversations= [];
        angular.forEach(vm.meeting.conversations, function(conversation, key) {
            if (!conversation.keep) {
                conversations.push({id: conversation.id, meeting: null});
            }
        });
        return conversations;
    }

    function save() {
        vm.busy = true;
        var participant_ids = [];
        angular.forEach(vm.participants, function(value, key) {
            participant_ids.push(value.pk ? value.pk : value.id);
        });
        if (!vm.meeting) {
            MeetingService.create({name: vm.name, participants: participant_ids})
                .then(function (meeting) {
                    var conversations = [];
                    angular.forEach(vm.participants, function (participant, key) {
                        angular.forEach(participant.employeesRepresented, function (employee, key) {
                            var conversation = {
                                meeting: meeting.id,
                                development_lead: participant.pk ? participant.pk : participant.id,
                                employee: employee.pk ? employee.pk : employee.id
                            }
                            conversations.push(conversation);
                        });
                    });
                    ConversationService.create(conversations)
                        .then(function (conversations) {
                            $modalInstance.close(meeting);
                            Notification.success('Your meeting has been saved.')
                        })
                })
        }
        else {
            MeetingService.update({id: vm.meeting.id, name: vm.name, participants: participant_ids})
                .then(function (meeting) {
                    var newConversations = [];
                    var updatedConversations = [];
                    angular.forEach(vm.participants, function (participant, key) {
                        angular.forEach(participant.employeesRepresented, function (employee, key) {
                            var participant_id = participant.pk ? participant.pk : participant.id;
                            var employee_id = employee.pk ? employee.pk : employee.id;
                            var conversation = getConversationByEmployee(employee_id);
                            if (conversation) { conversation.keep = true};
                            if (!conversation) {
                                var newConversation = {
                                    meeting: meeting.id,
                                    development_lead: participant_id,
                                    employee: employee_id
                                }
                                newConversations.push(newConversation);
                            } else if (conversation.development_lead.id != participant_id) {
                                updatedConversations.push({
                                    id: conversation.id,
                                    meeting: meeting.id,
                                    development_lead: participant_id,
                                    employee: employee_id
                                });
                            }
                        });
                    });
                    var deletedConversations = getConversatonsToDelete();
                    ConversationService.create(newConversations)
                        .then(function (newConversations) {
                            ConversationService.updateBulk(updatedConversations)
                                .then(function (updatedConversations) {
                                    ConversationService.updateBulk(deletedConversations)
                                        .then(function (deletedConversations) {
                                            MeetingService.get(meeting.id)
                                                .then(function(response) {
                                                    $modalInstance.close(response);
                                                    Notification.success('Your meeting has been updated.')
                                            })
                                        })
                                })
                        })

                })
        }
    }
}