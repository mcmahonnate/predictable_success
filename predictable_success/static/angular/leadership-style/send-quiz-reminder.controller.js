    angular
        .module('leadership-style')
        .controller('SendQuizReminderController', SendQuizReminderController);

    function SendQuizReminderController(analytics, quiz, LeadershipStyleInviteService, Notification, $modalInstance) {
        var vm = this;
        analytics.setPage('/team/member/remind');
        analytics.trackPage();
        vm.message = '';
        vm.cancel = cancel;
        vm.submit = submit;

        function submit(){
            analytics.trackEvent('Add invite button', 'click', null);
            LeadershipStyleInviteService.remind(quiz.id, vm.message)
                .then(function(value){
                    analytics.trackEvent('Send reminder button', 'click', null);
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