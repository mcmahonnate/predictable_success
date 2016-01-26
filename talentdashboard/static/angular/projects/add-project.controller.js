angular
    .module('projects')
    .controller('AddProjectController', AddProjectController);

function AddProjectController(project, ProjectsService, Notification, EmployeeSearch, $modalInstance) {
    var vm = this;
    vm.project = {
        name: null,
        description: '',
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
        if (project) {
            loadProject();
        }
        getEmployees();
        getCriteria();
    }

    function loadProject() {
        vm.project = angular.copy(project);
        vm.selectedOwners = angular.copy(project.owners);
        vm.selectedSponsors = angular.copy(project.sponsors);
        vm.selectedTeamMembers = angular.copy(project.team_members);
        vm.project.owners = [];
        vm.project.sponsors = [];
        vm.project.team_members = [];
    }

    function getCriteria() {
        ProjectsService.getCurrentCriteria()
            .then(function (data) {
                vm.ruleSet = data.criteria;
                if (vm.project.scores) {
                    angular.forEach(vm.ruleSet, function (rule) {
                        angular.forEach(vm.project.scores, function (score) {
                            if (rule.id == score.criteria_id) {
                                rule.selected = score.id;
                            }
                        });
                    });
                    vm.project.scores = [];
                }
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
            var pk = vm.selectedOwners[i].pk ? vm.selectedOwners[i].pk : vm.selectedOwners[i].id;
            vm.project.owners.push(pk);
        }
        for(var i=0; i < vm.selectedSponsors.length; i++) {
            var pk = vm.selectedSponsors[i].pk ? vm.selectedSponsors[i].pk : vm.selectedSponsors[i].id
            vm.project.sponsors.push(pk);
        }
        for(var i=0; i < vm.selectedTeamMembers.length; i++) {
            var pk = vm.selectedTeamMembers[i].pk ? vm.selectedTeamMembers[i].pk : vm.selectedTeamMembers[i].id;
            vm.project.team_members.push(pk);
        }
        angular.forEach(vm.ruleSet, function (rule) {
            if (rule.selected) {
                vm.project.scores.push(rule.selected);
            }
        });
        if (vm.project.id) {
            ProjectsService.update(vm.project)
                .then(function (project) {
                    Notification.success(project.name + ' was saved.')
                    $modalInstance.close(project)
                });
        } else {
            ProjectsService.save(vm.project)
                .then(function (project) {
                    Notification.success(project.name + ' was created.')
                    $modalInstance.close(project)
                });
        }
    }
}