    angular
        .module('feedback')
        .controller('RequestFeedbackController', RequestFeedbackController);

    function RequestFeedbackController(FeedbackRequestService, CoachService, Notification, $modal, $timeout, $modalInstance, $rootScope) {
        var vm = this;
        vm.potentialReviewers = [];
        //vm.selectedReviewers = [];
        vm.subject = $rootScope.currentUser.employee;
        vm.message = '';
        vm.currentCoach = null;
        vm.sendFeedbackRequests = sendFeedbackRequests;
        vm.changeCoach = changeCoach;
        vm.stepNext = stepNext;
        vm.stepBack = stepBack;
        vm.cancel = cancel;
        vm.panel_index = 0;
        vm.enableSend = true;
        vm.questions = {
            excelsAtQuestion: $rootScope.customer.feedback_excels_at_question,
            couldImproveOnQuestion: $rootScope.customer.feedback_could_improve_on_question,
            leadershipQuestion: $rootScope.customer.feedforward_leadership_question
        };
        vm.tips = $rootScope.customer.feedback_tips;
        $rootScope.highlightFocusAreas = highlightFocusAreas;

        activate();

        function activate() {
            getPotentialReviewers();
            getCurrentCoach();
        }

        function highlightFocusAreas(){
            $rootScope.highlight = true;
            $timeout(function() {
                $rootScope.highlight = false;
            }, 2000);
        };

        function getPotentialReviewers() {
            return FeedbackRequestService.getPotentialReviewers()
                .then(function (data) {
                    vm.potentialReviewers = data;
                    return vm.potentialReviewers;
                });
        }


        function sendFeedbackRequests() {
            vm.enableSend = false;
            FeedbackRequestService.sendFeedbackRequests(vm.selectedReviewers, vm.message)
                .then(function(sentFeedbackRequests) {

                    /* Big succes message */
                    $rootScope.successRequestMessage = true;
                    $rootScope.successRequestMessageRecipient = vm.selectedReviewers;
                    
                    /* Hide success message after a few seconds */
                    $timeout(function() {
                        $rootScope.hideRequestMessage = true;
                    }, 10000); 

                    $modalInstance.close(sentFeedbackRequests)
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
                templateUrl: '/static/angular/profile/partials/_modals/change-coach.html',
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
