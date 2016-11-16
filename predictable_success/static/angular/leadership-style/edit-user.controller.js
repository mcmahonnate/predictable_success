    angular
        .module('leadership-style')
        .controller('EditUserController', EditUserController);

    function EditUserController(analytics, employee, LeadershipStyleService, Notification, $modalInstance) {
        var vm = this;
        analytics.setPage('/edit-user');
        analytics.trackPage();
        vm.busy = false;
        employee.new_full_name = employee.full_name;
        vm.employee = employee;
        vm.cancel = cancel;
        vm.submit = submit;

        function submit(){
            analytics.trackEvent('Edit User Save button', 'click', null);
            vm.busy = true;
            var data = {id: vm.employee.id, full_name: vm.employee.new_full_name};
            LeadershipStyleService.updateEmployee(data)
                .then(function(result){
                    $modalInstance.close(result);
                    vm.busy = false;
                    Notification.success("Saved.")
                }, function () {
                    $modalInstance.cancel();
                    Notification.success("Whoops!")
                    vm.busy = false;
                }
            );
        }

        function cancel() {
            analytics.trackEvent("Edit User Cancel button", "click", null);
            $modalInstance.close();
        }
    }