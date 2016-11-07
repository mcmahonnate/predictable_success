    angular
        .module('leadership-style')
        .controller('SendQuizReminderController', SendQuizReminderController);

    function SendQuizReminderController(analytics, quiz, employee, LeadershipStyleInviteService, Notification, $modalInstance) {
        var vm = this;
        analytics.setPage('/team/member/remind');
        analytics.trackPage();
        vm.employee = employee;
        vm.message = '';
        vm.cancel = cancel;
        vm.submit = submit;

        function submit(){
            analytics.trackEvent('Send reminder button', 'click', null);
            LeadershipStyleInviteService.remind(quiz.id, vm.message)
                .then(function(value){
                    $modalInstance.close(value)
                    Notification.success("Reminder sent.")
                }
            )
        }

        function cancel() {
            analytics.trackEvent('Cancel button', 'click', null);
            $modalInstance.close();
        }
    }