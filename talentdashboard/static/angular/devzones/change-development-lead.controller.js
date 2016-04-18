angular
    .module('devzones')
    .controller('ChangeDevelopmentLeadController', ChangeDevelopmentLeadController);

function ChangeDevelopmentLeadController(EmployeeSearch, $modalInstance, $rootScope) {
    var vm = this;
    vm.employees = [];
    vm.newDevelopmentLead = null;
    vm.save = save;
    vm.cancel = cancel;

    activate();

    function activate() {
        return EmployeeSearch.query().$promise
            .then(function(data) {
                vm.employees = data;
                return vm.employees;
            });
    }

    function save(form) {
        if(form.$invalid) return;
        $modalInstance.close(vm.newDevelopmentLead );
    }

    function cancel() {
        $modalInstance.dismiss();
    }
}
