angular
    .module('leadership-style')
    .controller('LeadershipStyleController', LeadershipStyleController);

function LeadershipStyleController(LeadershipStyleService, LeadershipStyleRequestService, LeadershipStyleTeamService, analytics, $location, $modal, $rootScope, $routeParams, $scope, $timeout) {
    /* Since this page can be the root for some users let's make sure we capture the correct page */
    var location_url = $location.url().indexOf('/leadership_style') < 0 ? '/' : $location.url();
    analytics.trackPage($scope, $location.absUrl(), location_url);

    var vm = this;
    vm.busy = true;
    vm.showEmptyScreen = false;
    vm.myLeadershipStyle = null;
    vm.showTakeQuizNotification = false;
    vm.scores = [];
    vm.invite = invite;
    vm.takeQuiz = takeQuiz;
    vm.requestLeadershipStyle = requestLeadershipStyle;
    vm.requestTeamReport = requestTeamReport;
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

        $scope.status = {
            isopen: false
        };

        $scope.toggled = function(open) {
            $log.log('Dropdown is now: ', open);
        };

        $scope.toggleDropdown = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.status.isopen = !$scope.status.isopen;
            vm.status.isopen = !vm.status.isopen;
        };
    };

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
                if (!leadershipStyle.completed) {
                    vm.showTakeQuizNotification = true;
                    takeQuiz(leadershipStyle);
                }
                vm.busy = false;
            }, function(){
                vm.busy = false;
            }
        )
    }

    function getTeamsIOwn() {
        LeadershipStyleTeamService.getTeamsIOwn()
            .then(function(teams){
                vm.teamsIOwn = teams;
                if ($routeParams.team_id && $routeParams.addMembers=='true') {
                    angular.forEach(vm.teamsIOwn, function (value) {
                        if (value.id == $routeParams.team_id && value.team_members.length <= 1) {
                            invite($routeParams.team_id, value.remaining_invites, value.team_members.length);
                        }
                    });
                }
                vm.busy = false;
            }, function(){
                vm.busy = false;
            })
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
                    } else {
                        vm.showTakeQuizNotification = false;
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

    function invite(team_id, remaining_invites, team_member_count) {
        var modalInstance = $modal.open({
            animation: true,
            windowClass: 'xx-dialog fade zoom',
            backdrop: 'static',
            templateUrl: '/static/angular/leadership-style/partials/_modals/invite.html',
            controller: 'InviteController as invite',
            resolve: {
                team_id: function() {
                    return team_id
                },
                remaining_invites: function() {
                    return remaining_invites
                },
                team_member_count : function() {
                    return team_member_count
                }

            }
        });
        modalInstance.result.then(
            function (team) {
                var addNew = true;
                angular.forEach(vm.myLeadershipStyle.teams, function(value) {
                    if (value.id == value.id) {
                        addNew = false;
                        value.team_members = team.team_members;
                    }
                });
                if (addNew) {
                    vm.myLeadershipStyle.teams.push(team);
                }
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

    function requestTeamReport(team_id, index) {
        console.log(index);
        var modalInstance = $modal.open({
            animation: true,
            windowClass: 'xx-dialog fade zoom',
            backdrop: 'static',
            templateUrl: '/static/angular/leadership-style/partials/_modals/request-team-report.html',
            controller: 'RequestTeamReportController as reportRequest',
            resolve: {
                team_id: function () {
                    return team_id
                }
            }
        });
        modalInstance.result.then(
            function (response) {
                vm.myLeadershipStyle.teams[index] = response;
            }
        );
    }
}

/*
// angular.module('leadership-style', ['ui.bootstrap']);
angular.module('leadership-style', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);

angular.module('leadership-style').controller('DropdownCtrl', function ($scope, $log) {
  $scope.items = [
    'The first choice!',
    'And another choice for you.',
    'but wait! A third!'
  ];

  $scope.status = {
    isopen: false
  };

  $scope.toggled = function(open) {
    $log.log('Dropdown is now: ', open);
  };

  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };

  $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
});
*/
