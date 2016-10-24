    angular
        .module('leadership-style')
        .controller('SendQuizReminderController', SendQuizReminderController);

    function SendQuizReminderController(quiz, LeadershipStyleInviteService, Notification, $modalInstance) {
        var vm = this;
        vm.message = '';
        vm.cancel = cancel;
        vm.submit = submit;

        function submit(){
            LeadershipStyleInviteService.remind(quiz.id, vm.message)
                .then(function(value){
                    $modalInstance.close(value)
                    Notification.success("Reminder sent.")
                }
            )
        }

        function cancel() {
            $modalInstance.dismiss();
        }
    }