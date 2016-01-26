angular
    .module('projects')
    .controller('AddProjectController', AddProjectController);

function AddProjectController(ProjectsService, Notification, EmployeeSearch, $modalInstance) {
    var vm = this;
    vm.project = {
        name: null,
        description: null,
        owners: [],
        sponsors: [],
        team_members: [],
        scores: []
    }
    vm.selectedOwners = [];
    vm.selectedSponsors = [];
    vm.selectedTeamMembers = [];
    vm.employees = [];
    vm.stepNext = stepNext;
    vm.stepBack = stepBack;
    vm.cancel = cancel;
    vm.save = save;
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

    function save() {
        for(var i=0; i < vm.selectedOwners.length; i++) {
            vm.project.owners.push(vm.selectedOwners[i].pk);
        }
        for(var i=0; i < vm.selectedSponsors.length; i++) {
            vm.project.sponsors.push(vm.selectedSponsors[i].pk);
        }
        for(var i=0; i < vm.selectedTeamMembers.length; i++) {
            vm.project.team_members.push(vm.selectedTeamMembers[i].pk);
        }
        angular.forEach(vm.ruleSet, function (rule) {
            if (rule.selected) {
                vm.project.scores.push(rule.selected);
            }
        });

        ProjectsService.save(vm.project)
            .then(function(project) {
                console.log(project.name);
                Notification.success(project.name + ' was created.')
                $modalInstance.close(project)
        });
    }
}