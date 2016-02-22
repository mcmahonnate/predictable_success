angular
    .module('devzones')
    .controller('MeetingController', MeetingController);

function MeetingController(MeetingService, Notification, analytics, $location, $scope, $routeParams) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());

    var vm = this;
    activate();

    function activate() {
        getMeeting();
    };

    function getMeeting() {
        MeetingService.get($routeParams.meetingId)
            .then(function(meeting){
                    vm.meeting = meeting;
            }, function(error){
                    Notification.error("Sorry we had a problem opening this meeting.");
                }
            );
    };
}