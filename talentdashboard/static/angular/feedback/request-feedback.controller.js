    angular
        .module('feedback')
        .controller('RequestFeedbackController', RequestFeedbackController);

    function RequestFeedbackController(FeedbackRequestService, CoachService, Notification, $modal, $modalInstance) {
        var vm = this;
        vm.potentialReviewers = [];
        vm.selectedReviewers = [];
        vm.message = '';
        vm.currentCoach = null;
        vm.sendFeedbackRequests = sendFeedbackRequests;
        vm.changeCoach = changeCoach;
        vm.stepNext = stepNext;
        vm.stepBack = stepBack;
        vm.cancel = cancel;
        vm.panel_index = 0;

        activate();

        function activate() {
            getPotentialReviewers();
            getCurrentCoach();
        }

        function getPotentialReviewers() {
            return FeedbackRequestService.getPotentialReviewers()
                .then(function (data) {
                    vm.potentialReviewers = data;
                    return vm.potentialReviewers;
                });
        }

        function sendFeedbackRequests() {
            FeedbackRequestService.sendFeedbackRequests(vm.selectedReviewers, vm.message)
                .then(function() {
                    Notification.success("Your feedback requests have been sent.");
                    $modalInstance.close()
                });
        }

        function getCurrentCoach() {
            CoachService.getCurrentCoach()
                .then(function(data) {
                    vm.currentCoach = data;
                    return vm.currentCoach;
                });
        }

        function changeCoach() {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/static/angular/partials/_modals/change-coach.html',
                controller: 'ChangeCoachController',
                controllerAs: 'changeCoach',
                resolve: {
                    currentCoach: function () {
                        return vm.currentCoach;
                    }
                }
            });
            modalInstance.result.then(
                function (newCoach) {
                    Notification.success("Your coach has been changed to " + newCoach.full_name);
                    vm.currentCoach = newCoach;
                }
            );
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
