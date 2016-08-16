    angular
        .module('leadership-style')
        .controller('LeadershipStyleRequestController', LeadershipStyleRequestController);

    function LeadershipStyleRequestController(panel, LeadershipStyleRequestService, Users, $timeout, $modalInstance, $rootScope) {
        var vm = this;
        vm.potentialReviewers = [];
        vm.subject = $rootScope.currentUser.employee;
        vm.message = '';
        vm.sendLeadershipStyleRequests = sendLeadershipStyleRequests;
        vm.stepNext = stepNext;
        vm.stepBack = stepBack;
        vm.cancel = cancel;
        vm.panel_index = panel;
        vm.enableSend = true;

        activate();

        function activate() {
            getPotentialReviewers();
        }

        function getPotentialReviewers() {
            return Users.query().$promise
                .then(function(data) {
                    vm.potentialReviewers = data;
                    return vm.potentialReviewers;
                });
        }

        function sendLeadershipStyleRequests() {
            vm.enableSend = false;
            LeadershipStyleRequestService.sendLeadershipStyleRequests(vm.selectedReviewers, vm.message)
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

        function stepNext() {
            vm.panel_index++;
        }

        function stepBack() {
            vm.panel_index--;
        }

        function cancel() {
            $modalInstance.dismiss();
        }
    }
