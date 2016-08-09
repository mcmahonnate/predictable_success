angular
    .module('checkins')
    .controller('SaveInfoController', SaveInfoController);

function SaveInfoController($modalInstance, employee_name) {
    var vm = this;
    vm.dontShowThisAgain = false;
    vm.employeeName = employee_name;
    vm.close = function () {
        $modalInstance.close(vm.dontShowThisAgain);
    }
}