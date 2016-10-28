angular
    .module('leadership-style')
    .controller('LeadershipStyleController', LeadershipStyleController);

function LeadershipStyleController(LeadershipStyleService, LeadershipStyleRequestService, LeadershipStyleTeamService, analytics, $location, $modal, $rootScope, $routeParams, $scope, $timeout, $window) {
    var vm = this;
    vm.busy = true;
    vm.page = $routeParams.page ? $routeParams.page : 0;
    vm.showEmptyScreen = false;
    vm.myLeadershipStyle = null;
    vm.showTakeQuizNotification = false;
    vm.scores = [];
    vm.tease = null;
    vm.teases = [];
    vm.currentOrder = null;
    vm.discard = discard;
    vm.invite = invite;
    vm.gotoPage = gotoPage;
    vm.orderByVisionary = orderByVisionary
    vm.orderByOperator = orderByOperator;
    vm.orderByProcessor = orderByProcessor;
    vm.orderBySynergist = orderBySynergist;
    vm.requestLeadershipStyle = requestLeadershipStyle;
    vm.requestTeamReport = requestTeamReport;
    vm.remind = remind;
    vm.showOrderPageDown = showOrderPageDown;
    vm.showTease = showTease;
    vm.setTease = setTease;
    vm.sortTeamMembers = sortTeamMembers;
    vm.takeQuiz = takeQuiz;

    activate();

    function gotoPage(page) {
        $location.search('page', page)
    }

    function orderByFullName(a,b){
        vm.currentOrder = null;
        var aValue = a.full_name;
        var bValue = b.full_name;
        return ((aValue < bValue) ? -1 : ((aValue > bValue) ? 1 : 0));
    }
    function orderByVisionary(a,b){
        vm.currentOrder = 0;
        var noDataValue=0;
        var aValue = (!a.leadership_style) ? noDataValue : a.leadership_style.v;
        var bValue = (!b.leadership_style) ? noDataValue : b.leadership_style.v;
        return bValue - aValue;
    }
    function orderByOperator(a,b){
        vm.currentOrder = 1;
        var noDataValue=0;
        var aValue = (!a.leadership_style) ? noDataValue : a.leadership_style.o;
        var bValue = (!b.leadership_style) ? noDataValue : b.leadership_style.o;
        return bValue - aValue;
    }
    function orderByProcessor(a,b){
        vm.currentOrder = 2;
        var noDataValue=0;
        var aValue = (!a.leadership_style) ? noDataValue : a.leadership_style.p;
        var bValue = (!b.leadership_style) ? noDataValue : b.leadership_style.p;
        return bValue - aValue;
    }
    function orderBySynergist(a,b){
        vm.currentOrder = 3;
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
        team.chartColors = ['#d65335', '#51a9b7', '#f7ca18', '#69b63b'];
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
                    ctx.fillStyle = "#aaaaaa";
                    ctx.textBaseline = "middle";
                    var increment, textLabel, textValue, textWidth, txtPosx;
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
                        textWidth = ctx.measureText(textValue).width;
                        txtPosx = Math.round((canvasWidthvar - textWidth) / 2);
                        ctx.fillText(textValue, txtPosx, (canvasHeight / 2.15));
                        ctx.font = fontsize / 3 + "em Helvetica";
                        ctx.fillStyle = "#aaaaaa";
                        ctx.textBaseline = "middle";
                        textWidth = ctx.measureText(textLabel).width;
                        txtPosx = Math.round((canvasWidthvar - textWidth) / 2);
                        ctx.fillText(textLabel, txtPosx, (canvasHeight / 3.5) * 2);
                    } else {
                        ctx.font = fontsize / 2 + "em Oswald, Helvetica";
                        textValue = team.description.name.split(" - ")[0];
                        textWidth = ctx.measureText(textValue).width;
                        var label;
                        txtPosx = Math.round((canvasWidthvar - textWidth) / 2);
                        if (team.description.name.split(" - ").length == 1) {
                            ctx.fillText(textValue, txtPosx, (canvasHeight / 2));
                        } else {
                            ctx.fillText(textValue, txtPosx, (canvasHeight / 2.15));
                            label = team.description.name.split(" - ")[1];
                        }

                        if (label) {
                            ctx.font = fontsize / 3 + "em Helvetica";
                            ctx.fillStyle = "#aaaaaa";
                            ctx.textBaseline = "middle";
                            textValue = label.split(" and ")[0];
                            textWidth = ctx.measureText(textValue).width;
                            txtPosx = Math.round((canvasWidthvar - textWidth) / 2);
                            ctx.fillText(textValue, txtPosx, (canvasHeight / 3.75) * 2);
                            if (label.split(" and ").length > 1) {
                                ctx.font = fontsize / 3 + "em Helvetica";
                                ctx.fillStyle = "#aaaaaa";
                                ctx.textBaseline = "middle";
                                textValue = " & " + label.split(" and ")[1];
                                textWidth = ctx.measureText(textValue).width;
                                txtPosx = Math.round((canvasWidthvar - textWidth) / 2);
                                ctx.fillText(textValue, txtPosx, (canvasHeight / 3.4) * 2);
                            }
                        }
                    }
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
    }

    function sortTeamMembers(team, order) {
        team.team_members_sort.sort(order);
        setTease(vm.currentOrder);
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
                if (!leadershipStyle.completed) {
                    vm.showTakeQuizNotification = true;
                }
                if (leadershipStyle.employee.id == leadershipStyle.assessor.id) {
                    vm.myLeadershipStyle = leadershipStyle;
                    if (!vm.myLeadershipStyle.completed) {
                        vm.showTakeQuizNotification = true
                    } else {
                        gotoPage(vm.myLeadershipStyle.employee.id);
                        vm.showTakeQuizNotification = false;
                        angular.forEach(leadershipStyle.teams, function (team) {
                             updateTeamChart(team);
                             indexTeamMembers(team);
                             team.chartClick = function (points, evt){
                                 chartClick(points, evt, team);
                             };
                         })
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

    function discard(employee, team_id) {
        vm.gotoPage(0);
        var modalInstance = $modal.open({
            animation: true,
            windowClass: 'xx-dialog fade zoom',
            backdrop: 'static',
            templateUrl: '/static/angular/leadership-style/partials/_modals/discard-invite.html',
            controller: 'DiscardInviteController as discard',
            resolve: {
                employee: function () {
                    return employee
                },
                team_id: function() {
                    return team_id
                },
            }
        });
        modalInstance.result.then(
            function (team) {
                updateTeam(team);
            }
        );
    }

    function remind(quiz) {
        var modalInstance = $modal.open({
            animation: true,
            windowClass: 'xx-dialog fade zoom',
            backdrop: 'static',
            templateUrl: '/static/angular/leadership-style/partials/_modals/quiz-reminder.html',
            controller: 'SendQuizReminderController as remind',
            resolve: {
                quiz: function () {
                    return quiz
                }
            }
        });
        modalInstance.result.then(
            function (value) {
                quiz.last_reminder_sent = value.last_reminder_sent;
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
                updateTeam(team);
            }
        );
    }

    function updateTeam(team) {
        angular.forEach(vm.myLeadershipStyle.teams, function(value) {
            if (team.id == value.id) {
                value.requested_report = team.requested_report;
                value.requested_date = team.requested_date;
                value.team_members = angular.copy(team.team_members);
                value.remaining_invites = team.remaining_invites;
                value.percentage_complete = team.percentage_complete;
                updateTeamChart(value);
                indexTeamMembers(value);
                sortTeamMembers(value, orderByFullName);
            }
        });
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
            function (team) {
                updateTeam(team);
            }
        );
    }

    function showOrderPageDown() {
        var modalInstance = $modal.open({
            animation: true,
            windowClass: 'xx-dialog fade zoom',
            backdrop: 'static',
            templateUrl: '/static/angular/leadership-style/partials/_modals/order-page-down.html',
            controller: 'OrderPageDownController as orderPageDown',
            resolve: {}
        });
    }

    function showTease(tease) {
        var modalInstance = $modal.open({
            animation: true,
            windowClass: 'xx-dialog fade zoom',
            backdrop: 'static',
            templateUrl: '/static/angular/leadership-style/partials/_modals/leadership-style-tease.html',
            controller: 'TeaseController as tease',
            resolve: {
                tease: function() {
                    return tease;
                }
            }
        });
    }

    $scope.$on('$routeUpdate', function(event, next, current) {
        vm.page = $routeParams.page ? $routeParams.page : 0;
        analytics.setPage($location.url());
        analytics.trackPage();
    });
}
