angular
    .module('devzones')
    .controller('DevZonesController', DevZonesController);

function DevZonesController(DevZoneService, Notification, analytics, $location, $modal, $scope, $sce, $rootScope) {
    /* Since this page can be the root for some users let's make sure we capture the correct page */
    var location_url = $location.url().indexOf('/devzones') < 0 ? '/devzones' : $location.url();
    analytics.trackPage($scope, $location.absUrl(), location_url);

    var vm = this;
    vm.busy = false;
    vm.collapse = false;
    vm.showEmptyScreen = false;
    vm.selfie = null;
    vm.idSessionIntro = $rootScope.customer.devzones_id_session_intro;
    vm.welcome = $sce.trustAsHtml($rootScope.customer.devzones_welcome);
    vm.mySelfies = [];
    vm.myConversation = null;
    vm.myTeamLeadConversations = []
    vm.submitDevZone = submitDevZone;
    vm.requestCheckIn = requestCheckIn;
    vm.requestFeedback = requestFeedback;
    vm.toggleCollapse = toggleCollapse;

    activate();

    function activate() {
        getConversation();
        getMySelfies();
        getMyTeamLeadConversations();
    };

    function getConversation() {
        vm.busy = true;
        DevZoneService.getMyConversation()
            .then(function(conversation){
                vm.myConversation = conversation;
                vm.selfie = conversation.employee_assessment;
                vm.busy = false;
            }, function(){
                vm.busy = false;
            }
        )
    };

    function getMySelfies() {
        DevZoneService.getMyEmployeeZones()
            .then(function(selfies){
                vm.mySelfies = selfies;
            }
        )
    };

    function getMyTeamLeadConversations() {
        DevZoneService.getMyTeamLeadConversations()
            .then(function(conversations){
                vm.myTeamLeadConversations = conversations;
            }
        )
    };

    function submitDevZone() {
        var modalInstance = $modal.open({
            animation: true,
            windowClass: 'xx-dialog fade zoom',
            backdrop: 'static',
            templateUrl: '/static/angular/devzones/partials/_modals/add-selfie.html',
            controller: 'TakeSelfieController as selfie',
            resolve: {
                    selfie: function () {
                        return vm.selfie
                    }
            }
        });
        modalInstance.result.then(
            function (selfie) {
                vm.selfie = selfie;
                if (selfie.completed) {
                    vm.mySelfies.push(selfie)
                }
            }
        );
    };

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
            function (sentFeedbackRequests) {
                $location.path("/checkins");
            }
        );
    };

    function requestFeedback() {
        var modalInstance = $modal.open({
            animation: true,
            windowClass: 'xx-dialog fade zoom',
            backdrop: 'static',
            templateUrl: '/static/angular/partials/feedback/_modals/request-feedback.html',
            controller: 'RequestFeedbackController as request',
            resolve: {

            }
        });
        modalInstance.result.then(
            function (sentFeedbackRequests) {
                 Notification.success('Your feedback request have been sent!')
                $location.path("/feedback");
            }
        );
    };

    function toggleCollapse() {
        vm.collapse = !vm.collapse;
    }
}
