angular
    .module('leadership-style')
    .controller('LeadershipStyleController', LeadershipStyleController);

function LeadershipStyleController(LeadershipStyleService, LeadershipStyleRequestService, LeadershipStyleTeamService, analytics, $location, $modal, $rootScope, $routeParams, $scope, $timeout) {
    /* Since this page can be the root for some users let's make sure we capture the correct page */
    var location_url = $location.url().indexOf('/leadership_style') < 0 ? '/' : $location.url();
    analytics.trackPage($scope, $location.absUrl(), location_url);
    var vm = this;
    vm.busy = true;
    vm.page = 0;
    vm.showEmptyScreen = false;
    vm.myLeadershipStyle = null;
    vm.showTakeQuizNotification = false;
    vm.scores = [];
    vm.tease = null;
    vm.teases = [];
    vm.invite = invite;
    vm.gotoPage = gotoPage;
    vm.setTease = setTease;
    vm.takeQuiz = takeQuiz;
    vm.requestLeadershipStyle = requestLeadershipStyle;
    vm.requestTeamReport = requestTeamReport;

    $rootScope.successRequestMessage = false;
    $rootScope.hideMessage = false;
    $rootScope.hideRequestMessage = false;
    activate();

    function gotoPage(page) {
        vm.page = page;
    }
    function orderByFullName(a,b){
        var aValue = a.full_name;
        var bValue = b.full_name;
        return ((aValue < bValue) ? -1 : ((aValue > bValue) ? 1 : 0));
    }
    function orderByVisionary(a,b){
        var noDataValue=0;
        var aValue = (!a.leadership_style) ? noDataValue : a.leadership_style.v;
        var bValue = (!b.leadership_style) ? noDataValue : b.leadership_style.v;
        return bValue - aValue;
    }
    function orderByOperator(a,b){
        var noDataValue=0;
        var aValue = (!a.leadership_style) ? noDataValue : a.leadership_style.o;
        var bValue = (!b.leadership_style) ? noDataValue : b.leadership_style.o;
        return bValue - aValue;
    }
    function orderByProcessor(a,b){
        var noDataValue=0;
        var aValue = (!a.leadership_style) ? noDataValue : a.leadership_style.p;
        var bValue = (!b.leadership_style) ? noDataValue : b.leadership_style.p;
        return bValue - aValue;
    }
    function orderBySynergist(a,b){
        var noDataValue=0;
        var aValue = (!a.leadership_style) ? noDataValue : a.leadership_style.s;
        var bValue = (!b.leadership_style) ? noDataValue : b.leadership_style.s;
        return bValue - aValue;
    }

    function activate() {
        if ($routeParams.requestId) {
            respondToRequest();
        } else {
            getMyLeadershipStyle();
            getTeamsIOwn();
            getTeases();
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

    function getTeases() {
        LeadershipStyleService.getTeases()
            .then(function(request){
                vm.teases = request;
            })
    }

    function setTease(style_id){
        angular.forEach(vm.teases, function (tease) {
            if (tease.style == style_id) {
                vm.tease = tease;
            }
        })
    }

    function updateTeamChart(team) {
        team.chartLabels = ['Visionary', 'Operator', 'Processor', 'Synergist'];
        team.chartData = [team.visionary_average, team.operator_average, team.processor_average, team.synergist_average]
        team.chartOptions = {
            responsiveAnimationDuration: 400,
            tooltips: {
                enabled: false,
            },
            hover: {
                onHover: function (events) {
                    if (events.length > 0 &&  events[0]._chart) {
                        team.animate_show_style = events[0]._index;
                    } else {
                        team.animate_show_style = null;
                    }
                }
            },
            animation: {
                onProgress: function (animation) {
                    var ctx = animation.chartInstance.chart.ctx;
                    var canvasWidthvar = animation.chartInstance.chart.width;
                    var canvasHeight = animation.chartInstance.chart.height;
                    var constant = 100;
                    var fontsize = (canvasHeight / constant).toFixed(2);
                    ctx.font = fontsize + "em Oswald, Helvetica";
                    ctx.fillStyle = "#aaa;";
                    ctx.textBaseline = "middle";
                    var increment, textLabel, textValue;
                    if (team.animate_show_style != null) {
                        switch (team.animate_show_style) {
                            case 0:
                                increment = team.visionary_average / animation.animationObject.numSteps;
                                textValue = Math.round((animation.animationObject.currentStep * increment));
                                textLabel = "Visionary";
                                break;
                            case 1:
                                increment = team.operator_average / animation.animationObject.numSteps;
                                textValue = Math.round((animation.animationObject.currentStep * increment));
                                textLabel = "Operator";
                                break;
                            case 2:
                                increment = team.processor_average / animation.animationObject.numSteps;
                                textValue = Math.round((animation.animationObject.currentStep * increment));
                                textLabel = "Processor";
                                break;
                            case 3:
                                increment = team.synergist_average / animation.animationObject.numSteps;
                                textValue = Math.round((animation.animationObject.currentStep * increment));
                                textLabel = "Synergist";
                                break;
                        }
                    } else {
                        increment = team.percentage_complete / animation.animationObject.numSteps;
                        textValue = Math.round((animation.animationObject.currentStep * increment)) + "%";
                        textLabel = "Quiz Completion";
                    }
                    var textWidth = ctx.measureText(textValue).width;
                    var txtPosx = Math.round((canvasWidthvar - textWidth) / 2);
                    ctx.fillText(textValue, txtPosx, (canvasHeight / 2.15));
                    ctx.font = fontsize / 3 + "em Helvetica";
                    ctx.fillStyle = "#aaa;";
                    ctx.textBaseline = "middle";
                    textWidth = ctx.measureText(textLabel).width;
                    txtPosx = Math.round((canvasWidthvar - textWidth) / 2);
                    ctx.fillText(textLabel, txtPosx, (canvasHeight / 3.5) * 2);
                }
            }
      };
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

    function chartClick(points, evt, team){
         switch (points[0]._index) {
             case 0:
                 sortTeamMembers(team, orderByVisionary);
                 break;
             case 1:
                 sortTeamMembers(team, orderByOperator);
                 break;
             case 2:
                 sortTeamMembers(team, orderByProcessor);
                 break;
             case 3:
                 sortTeamMembers(team, orderBySynergist);
                 break;
         }
         setTease(points[0]._index);
    }

    function sortTeamMembers(team, order) {
        team.team_members_sort.sort(order);

        var i = 0;
        angular.forEach(team.team_members_sort, function (team_member) {
            team.team_members[team_member.index].index = i;
            i = i + 1;
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
                } else {
                     angular.forEach(leadershipStyle.teams, function (team) {
                         updateTeamChart(team);
                         indexTeamMembers(team);
                         team.chartClick = function (points, evt){
                             chartClick(points, evt, team);
                         };
                     })
                }
                vm.busy = false;
            }, function(){
                vm.busy = false;
            }
        )
    }

    function indexTeamMembers(team) {
         var i = 0;
         angular.forEach(team.team_members, function (team_member) {
            team_member.index = i;
            i = i + 1;
         });
        team.team_members_sort = angular.copy(team.team_members);
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
                    if (team.id == value.id) {
                        addNew = false;
                        value.team_members = angular.copy(team.team_members);
                        indexTeamMembers(value);
                        sortTeamMembers(value, orderByFullName);
                    }
                });


                if (addNew) {
                    vm.myLeadershipStyle.teams.push(team);
                }

            }
        );
    }

    function requestTeamReport(team_id, index) {
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
