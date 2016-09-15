angular
    .module('leadership-style')
    .controller('LeadershipStyleController', LeadershipStyleController);

function LeadershipStyleController(LeadershipStyleService, LeadershipStyleRequestService, LeadershipStyleTeamService, analytics, $location, $modal, $rootScope, $routeParams, $scope, $timeout) {
    /* Since this page can be the root for some users let's make sure we capture the correct page */
    var location_url = $location.url().indexOf('/leadership_style') < 0 ? '/id' : $location.url();
    analytics.trackPage($scope, $location.absUrl(), location_url);

    var vm = this;
    vm.busy = true;
    vm.showEmptyScreen = false;
    vm.myLeadershipStyle = null;
    vm.showTakeQuizNotification = false;
    vm.scores = [];
    vm.teamsIOwn = [];
    vm.invite = invite;
    vm.takeQuiz = takeQuiz;
    vm.requestLeadershipStyle = requestLeadershipStyle;
    $rootScope.successRequestMessage = false;
    $rootScope.hideMessage = false;
    $rootScope.hideRequestMessage = false;
    activate();

    function activate() {
        if ($routeParams.requestId) {
            respondToRequest();
        } else {
            getMyLeadershipStyle();
            getTeamsIOwn();
        }
    };

    function getTeamsIOwn() {
        LeadershipStyleTeamService.getTeamsIOwn()
            .then(function(teams){
                vm.teamsIOwn = teams;
                vm.busy = false;
            }, function(){
                vm.busy = false;
            })
    }

    function respondToRequest() {
        vm.busy = true;
        LeadershipStyleRequestService.getRequest($routeParams.requestId)
            .then(function(request){
                if (request.submission_id) {
                    LeadershipStyleService.getLeadershipStyle(request.submission_id)
                        .then(function(response){
                            takeQuiz(response)
                        }
                    )
                } else {
                    LeadershipStyleService.createLeadershipStyle(request)
                        .then(function(response){
                            takeQuiz(response)
                        }
                    )
                }
                vm.busy = false;
            }, function(){
                vm.busy = false;
            })
    }

    function getMyLeadershipStyle() {
        vm.busy = true;
        LeadershipStyleService.getMyLeadershipStyle()
            .then(function(leadershipStyle){
                vm.myLeadershipStyle = leadershipStyle;
                if ($routeParams.takeQuiz && $routeParams.takeQuiz=='true') {
                    takeQuiz(leadershipStyle);
                } else if (!leadershipStyle.completed) {
                    takeQuiz(leadershipStyle);
                }
                vm.busy = false;
            }, function(){
                vm.busy = false;
            }
        )
    }

    function takeQuiz(leadershipStyle) {
        var modalInstance = $modal.open({
            animation: true,
            windowClass: 'xx-dialog fade zoom',
            backdrop: 'static',
            templateUrl: '/static/angular/leadership-style/partials/_modals/quiz.html',
            controller: 'QuizController as quiz',
            resolve: {
                    leadershipStyle: function () {
                        return leadershipStyle
                    }
            }
        });
        modalInstance.result.then(
            function (leadershipStyle) {
                if (leadershipStyle.employee.id == leadershipStyle.assessor.id) {
                    vm.myLeadershipStyle = leadershipStyle;
                    if (!vm.myLeadershipStyle.completed) {
                        vm.showTakeQuizNotification = true
                    }
                }
            }
        );
    };

    function getMyRecentlySentRequests() {
        LeadershipStyleRequestService.getMyRecentlySentRequests()
            .then(function (data) {
                vm.myRecentlySentRequests = data;
                return vm.myRecentlySentRequests;
            });
    }

    function requestLeadershipStyle(panel) {
            var modalInstance = $modal.open({
                animation: true,
                windowClass: 'xx-dialog fade zoom',
                backdrop: 'static',
                templateUrl: '/static/angular/leadership-style/partials/_modals/request-leadership-style.html',
                controller: 'LeadershipStyleRequestController as request',
                resolve: {
                    panel: function () {
                        return panel
                    }
                }
            });
            modalInstance.result.then(
                function (sentLeadershipStyleRequests) {
                    getMyRecentlySentRequests();
                }
            );
        }

        function invite() {
            var modalInstance = $modal.open({
                animation: true,
                windowClass: 'xx-dialog fade zoom',
                backdrop: 'static',
                templateUrl: '/static/angular/leadership-style/partials/_modals/invite.html',
                controller: 'InviteController as invite',
                resolve: {
                    team: function () {
                        return null
                    }
                }
            });
            modalInstance.result.then(
                function (team) {
                    vm.teamsIOwn.push(team);
                }
            );
        }

        function invite360() {
            var modalInstance = $modal.open({
                animation: true,
                windowClass: 'xx-dialog fade zoom',
                backdrop: 'static',
                templateUrl: '/static/angular/leadership-style/partials/_modals/invite-360.html',
                controller: 'Invite360Controller as invite360',
                resolve: {
                    panel: function () {
                        return null
                    }
                }
            });
            modalInstance.result.then(
                function (sentLeadershipStyleRequests) {
                    getMyRecentlySentRequests();
                }
            );
        }
}
