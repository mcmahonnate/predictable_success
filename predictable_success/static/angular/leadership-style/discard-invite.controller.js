    angular
        .module('leadership-style')
        .controller('DiscardInviteController', DiscardInviteController);

    function DiscardInviteController(analytics, employee, team_id, LeadershipStyleTeamService, Notification, $modalInstance) {
        var vm = this;
        analytics.setPage('/discard-invite');
        analytics.trackPage();
        vm.employee = employee;
        vm.cancel = cancel;
        vm.submit = submit;

        function submit(){
            analytics.trackEvent("Discard invite Yes button", "click", null);
            LeadershipStyleTeamService.removeTeamMember(team_id, employee)
                .then(function(team){
                    $modalInstance.close(team)
                    Notification.success(employee.full_name + " has been removed.")
                }
            )

        }

        function cancel() {
            analytics.trackEvent("Discard invite No button", "click", null);
            $modalInstance.close();
        }
    }