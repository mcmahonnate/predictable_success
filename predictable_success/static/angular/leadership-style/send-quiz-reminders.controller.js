    angular
        .module('leadership-style')
        .controller('SendQuizRemindersController', SendQuizRemindersController);

    function SendQuizRemindersController(analytics, team_members, LeadershipStyleInviteService, Notification, $modalInstance) {
        var vm = this;
        analytics.setPage('/team/remind');
        analytics.trackPage();
        vm.teamMembers = team_members;
        vm.selectedTeamMembers = angular.copy(team_members);
        vm.message = '';
        vm.cancel = cancel;
        vm.submit = submit;

        function submit(){
            analytics.trackEvent('Send reminders button', 'click', null);

            var quiz_ids = [];
            angular.forEach(vm.selectedTeamMembers, function(team_member) {
              this.push(team_member.quiz.id);
            }, quiz_ids);
            LeadershipStyleInviteService.remindMany(quiz_ids, vm.message)
                .then(function(value){
                    $modalInstance.close(value)
                    Notification.success("Reminders sent.")
                }
            )
        }

        function cancel() {
            analytics.trackEvent('Cancel button', 'click', null);
            $modalInstance.close();
        }
    }