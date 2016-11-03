    angular
        .module('leadership-style')
        .controller('RequestTeamReportController', RequestTeamReportController);

    function RequestTeamReportController(analytics, team_id, show_warning,  LeadershipStyleTeamService, Notification, $modalInstance) {
        analytics.setPage('/team/request-report');
        analytics.trackPage();
        var vm = this;
        vm.show_warning = show_warning;
        vm.trackEvent = analytics.trackEvent;
        vm.message = '';
        vm.page = 0;
        vm.cancel = cancel;
        vm.submit = submit;

        function submit(){
            analytics.trackEvent('Submit button', 'click', null);
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
            analytics.trackEvent('Cancel button', 'click', null);
            $modalInstance.close();
        }
    }