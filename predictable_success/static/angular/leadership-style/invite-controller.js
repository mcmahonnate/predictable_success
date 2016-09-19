    angular
        .module('leadership-style')
        .controller('InviteController', InviteController);

    function InviteController(LeadershipStyleInviteService, team_id, $timeout, $modalInstance, $rootScope) {
        var vm = this;
        vm.subject = $rootScope.currentUser.employee;
        vm.message = '';
        vm.submit = submit;
        vm.cancel = cancel;
        vm.addEmail = addEmail;
        vm.invites = []
        vm.enableSend = true;

        activate();

        function activate() {
            addEmail();
            addEmail();
            addEmail();
        }

        function addEmail() {
            var invite = angular.copy({'email': ''});
            vm.invites.push(invite);
        }

        function submit() {
            vm.enableSend = false;
            var invites = [];
            angular.forEach(vm.invites, function(invite){
                if (invite.email) {
                    invites.push(invite.email);
                }
            })
            LeadershipStyleInviteService.sendInvites(team_id, invites)
                .then(function(invites) {

                    /* Big success message */
                    $rootScope.successRequestMessage = true;
                    $rootScope.successRequestMessageRecipient = vm.invites;

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
