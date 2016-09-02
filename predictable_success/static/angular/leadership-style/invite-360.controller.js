    angular
        .module('leadership-style')
        .controller('Invite360Controller', Invite360Controller);

    function Invite360Controller(LeadershipStyleRequestService, $timeout, $modalInstance, $rootScope) {
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
            LeadershipStyleRequestService.sendLeadershipStyleRequests(null, vm.message)
                .then(function(sentPerceptioRequests) {

                    /* Big success message */
                    $rootScope.successRequestMessage = true;
                    $rootScope.successRequestMessageRecipient = vm.selectedReviewers;

                    /* Hide success message after a few seconds */
                    $timeout(function() {
                        $rootScope.hideRequestMessage = true;
                    }, 10000);

                    $modalInstance.close(sentPerceptioRequests)
                });
        }

        function cancel() {
            $modalInstance.dismiss();
        }
    }
