    angular
        .module('leadership-style')
        .controller('DiscardInviteController', DiscardInviteController);

    function DiscardInviteController(employee, team_id, LeadershipStyleTeamService, Notification, $modalInstance) {
        var vm = this;
        vm.employee = employee;
        vm.cancel = cancel;
        vm.submit = submit;

        function submit(){
            LeadershipStyleTeamService.removeTeamMember(team_id, employee)
                .then(function(team){
                    $modalInstance.close(team)
                    Notification.success(employee.full_name + " has been removed.")
                }
            )

        }

        function cancel() {
            $modalInstance.dismiss();
        }
    }