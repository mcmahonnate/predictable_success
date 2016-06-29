angular
    .module('profile')
    .controller('CoachProfileController', CoachProfileController);

function CoachProfileController(CoachProfileService, EmployeeSearch, employeeId, Notification, $modalInstance) {
    var vm = this;
    vm.profile = {id: null, employee: null, blacklist: null, max_allowed_coachees: null};
    vm.coach = null;
    vm.employees = [];
    vm.panel_index = 0;
    vm.save = save;
    vm.update = update;
    vm.cancel = cancel;
    vm.capacity = null;
    vm.capacityChoices = [
        {text: '4 - 6 Coachees', min: 4, max: 6},
        {text: '7 - 9 Coachees', min: 7, max: 9},
        {text: '10 - 12 Coachees', min: 10, max: 12},
        {text: '13 - 15 Coachees', min: 13, max: 15},
        {text: '16 - 18 Coachees', min: 16, max: 18},
        {text: 'more than 18 Coachees', min: 19, max: 50},
    ];

    activate()

    function activate() {
        getEmployees()
        if (employeeId) {
            getProfile();
        }
    }

    function getCapacity() {
        if (vm.profile.max_allowed_coachees) {
            angular.forEach(vm.capacityChoices, function(choice) {
                if (vm.profile.max_allowed_coachees >= choice.min && vm.profile.max_allowed_coachees <= choice.max ) {
                    vm.capacity = choice;
                }
            })
        }
    }

    function getProfile() {
        CoachProfileService.get(employeeId)
            .then(function(profile){
                vm.profile = profile;
                getCapacity();
            }, function(error){
                Notification.error("Sorry we had a problem retrieving this profile.");
            });
    }

    function getEmployees() {
        return EmployeeSearch.query().$promise
            .then(function (data) {
                vm.employees = data;
                return vm.employees;
            });
    }


    function save() {
        var blacklist_ids = [];
        angular.forEach(vm.profile.blacklist, function(value) {
            blacklist_ids.push(value.pk ? value.pk : value.id);
        });
        CoachProfileService.update({id: vm.profile.id, employee: vm.profile.employee.id, max_allowed_coachees: vm.capacity.max, blacklist: blacklist_ids, approach: vm.profile.approach})
            .then(function(profile){
                $modalInstance.close(profile);
                vm.profile = profile;
                Notification.success("Your coaching profile has been saved.");
            }, function(error){
                $modalInstance.close(profile);
                Notification.error("Sorry we had a problem saving this profile.");
            });
    }

    function update() {
        CoachProfileService.update(profile)
            .then(function(profile){
                $modalInstance.close(profile);
                vm.profile = profile;
            }, function(error){
                $modalInstance.close(profile);

                Notification.error("Sorry we had a problem updating this profile.");
            });
    }

    function cancel() {
        $modalInstance.dismiss();
    }
}
