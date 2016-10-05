    angular
        .module('leadership-style')
        .controller('InviteController', InviteController);

    function InviteController(LeadershipStyleInviteService, team_id, remaining_invites, team_member_count, $timeout, $modalInstance, $rootScope) {
        var vm = this;
        vm.remaining_invites = remaining_invites;
        vm.has_team_members = team_member_count > 0 ? true :  false;
        vm.subject = $rootScope.currentUser.employee;
        vm.message = '';
        vm.submit = submit;
        vm.cancel = cancel;
        vm.addEmail = addEmail;
        vm.invites = []
        vm.enableSend = true;

        activate();

        function activate() {
            var count = remaining_invites >=3 ? 3 : remaining_invites;
            for (var i = 0; i < count; i++) {
                addEmail();
            }
        }

        function addEmail() {
            var invite = angular.copy({'email': ''});
            vm.invites.push(invite);
        }

        function submit() {
            vm.enableSend = false;
            var invites = [];
            var invite_notification = [];
            angular.forEach(vm.invites, function(invite){
                if (invite.email) {
                    invites.push(invite.email);
                    invite_notification.push(invite);
                }
            })
            LeadershipStyleInviteService.sendInvites(team_id, invites)
                .then(function(invites) {

                    /* Big success message */
                    $rootScope.successRequestMessage = true;
                    $rootScope.successRequestMessageRecipient = invite_notification;

                    /* Hide success message after a few seconds */
                    $timeout(function() {
                        $rootScope.hideRequestMessage = true;
                    }, 10000);

                    $modalInstance.close(invites)
                });
        }

        function cancel() {
            $modalInstance.dismiss();
        }
    }
