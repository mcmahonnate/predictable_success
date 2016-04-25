    angular
        .module('qualities')
        .controller('RequestPerceptionController', RequestPerceptionController);

    function RequestPerceptionController(panel, PerceptionRequestService, QualityClusterService, EmployeeSearch, Notification, $modal, $timeout, $modalInstance, $rootScope) {
        var vm = this;
        vm.category = null;
        vm.categories = [];
        vm.potentialReviewers = [];
        vm.subject = $rootScope.currentUser.employee;
        vm.message = '';
        vm.sendPerceptionRequests = sendPerceptionRequests;
        vm.stepNext = stepNext;
        vm.stepBack = stepBack;
        vm.cancel = cancel;
        vm.panel_index = panel;
        vm.enableSend = true;

        activate();

        function activate() {
            getPotentialReviewers();
            getQualityClusters();
        }

        function getPotentialReviewers() {
            return EmployeeSearch.query().$promise
                .then(function(data) {
                    vm.potentialReviewers = data;
                    return vm.potentialReviewers;
                });
        }

        function getQualityClusters() {
            return QualityClusterService.getQualityClusters()
                .then(function (data) {
                    vm.categories = data;
                    return vm.categories;
                });
        }

        function sendPerceptionRequests() {
            vm.enableSend = false;
            PerceptionRequestService.sendPerceptionRequests(vm.selectedReviewers, vm.message, vm.category)
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
