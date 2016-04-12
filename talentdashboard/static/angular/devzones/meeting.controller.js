angular
    .module('devzones')
    .controller('MeetingController', MeetingController);

function MeetingController(MeetingService, Notification, analytics, $location, $modal, $rootScope, $scope, $routeParams) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());

    var vm = this;
    vm.is_org_dev = false;
    vm.predicate = 'employee.full_name';
    vm.reverse = false;
    vm.addEditMeeting = addEditMeeting;
    vm.giveLeaderPerception = giveLeaderPerception;
    vm.order = function (predicate) {
        vm.reverse = (vm.predicate === predicate) ? !vm.reverse : true;
        vm.predicate = predicate;
    };
    activate();

    function activate() {
        getMeeting();
    };

    function getMeeting() {
        MeetingService.get($routeParams.meetingId)
            .then(function(meeting){
                    vm.meeting = meeting;
                    if ($rootScope.currentUser.permissions.indexOf("org.view_employees") > -1) {
                        vm.is_org_dev = true;
                    }
            }, function(error){
                    Notification.error("Sorry we had a problem opening this meeting.");
                }
            );
    };

    function addEditMeeting() {
        var modalInstance = $modal.open({
            animation: true,
            backdrop: 'static',
            templateUrl: '/static/angular/devzones/partials/_modals/add-edit-meeting.html',
            controller: 'AddEditMeetingController as addEditMeeting',
            resolve: {
                meeting: function () {
                    return vm.meeting
                }
            }
        });
        modalInstance.result.then(
            function (meeting) {
                if (vm.meeting) {
                    vm.meeting = meeting;
                }
                if (vm.meetings) {
                    vm.meetings.push(meeting);
                }
            }
        );
    }

    function giveLeaderPerception(conversation) {
        var modalInstance = $modal.open({
            animation: true,
            backdrop: 'static',
            templateUrl: '/static/angular/devzones/partials/_modals/leader-assessment.html',
            controller: 'LeaderAssessmentController as leaderAssessment',
            resolve: {
                compactView: function () {
                    return true
                },
                conversation: function () {
                    return conversation
                },}
        });
        modalInstance.result.then(
            function (response) {
                conversation = response;
            }
        );
    }
}