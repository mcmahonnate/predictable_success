    angular
        .module('devzones')
        .controller('SelfieController', SelfieController);

    function SelfieController(DevZoneService, Notification, $modalInstance, $rootScope) {
        var vm = this;

        vm.panel_index = 0;
        vm.cancel = cancel;
        vm.startSelfie = startSelfie;
        vm.answerQuestion = answerQuestion;
        vm.startOver = startOver;
        vm.clickedStartOver = false;
        vm.employee = $rootScope.currentUser.employee;
        vm.selectedAnswer = null;
        vm.selfie = null;

        activate();

        function activate() {
            getUnfinishedSelfie();
        }


        function cancel() {
            $modalInstance.dismiss();
        }

        function getUnfinishedSelfie() {
            DevZoneService.getUnfinished()
                .then(function(selfie){
                    vm.selfie = selfie;
                }
            )
        }

        function startSelfie() {
            vm.panel_index = 2;
            if (!vm.selfie) {
                DevZoneService.saveEmployeeZone({employee: vm.employee.id})
                    .then(function(selfie){
                        vm.selfie = selfie;
                })
            }
        }

        function answerQuestion(answer) {
            vm.selfie.last_question_answered = vm.selfie.next_question.id;
            vm.selfie.answers.push(answer.id);
            DevZoneService.updateEmployeeZone(vm.selfie)
                .then(function(selfie){
                    vm.selectedAnswer = null;
                    vm.selfie = selfie;
                }
            );
        }

        function startOver() {
            vm.selfie.last_question_answered = null;
            vm.selfie.answers = [];
            DevZoneService.updateEmployeeZone(vm.selfie)
                .then(function(selfie){
                    vm.panel_index=0;
                    vm.clickedStartOver = true;
                    vm.selectedAnswer=null;
                    vm.selfie = selfie;
                }
            );
        }


    }
