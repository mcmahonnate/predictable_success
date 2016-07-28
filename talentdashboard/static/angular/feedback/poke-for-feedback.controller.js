angular
    .module('feedback')
    .controller('PokeForFeedbackController', PokeForFeedbackController);

    function PokeForFeedbackController(coach, employee, FeedbackRequestService, Notification, requests, $modalInstance, $scope) {
        var vm = this;
        vm.employee = employee;
        vm.coach = coach;
        vm.requests = requests;
        vm.coach = coach;

        var pronoun = 'their';
        if (vm.employee.gender == 'F') {
            pronoun = 'her'
        } else if (vm.employee.gender == 'M') {
            pronoun = 'he'
        }

        vm.message = 'Hi,\r\nI\'m ' + vm.employee.first_name + '\'s coach and I\'m hoping to deliver ' + pronoun;
        vm.message = vm.message + ' feedback in the next couple of days. ' + vm.employee.first_name;
        vm.message = vm.message + ' would really benefit by having your input. If you need more time please let me know.\r\n\r\n'
        vm.message = vm.message + 'Thanks,\r\n' + vm.coach.first_name;
        vm.cancel = cancel;
        vm.submit = submit;

        function submit() {
            FeedbackRequestService.poke(vm.requests, vm.message, vm.employee.id, vm.coach.id)
                .then(function (data) {
                    Notification.success("We've sent your reminder.");
                    $modalInstance.close();
                });
        }

        function cancel() {
            $modalInstance.dismiss();
        }
    }

