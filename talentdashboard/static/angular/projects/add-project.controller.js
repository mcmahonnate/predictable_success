angular
    .module('projects')
    .controller('AddProjectController', AddProjectController);

function AddProjectController(ProjectsService, Notification, EmployeeSearch, $modalInstance) {
    var vm = this;

    vm.name = null;
    vm.description = null;
    vm.employees = [];
    vm.selectedOwners = [];
    vm.selectedSponsors = [];
    vm.selectedTeamMembers = [];
    vm.stepNext = stepNext;
    vm.stepBack = stepBack;
    vm.cancel = cancel;
    vm.panel_index = 0;
    vm.ruleSet = [];

    activate()

    function activate() {
        getEmployees();
        getCriteria();
    }

    function getCriteria() {
        ProjectsService.getCurrentCriteria()
            .then(function (data) {
                vm.ruleSet = data.criteria;
                console.log(vm.ruleSet);
                return vm.ruleSet;
        });
    }

    function getEmployees() {
        EmployeeSearch.query(function(data) {
                vm.employees = data;
        });
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