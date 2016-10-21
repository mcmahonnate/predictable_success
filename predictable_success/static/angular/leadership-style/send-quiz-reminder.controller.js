    angular
        .module('leadership-style')
        .controller('SendQuizReminderController', SendQuizReminderController);

    function SendQuizReminderController(employee, LeadershipStyleTeamService, Notification, $modalInstance) {
        var vm = this;
        vm.message = '';
        vm.employee = employee;
        vm.cancel = cancel;
        vm.submit = submit;

        function submit(){
            LeadershipStyleTeamService.requestTeamReport(team_id, vm.message)
                .then(function(team){
                    $modalInstance.close(team)
                    Notification.success("We are generating your report and will email to you when it's ready. Please allow 3-5 business days.")
                }, function(){
                    $modalInstance.close()
                    Notification.error("Oops! We ran into an error.  We've reported the error and will it resolved soon.")
                }
            )

        }

        function cancel() {
            $modalInstance.dismiss();
        }
    }