angular
    .module('checkins')
    .controller('CheckInsController', CheckInsController);

function CheckInsController(CheckInsService, CheckInRequestService, Notification, analytics, $location, $modal, $scope, $sce, $rootScope, $window) {
    /* Since this page can be the root for some users let's make sure we capture the correct page */
    var location_url = $location.url().indexOf('/checkins') < 0 ? '/checkins' : $location.url();
    analytics.trackPage($scope, $location.absUrl(), location_url);

    var vm = this;
    vm.checkins = [];
    vm.myRequests = [];
    vm.myToDos = [];
    vm.hostedCheckins = [];
    vm.checkinsLoaded = false;
    vm.hostedCheckinsLoaded = false;
    vm.requestsLoaded = false;
    vm.todosLoaded = false;
    vm.showEmptyScreen = false;
    vm.welcome = $sce.trustAsHtml($rootScope.customer.checkin_welcome);
    vm.requestCheckIn = requestCheckIn;
    vm.cancelRequest = cancelRequest;

    activate();

    function activate() {
        getCheckIns();
        getHostedCheckIns()
        getMyCheckInRequests();
        getMyCheckInToDos();
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

    function getMyCheckInRequests() {
        CheckInRequestService.getMyCheckInRequests()
            .then(function (data) {
                vm.myRequests = data;
                vm.requestsLoaded = true;
                checkIsEmpty();
                return vm.myRequests;
            });
    }

    function getMyCheckInToDos() {
        CheckInRequestService.getMyCheckInToDos()
            .then(function (data) {
                vm.myToDos = data;
                vm.todosLoaded = true;
                checkIsEmpty();
                return vm.myToDos;
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
        if (vm.checkinsLoaded && vm.hostedCheckinsLoaded && vm.todosLoaded && vm.requestsLoaded) {
            if (vm.checkins.length == 0 && vm.hostedCheckins.length == 0 && vm.myToDos.length == 0 && vm.myRequests.length == 0) {
                vm.showEmptyScreen = true;
            } else {
                vm.showEmptyScreen = false;
            }
        }
    }

    function requestCheckIn() {
        var modalInstance = $modal.open({
            animation: true,
            windowClass: 'xx-dialog fade zoom',
            backdrop: 'static',
            templateUrl: '/static/angular/checkins/partials/_modals/request-checkin.html',
            controller: 'RequestCheckInController as request',
            resolve: {

            }
        });
        modalInstance.result.then(
            function (request) {
                console.log(request);
                vm.myRequests.push(request);
            }
        );
    }

    function cancelRequest(request, index) {
        if ($window.confirm('Are you sure you want to cancel this request?')) {
            CheckInRequestService.cancelRequest(request)
                .then(function () {
                    Notification.success("Your request for " + request.host.first_name + " has been canceled.");
                    vm.myRequests.splice(index,1);
                });
        }
    }

}
