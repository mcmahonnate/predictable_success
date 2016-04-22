angular
    .module('devzones')
    .controller('AddEditMeetingController', AddEditMeetingController);

function AddEditMeetingController(ConversationService, EmployeeSearch, meetingToEdit, MeetingService, Notification, $modalInstance, $rootScope) {
    var vm = this;
    vm.meeting = meetingToEdit;
    vm.panel_index = -1;
    vm.busy = false;
    vm.active = false;
    vm.name = '';
    vm.employees = [];
    vm.participants = [];
    vm.newConversations = [];
    vm.updatedConversations = [];
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

    function getConversationByEmployee(employee_id, meeting) {
        if (!vm.meeting || !vm.meeting.conversations) {
            return null;
        }
        var array_index = null;
        angular.forEach(vm.meeting.conversations, function(conversation, index) {
            if (conversation.employee.id == employee_id) {
                array_index = index;
            }
        });
        return array_index!=null ? vm.meeting.conversations[array_index] : null;
    }

    function getConversations(meeting) {
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
                    vm.newConversations.push(newConversation);
                } else if (conversation.development_lead.id != participant_id) {
                    vm.updatedConversations.push({
                        id: conversation.id,
                        meeting: meeting.id,
                        development_lead: participant_id,
                        employee: employee_id
                    });
                }
            });
        });
        var deletedConversations = getConversatonsToDelete();
        vm.updatedConversations = vm.updatedConversations.concat(deletedConversations);
    }

    function getConversatonsToDelete() {
        var conversations= [];
        if (vm.meeting && vm.meeting.conversations) {
            angular.forEach(vm.meeting.conversations, function (conversation, key) {
                if (!conversation.keep) {
                    vm.deletedConversations.push({id: conversation.id, meeting: null});
                }
            });
        }
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
                    getConversations(meeting);
                    ConversationService.create(vm.newConversations)
                        .then(function (conversations) {
                            if (vm.active || meeting.active) {
                                MeetingService.activate(meeting)
                                    .then(function() {
                                        $modalInstance.close(meeting);
                                        Notification.success('Your meeting has been saved and selfies have been sent.')
                                    })
                            } else {
                                $modalInstance.close(meeting);
                                Notification.success('Your meeting has been saved.')
                            }
                        })
                })
        }
        else {
            MeetingService.update({id: vm.meeting.id, name: vm.name, participants: participant_ids})
                .then(function (meeting) {
                    getConversations(meeting);
                    ConversationService.create(vm.newConversations)
                        .then(function (newConversations) {
                            ConversationService.updateBulk(vm.updatedConversations)
                                .then(function (updatedConversations) {
                                    MeetingService.get(meeting.id)
                                        .then(function(response) {
                                            if (vm.active || vm.meeting.active) {
                                                MeetingService.activate(meeting)
                                                .then(function() {
                                                    $modalInstance.close(response);
                                                    Notification.success('Your meeting has been saved and selfies have been sent.')
                                                })
                                            } else {
                                                $modalInstance.close(response);
                                                Notification.success('Your meeting has been saved.')
                                            }
                                    })

                                })
                        })

                })
        }
    }
}