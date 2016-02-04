    angular
        .module('devzones')
        .controller('SelfieController', SelfieController);

    function SelfieController(DevZoneService, Notification, selfie, $modal, $modalInstance, $rootScope) {
        var vm = this;

        vm.selfie = selfie;
        vm.panel_index = 0;
        vm.busy = false;
        vm.cancel = cancel;
        vm.close = close;
        vm.startSelfie = startSelfie;
        vm.answerQuestion = answerQuestion;
        vm.startOver = startOver;
        vm.showWhoCanSeeThis = showWhoCanSeeThis;
        vm.finish = finish;
        vm.employee = $rootScope.currentUser.employee;
        vm.selectedAnswer = null;

        activate();

        function activate() {

        }


        function cancel() {
            $modalInstance.dismiss();
        }

        function close() {
            $modalInstance.close(vm.selfie)
            Notification.success('Your progress has been saved.')
        }

        function startSelfie() {
            vm.busy = true;
            if (!vm.selfie) {
                DevZoneService.saveEmployeeZone({employee: vm.employee.id, assessor: vm.employee.id})
                    .then(function (selfie) {
                        vm.selfie = selfie;
                        vm.panel_index = 2;
                        vm.busy = false;
                    })
            }
            else {
                vm.panel_index = 2
                vm.busy = false;
            }
        }

        function answerQuestion(answer) {
            vm.busy = true;
            vm.selfie.last_question_answered = vm.selfie.next_question.id;
            vm.selfie.answers.push(answer.id);
            DevZoneService.updateEmployeeZone(vm.selfie)
                .then(function(selfie){
                    vm.selectedAnswer = null;
                    vm.selfie = selfie;
                    vm.busy = false;
                }
            );
        }

        function startOver() {
            vm.busy = true;
            vm.selfie.last_question_answered = null;
            vm.selfie.answers = [];
            vm.selfie.zone = null;
            DevZoneService.updateEmployeeZone(vm.selfie)
                .then(function(selfie){
                    vm.panel_index=0;
                    vm.selectedAnswer=null;
                    vm.selfie = selfie;
                    vm.busy = false;
                }
            );
        }

        function finish() {
            vm.busy = true;
            DevZoneService.updateEmployeeZone({id: vm.selfie.id, notes: vm.selfie.notes, completed: true})
                .then(function(selfie){
                    vm.selfie = selfie;
                    Notification.success('Your selfie has been shared.')
                    $modalInstance.close(selfie);
                    vm.busy = false;
                }
            );
        }

        function showWhoCanSeeThis(employee_id, employee_view) {
            $modal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: '/static/angular/partials/_modals/who-can-see-this.html',
                controller: 'SupportTeamCtrl',
                resolve: {
                    employee_view: function () {
                        return employee_view
                    },
                    employee_id: function () {
                        return employee_id
                    }
                }
        });
    }
    }
