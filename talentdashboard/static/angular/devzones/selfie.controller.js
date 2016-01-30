    angular
        .module('devzones')
        .controller('SelfieController', SelfieController);

    function SelfieController(DevZoneService, Notification, $modalInstance, $rootScope) {
        var vm = this;

        vm.panel_index = 0;
        vm.cancel = cancel;
        vm.startSelfie = startSelfie;
        vm.answerQuestion = answerQuestion;
        vm.employee = $rootScope.currentUser.employee;
        vm.selectedAnswer = null;
        vm.selfie = null;

        activate();

        function activate() {
        }


        function cancel() {
            $modalInstance.dismiss();
        }

        function startSelfie() {
            vm.panel_index = 2;
            DevZoneService.getUnfinished()
                .then(function(selfie){
                    vm.selfie = selfie;
                }, function(error){
                    DevZoneService.saveEmployeeZone({employee: vm.employee.id})
                        .then(function(selfie){
                            vm.selfie = selfie;
                    })
                }
            );
        }

        function answerQuestion() {
            vm.selfie.last_question_answered = vm.selfie.next_question.id
            vm.selfie.answers.push(vm.selectedAnswer.id);
            console.log(vm.selfie);
            DevZoneService.updateEmployeeZone(vm.selfie)
                .then(function(selfie){
                    vm.selfie = selfie;
                    console.log('answered');
                    console.log(vm.selfie);
                }
            );
        }

    }
