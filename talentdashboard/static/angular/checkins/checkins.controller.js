angular
    .module('checkins')
    .controller('CheckInsController', CheckInsController);

function CheckInsController(CheckInsService, analytics, $location, $scope) {
    /* Since this page can be the root for some users let's make sure we capture the correct page */
    var location_url = $location.url().indexOf('/checkins') < 0 ? '/checkins' : $location.url();
    analytics.trackPage($scope, $location.absUrl(), location_url);

    var vm = this;
    vm.checkins = [];
    vm.hostedCheckins = [];
    vm.checkinsLoaded = false;
    vm.hostedCheckinsLoaded = false;
    vm.showEmptyScreen = false;
    vm.requestCheckIn = requestCheckIn;

    activate();

    function activate() {
        getCheckIns();
        getHostedCheckIns()
    };

    function getCheckIns() {
        CheckInsService.getMyCheckIns()
            .then(function (data) {
                vm.checkins = data;
                vm.checkinsLoaded = true;
                checkIsEmpty();
                return vm.checkins;
            });
    }

    function getHostedCheckIns() {
        CheckInsService.getCheckInsIveConducted()
            .then(function (data) {
                vm.hostedCheckins = data;
                vm.hostedCheckinsLoaded = true;
                checkIsEmpty();
                return vm.hostedCheckins;
            });
    }

    function checkIsEmpty() {
        if (vm.checkinsLoaded && vm.hostedCheckinsLoaded) {
            if (vm.checkins.length == 0 && vm.hostedCheckins.length == 0) {
                vm.showEmptyScreen = true;
            } else {
                vm.showEmptyScreen = false;
            }
        }
    }

    function requestCheckIn() {
        console.log('Request Check In');
    }
}
