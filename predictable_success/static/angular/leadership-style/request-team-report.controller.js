    angular
        .module('leadership-style')
        .controller('RequestTeamReportController', RequestTeamReportController);

    function RequestTeamReportController(team_id, LeadershipStyleTeamService, Notification, $modalInstance) {
        var vm = this;
        vm.message = '';
        vm.cancel = cancel;
        vm.submit = submit;

        function submit(){
            LeadershipStyleTeamService.requestTeamReport(team_id, vm.message)
                .then(function(response){
                    $modalInstance.close()
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