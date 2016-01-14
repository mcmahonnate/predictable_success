angular
    .module('checkins')
    .controller('CheckInsController', CheckInsController);

function CheckInsController(CheckInsService, analytics, $location, $scope) {
    /* Since this page can be the root for some users let's make sure we capture the correct page */
    var location_url = $location.url().indexOf('/checkins') < 0 ? '/checkins' : $location.url();
    analytics.trackPage($scope, $location.absUrl(), location_url);

    var vm = this;
    vm.checkins = [];
    vm.hostedCheckins = []

    activate();

    function activate() {
        getCheckIns();
        getHostedCheckIns()
    };

    function getCheckIns() {
        CheckInsService.getMyCheckIns()
            .then(function (data) {
                vm.checkins = data;
                return vm.checkins;
            });
    }

    function getHostedCheckIns() {
        CheckInsService.getCheckInsIveConducted()
            .then(function (data) {
                vm.hostedCheckins = data;
                return vm.hostedCheckins;
            });
    }

}
