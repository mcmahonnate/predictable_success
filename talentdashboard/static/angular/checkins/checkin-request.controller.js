    angular
        .module('feedback')
        .controller('RequestCheckInController', RequestCheckInController);

    function RequestCheckInController(CheckInRequestService, CoachService, Notification, TeamLeadService, $modal, $modalInstance, $rootScope) {
        var vm = this;
        vm.request = {requester: null, host: null};
        vm.employee = $rootScope.currentUser.employee;
        vm.currentCoach = null;
        vm.selectedEmployee = null;
        vm.teamLead = null;
        vm.changeCoach = changeCoach;
        vm.sendCheckInRequest = sendCheckInRequest;
        vm.cancel = cancel;

        activate();

        function activate() {
            getCurrentCoach();
            getTeamLead();
        }

        function getCurrentCoach() {
            CoachService.getCurrentCoach()
                .then(function(data) {
                    vm.currentCoach = data;
                    return vm.currentCoach;
                });
        }

        function getTeamLead() {
            TeamLeadService.getCurrentTeamLead()
                .then(function(data) {
                    vm.teamLead = data;
                    return vm.teamLead;
                });
        }

        function sendCheckInRequest() {
            CheckInRequestService.sendCheckInRequest(vm.selectedEmployee.id)
                .then(function() {
                    Notification.success("Your request was sent to " + vm.selectedEmployee.first_name);
                    $modalInstance.close();
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

        function cancel() {
            $modalInstance.dismiss();
        }
    }
