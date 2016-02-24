angular
    .module('devzones')
    .controller('DevZonesController', DevZonesController);

function DevZonesController(ConversationService, DevZoneService, MeetingService, Notification, analytics, $location, $modal, $scope, $sce, $rootScope) {
    /* Since this page can be the root for some users let's make sure we capture the correct page */
    var location_url = $location.url().indexOf('/devzones') < 0 ? '/devzones' : $location.url();
    analytics.trackPage($scope, $location.absUrl(), location_url);

    var vm = this;
    vm.busy = true;
    vm.teamSelfiesCollapse = false;
    vm.meetingsCollapse = true;
    vm.showEmptyScreen = false;
    vm.selfie = null;
    vm.idSessionIntro = $rootScope.customer.devzones_id_session_intro;
    vm.welcome = $sce.trustAsHtml($rootScope.customer.devzones_welcome);
    vm.isAdmin = $rootScope.currentUser.can_edit_employees;
    vm.mySelfies = [];
    vm.myConversation = null;
    vm.myTeamLeadConversations = [];
    vm.meetings = [];
    vm.getConversationLoaded = false;
    vm.getMySelifesLoaded = false;
    vm.getMyTeamLeadConversationsLoaded = false;
    vm.getMyMeetingsLoaded = false;
    vm.submitDevZone = submitDevZone;
    vm.requestCheckIn = requestCheckIn;
    vm.requestFeedback = requestFeedback;
    vm.showMeetingParticipants = showMeetingParticipants;
    vm.takeLeaderAssessment = takeLeaderAssessment;
    vm.addMeeting = addMeeting;

    activate();

    function activate() {
        getConversation();
        getMySelfies();
        getMyTeamLeadConversations();
        getMyMeetings();
    };

    function isBusy() {
        if (vm.getConversationLoaded && vm.getMySelifesLoaded && vm.getMyTeamLeadConversationsLoaded && vm.getMyMeetingsLoaded) {
            vm.busy = false;
        } else {
            vm.busy = true;
        }
    }

    function getMyMeetings() {
        MeetingService.getMyMeetings()
            .then(function(meetings){
                vm.meetings = meetings;
                vm.getMyMeetingsLoaded = true;
                isBusy();
            }, function(){
                vm.getMyMeetingsLoaded = true;
                isBusy();
            }
        );
    };

    function getConversation() {
        vm.busy = true;
        ConversationService.getMyConversation()
            .then(function(conversation){
                vm.myConversation = conversation;
                vm.selfie = conversation.employee_assessment;
                vm.getConversationLoaded = true;
                isBusy();
            }, function(){
                vm.getConversationLoaded = true;
                isBusy();
            }
        )
    };

    function getMySelfies() {
        DevZoneService.getMyEmployeeZones()
            .then(function(selfies){
                vm.mySelfies = selfies;
                vm.getMySelifesLoaded = true;
                isBusy();
            }, function(){
                vm.getMySelifesLoaded = true;
                isBusy();
            }
        )
    };

    function getMyTeamLeadConversations() {
        ConversationService.getMyTeamLeadConversations()
            .then(function(conversations){
                vm.myTeamLeadConversations = conversations;
                vm.getMyTeamLeadConversationsLoaded = true;
                isBusy();
            }, function(){
                vm.getMyTeamLeadConversationsLoaded = true;
                isBusy();
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

    function showMeetingParticipants(participants) {
        $modal.open({
            animation: true,
            backdrop: 'static',
            templateUrl: '/static/angular/devzones/partials/_modals/meeting-participants.html',
            controller: ['$scope', '$modalInstance', 'participants', function($scope, $modalInstance, participants) {
                $scope.participants = participants;
                $scope.cancel = function(){
                    $modalInstance.dismiss();
                };
            }],
            resolve: {
                participants: function () {
                    return participants
                },
            }
        });
    }


    function takeLeaderAssessment(conversation) {
        var modalInstance = $modal.open({
            animation: true,
            backdrop: 'static',
            templateUrl: '/static/angular/devzones/partials/_modals/leader-assessment.html',
            controller: 'LeaderAssessmentController as leaderAssessment',
            resolve: {
                conversation: function () {
                    return conversation
                },}
        });
        modalInstance.result.then(
            function (employeeZone) {
                conversation.development_lead_assessment = employeeZone;
            }
        );
    }


    function addMeeting() {
        var modalInstance = $modal.open({
            animation: true,
            backdrop: 'static',
            templateUrl: '/static/angular/devzones/partials/_modals/add-meeting.html',
            controller: 'AddMeetingController as addMeeting',
            resolve: {}
        });
        modalInstance.result.then(
            function (meeting) {
                vm.meetings.push(meeting);
            }
        );
    }
}
