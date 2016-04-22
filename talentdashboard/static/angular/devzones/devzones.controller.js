angular
    .module('devzones')
    .controller('DevZonesController', DevZonesController);

function DevZonesController(ConversationService, DevZoneService, MeetingService, Notification, analytics, $location, $modal, $scope, $sce, $rootScope) {
    /* Since this page can be the root for some users let's make sure we capture the correct page */
    var location_url = $location.url().indexOf('/id') < 0 ? '/id' : $location.url();
    analytics.trackPage($scope, $location.absUrl(), location_url);

    var vm = this;
    vm.busy = true;
    vm.teamSelfiesCollapse = false;
    vm.meetingsCollapse = true;
    vm.showEmptyScreen = false;
    vm.selfie = null;
    vm.idSessionIntro = $rootScope.customer.devzones_id_session_intro;
    vm.welcome = $sce.trustAsHtml($rootScope.customer.devzones_welcome);
    vm.is_org_dev = $rootScope.currentUser.can_edit_employees;
    vm.myConversations = null;
    vm.myTeamLeadConversations = [];
    vm.meetings = [];
    vm.getMyCurrentConversationLoaded = false;
    vm.getMyConversationsLoaded = false;
    vm.getMyTeamLeadConversationsLoaded = false;
    vm.getMyMeetingsLoaded = false;
    vm.predicate = 'advice[0].severity';
    vm.reverse = true;
    vm.submitDevZone = submitDevZone;
    vm.requestCheckIn = requestCheckIn;
    vm.requestFeedback = requestFeedback;
    vm.showMeetingParticipants = showMeetingParticipants;
    vm.giveLeaderPerception = giveLeaderPerception;
    vm.addEditMeeting = addEditMeeting;
    vm.order = function (predicate) {
        vm.reverse = (vm.predicate === predicate) ? !vm.reverse : true;
        vm.predicate = predicate;
    };
    activate();

    function activate() {
        getMyConversations();
        getMyCurrentConversation();
        getMyTeamLeadConversations();
        getMyMeetings();
    };

    function isBusy() {
        if (vm.getMyCurrentConversationLoaded && vm.getMyConversationsLoaded && vm.getMyTeamLeadConversationsLoaded && vm.getMyMeetingsLoaded) {
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
                if ($rootScope.currentUser.permissions.indexOf("org.view_employees") > -1) {
                    vm.is_org_dev = true;
                }
                isBusy();
            }, function(){
                vm.getMyMeetingsLoaded = true;
                isBusy();
            }
        );
    };

    function getMyConversations() {
        vm.busy = true;
        ConversationService.getMyConversations()
            .then(function(conversations){
                vm.myConversations = conversations;
                vm.getMyConversationsLoaded = true;
                isBusy();
            }, function(){
                vm.getMyConversationsLoaded = true;
                isBusy();
            }
        )
    };

    function getMyCurrentConversation() {
        vm.busy = true;
        ConversationService.getMyCurrentConversation()
            .then(function(conversation){
                vm.myCurrentConversation = conversation;
                vm.getMyCurrentConversationLoaded = true;
                isBusy();
            }, function(){
                vm.getMyCurrentConversationLoaded = true;
                isBusy();
            }
        )
    }

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
                        return vm.myCurrentConversation.employee_assessment
                    }
            }
        });
        modalInstance.result.then(
            function (selfie) {
                vm.myCurrentConversation.employee_assessment = selfie;
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


    function giveLeaderPerception(conversation) {
        var modalInstance = $modal.open({
            animation: true,
            backdrop: 'static',
            templateUrl: '/static/angular/devzones/partials/_modals/leader-assessment.html',
            controller: 'LeaderAssessmentController as leaderAssessment',
            resolve: {
                compactView: function () {
                    return false
                },
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


    function addEditMeeting(view) {
        var modalInstance = $modal.open({
            animation: true,
            backdrop: 'static',
            templateUrl: '/static/angular/devzones/partials/_modals/add-edit-meeting.html',
            controller: 'AddEditMeetingController as addEditMeeting',
            resolve: {
                meetingToEdit: function () {
                    return null
                }
            }
        });
        modalInstance.result.then(
            function (meeting) {
                vm.meetings.push(meeting);
            }
        );
    }
}
