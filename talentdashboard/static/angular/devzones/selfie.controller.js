    angular
        .module('devzones')
        .controller('SelfieController', SelfieController);

    function SelfieController(DevZoneService, Notification, $modal, $modalInstance, $rootScope) {
        var vm = this;

        vm.panel_index = 0;
        vm.busy = false;
        vm.cancel = cancel;
        vm.close = close;
        vm.startSelfie = startSelfie;
        vm.answerQuestion = answerQuestion;
        vm.startOver = startOver;
        vm.showWhoCanSeeThis = showWhoCanSeeThis;
        vm.finish = finish;
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

        function close() {
            $modalInstance.close()
            Notification.success('Your progress has been saved.')
        }

        function getUnfinishedSelfie() {
            vm.busy = true;
            DevZoneService.getUnfinished()
                .then(function(selfie){
                    vm.selfie = selfie;
                    vm.busy = false;
                }, function(){
                    vm.busy = false;
                }
            )
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
                    vm.clickedStartOver = true;
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
                    Notification.success('Your selfie has been submitted.')
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
