;(function() {
"use strict";

QuizController.$inject = ["analytics", "LeadershipStyleService", "Notification", "leadershipStyle", "$location", "$modal", "$modalInstance", "$rootScope", "$scope"];
LeadershipStyleService.$inject = ["$http", "$log", "LeadershipStyleResource"];
LeadershipStyleResource.$inject = ["$resource"];
LeadershipStyleController.$inject = ["LeadershipStyleService", "Notification", "UserPreferencesService", "analytics", "$location", "$modal", "$rootScope", "$scope", "$timeout"];
angular
    .module('leadership-style', ['ngRoute', 'ui-notification']);

angular
    .module('leadership-style')
    .controller('QuizController', QuizController);

function QuizController(analytics, LeadershipStyleService, Notification, leadershipStyle, $location, $modal, $modalInstance, $rootScope, $scope) {
    var location_url = '/quiz/' + leadershipStyle.id;
    analytics.trackPage($scope, $location.absUrl(), location_url);
    var vm = this;

    vm.leadershipStyle = leadershipStyle;
    vm.panel_index = 0;
    vm.busy = false;
    vm.cancel = cancel;
    vm.close = close;
    vm.answerQuestion = answerQuestion;
    vm.previousQuestion = previousQuestion;
    vm.startOver = startOver;
    vm.showWhoCanSeeThis = showWhoCanSeeThis;
    vm.finish = finish;
    vm.employee = $rootScope.currentUser.employee;
    vm.selectedAnswer = null;
    vm.scores = [];

    activate()

    function activate() {
        if (leadershipStyle.next_question) {
            vm.selectedAnswer = leadershipStyle.next_question.answer;
        }
        isComplete();
    }

    function isComplete() {
        if (vm.leadershipStyle.completed || !vm.leadershipStyle.next_question) {
            if (!vm.leadershipStyle.completed) {
                vm.leadershipStyle.assessor = vm.leadershipStyle.assessor.id;
                vm.leadershipStyle.completed = true;
                LeadershipStyleService.updateLeadershipStyle(vm.leadershipStyle)
                            .then(function(result){
                                vm.leadershipStyle = result;
                                vm.busy = false;
                            }
                        );
            }
            vm.scores.push({'style' : 'Visionary', 'score': vm.leadershipStyle.visionary_score});
            vm.scores.push({'style' : 'Operator', 'score': vm.leadershipStyle.operator_score});
            vm.scores.push({'style' : 'Processor', 'score': vm.leadershipStyle.processor_score});
            vm.scores.push({'style' : 'Synergist', 'score': vm.leadershipStyle.synergist_score});
        }
    }

    function cancel() {
        $modalInstance.dismiss();
    }

    function close() {
        $modalInstance.close(vm.leadershipStyle)
        if (!vm.leadershipStyle.completed) {
            Notification.success('Your progress has been saved.')
        }
    }

    function answerQuestion(answer) {
        vm.busy = true;
        vm.leadershipStyle.last_question_answered = vm.leadershipStyle.next_question.id;
        if (vm.leadershipStyle.next_question.answer) {
            if (vm.leadershipStyle.next_question.answer.id != answer.id) {
                var answers = [answer.id];
                angular.forEach(vm.leadershipStyle.answers, function (value) {
                    if (vm.leadershipStyle.next_question.answer.id != value) {
                        answers.push(value);
                    }
                })
                vm.leadershipStyle.answers = answers;
            }
        } else {
            vm.leadershipStyle.answers.push(answer.id);
        }
        vm.leadershipStyle.assessor = vm.leadershipStyle.assessor.id;
        LeadershipStyleService.updateLeadershipStyle(vm.leadershipStyle)
            .then(function(result){
                vm.leadershipStyle = result;
                isComplete();
                if (vm.leadershipStyle.next_question) {
                    vm.selectedAnswer = vm.leadershipStyle.next_question.answer;
                } else {
                    vm.selectedAnswer = null;
                }
                vm.busy = false;
            }
        );
    }

    function previousQuestion(){
        vm.busy = true;
        LeadershipStyleService.goToPreviousQuestion(vm.leadershipStyle)
            .then(function(result){
                vm.leadershipStyle = result;
                if (vm.leadershipStyle.next_question) {
                    vm.selectedAnswer = vm.leadershipStyle.next_question.answer;
                } else {
                    vm.selectedAnswer = null;
                }
                vm.busy = false;
            }
        );
    }

    function startOver() {
        vm.busy = true;
        LeadershipStyleService.retakeLeadershipStyle(vm.leadershipStyle)
            .then(function(result){
                vm.panel_index=0;
                vm.selectedAnswer=null;
                vm.leadershipStyle = result;
                vm.busy = false;
            }
        );
    }

    function finish() {
        vm.busy = true;
        LeadershipStyleService.updateEmployeeZone({id: vm.leadershipStyle.id, zone: vm.leadershipStyle.zone.id, notes: vm.leadershipStyle.notes, completed: true})
            .then(function(result){
                vm.leadershipStyle = result;
                Notification.success('Your quiz results has been shared.')
                $modalInstance.close(result);
                if (leadershipStyle.id) {
                    $location.path('/id/' + result.id);
                }
                vm.busy = false;
            }
        );
    }

    function showWhoCanSeeThis(employee_id, employee_view) {
        $modal.open({
            animation: true,
            backdrop: 'static',
            templateUrl: '/static/angular/partials/_modals/who-can-see-this.html',
            controller: 'SupportTeamCtrl',
            resolve: {
                employee_view: function () {
                    return employee_view
                },
                employee_id: function () {
                    return employee_id
                }
            }
        });
    }
}


angular
    .module('leadership-style')
    .factory('LeadershipStyleService', LeadershipStyleService);

function LeadershipStyleService($http, $log, LeadershipStyleResource) {
    return {
        createLeadershipStyle: createLeadershipStyle,
        getLeadershipStyle: getLeadershipStyle,
        getMyLeadershipStyle: getMyLeadershipStyle,
        getMyUnfinishedLeadershipStyle: getMyUnfinishedLeadershipStyle,
        retakeLeadershipStyle: retakeLeadershipStyle,
        shareLeadershipStyle: shareLeadershipStyle,
        updateLeadershipStyle: updateLeadershipStyle,
        goToPreviousQuestion: goToPreviousQuestion
    };

    function createLeadershipStyle(leadershipStyle) {
        return LeadershipStyleResource.create(leadershipStyle, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('createLeadershipStyle failed');
        }
    }

    function getLeadershipStyle(leadershipStyleId) {
        return LeadershipStyleResource.get({id: leadershipStyleId}, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getLeadershipStyle failed');
        }
    }

    function getMyLeadershipStyle() {
        return LeadershipStyleResource.getMy({id: 'my'}, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getMyLeadershipStyle failed');
        }
    }

    function getMyUnfinishedLeadershipStyle() {
        return LeadershipStyleResource.getUnfinished(null, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getUnfinished failed');
        }
    }

    function retakeLeadershipStyle(leadershipStyle) {
        return LeadershipStyleResource.retake({id: leadershipStyle.id}, leadershipStyle, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('retakeLeadershipStyle failed');
        }
    }

    function shareLeadershipStyle(leadershipStyle) {
        return LeadershipStyleResource.share({id: leadershipStyle.id}, leadershipStyle, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('shareLeadershipStyle failed');
        }
    }

    function updateLeadershipStyle(leadershipStyle) {
        return LeadershipStyleResource.update({id: leadershipStyle.id}, leadershipStyle, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('updateLeadershipStyle failed');
        }
    }

    function goToPreviousQuestion(leadershipStyle) {
        return LeadershipStyleResource.goToPreviousQuestion({id: leadershipStyle.id}, null, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('goToPreviousQuestion failed');
        }
    }
}
angular
    .module('leadership-style')
    .factory('LeadershipStyleResource', LeadershipStyleResource);

function LeadershipStyleResource($resource) {
    var actions = {
        'create': {
            method: 'POST',
            url: '/api/v1/leadership-style/create/'
        },
        'get': {
            method: 'GET',
            url: '/api/v1/leadership-style/:id/'
        },
        'getMy': {
            method: 'GET',
            url: '/api/v1/leadership-style/:id/'
        },
        'getUnfinished': {
            method: 'GET',
            url: '/api/v1/leadership-style/unfinished/'
        },
        'retake': {
            method: 'PUT',
            url: '/api/v1/leadership-style/:id/retake/'
        },
        'share': {
            method: 'PUT',
            url: '/api/v1/leadership-style/:id/share/'
        },
        'update': {
            method: 'PUT',
            url: '/api/v1/leadership-style/:id/update/'
        },
        'goToPreviousQuestion': {
            method: 'PUT',
            url: '/api/v1/leadership-style/:id/previous-question/'
        }
    };
    return $resource('/api/v1/leadership-style/:id/', null, actions);
}

angular
    .module('leadership-style')
    .controller('LeadershipStyleController', LeadershipStyleController);

function LeadershipStyleController(LeadershipStyleService, Notification, UserPreferencesService, analytics, $location, $modal, $rootScope, $scope, $timeout) {
    /* Since this page can be the root for some users let's make sure we capture the correct page */
    var location_url = $location.url().indexOf('/id') < 0 ? '/id' : $location.url();
    analytics.trackPage($scope, $location.absUrl(), location_url);

    var vm = this;
    vm.busy = true;
    vm.showEmptyScreen = false;
    vm.myLeadershipStyle = null;
    vm.takeQuiz = takeQuiz;
    activate();

    function activate() {
        getMyLeadershipStyle();

    };

    function getMyLeadershipStyle() {
        vm.busy = true;
        LeadershipStyleService.getMyLeadershipStyle()
            .then(function(leadershipStyle){
                vm.myLeadershipStyle = leadershipStyle;
                vm.busy = false;
            }, function(){
                vm.busy = false;
            }
        )
    }

    function takeQuiz() {
        var modalInstance = $modal.open({
            animation: true,
            windowClass: 'xx-dialog fade zoom',
            backdrop: 'static',
            templateUrl: '/static/angular/leadership-style/partials/_modals/quiz.html',
            controller: 'QuizController as quiz',
            resolve: {
                    leadershipStyle: function () {
                        return vm.myLeadershipStyle
                    }
            }
        });
        modalInstance.result.then(
            function (leadershipStyle) {
                vm.myLeadershipStyle = leadershipStyle;
            }
        );
    };
}
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxlYWRlcnNoaXAtc3R5bGUubW9kdWxlLmpzIiwicXVpei5jb250cm9sbGVyLmpzIiwibGVhZGVyc2hpcC1zdHlsZS5zZXJ2aWNlLmpzIiwibGVhZGVyc2hpcC1zdHlsZS5yZXNvdXJjZS5qcyIsImxlYWRlcnNoaXAtc3R5bGUuY29udHJvbGxlci5qcyIsImxlYWRlcnNoaXAtc3R5bGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxDQUFBLFdBQUE7QUFDQTs7Ozs7O0FDREE7S0FDQSxPQUFBLG9CQUFBLENBQUEsV0FBQTs7QUFFQTtLQUNBLE9BQUE7S0FDQSxXQUFBLGtCQUFBOztBQUVBLFNBQUEsZUFBQSxXQUFBLHdCQUFBLGNBQUEsaUJBQUEsV0FBQSxRQUFBLGdCQUFBLFlBQUEsUUFBQTtJQUNBLElBQUEsZUFBQSxXQUFBLGdCQUFBO0lBQ0EsVUFBQSxVQUFBLFFBQUEsVUFBQSxVQUFBO0lBQ0EsSUFBQSxLQUFBOztJQUVBLEdBQUEsa0JBQUE7SUFDQSxHQUFBLGNBQUE7SUFDQSxHQUFBLE9BQUE7SUFDQSxHQUFBLFNBQUE7SUFDQSxHQUFBLFFBQUE7SUFDQSxHQUFBLGlCQUFBO0lBQ0EsR0FBQSxtQkFBQTtJQUNBLEdBQUEsWUFBQTtJQUNBLEdBQUEsb0JBQUE7SUFDQSxHQUFBLFNBQUE7SUFDQSxHQUFBLFdBQUEsV0FBQSxZQUFBO0lBQ0EsR0FBQSxpQkFBQTtJQUNBLEdBQUEsU0FBQTs7SUFFQTs7SUFFQSxTQUFBLFdBQUE7UUFDQSxJQUFBLGdCQUFBLGVBQUE7WUFDQSxHQUFBLGlCQUFBLGdCQUFBLGNBQUE7O1FBRUE7OztJQUdBLFNBQUEsYUFBQTtRQUNBLElBQUEsR0FBQSxnQkFBQSxhQUFBLENBQUEsR0FBQSxnQkFBQSxlQUFBO1lBQ0EsSUFBQSxDQUFBLEdBQUEsZ0JBQUEsV0FBQTtnQkFDQSxHQUFBLGdCQUFBLFdBQUEsR0FBQSxnQkFBQSxTQUFBO2dCQUNBLEdBQUEsZ0JBQUEsWUFBQTtnQkFDQSx1QkFBQSxzQkFB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LHVCQUFBO1FBQ0Esc0JBQUE7UUFDQSx1QkFBQTtRQUNBLHNCQUFBOzs7SUFHQSxTQUFBLHNCQUFBLGlCQUFBO1FBQ0EsT0FBQSx3QkFBQSxPQUFBLGlCQUFBLFNBQUEsTUFBQTs7UUFFQSxTQUFBLFFBQUEsVUFBQTtZQUNBLE9BQUE7OztRQUdBLFNBQUEsS0FBQSxVQUFBO1lBQ0EsS0FBQSxNQUFBOzs7O0lBSUEsU0FBQSxtQkFBQSxtQkFBQTtRQUNBLE9BQUEsd0JBQUEsSUFBQSxDQUFBLElBQUEsb0JBQUEsU0FBQSxNQUFBOztRQUVBLFNBQUEsUUFBQSxVQUFBO1lBQ0EsT0FBQTs7O1FBR0EsU0FBQSxLQUFBLFVBQUE7WUFDQSxLQUFBLE1BQUE7Ozs7SUFJQSxTQUFBLHVCQUFBO1FBQ0EsT0FBQSx3QkFBQSxNQUFBLENBQUEsSUFBQSxPQUFBLFNBQUEsTUFBQTs7UUFFQSxTQUFBLFFBQUEsVUFBQTtZQUNBLE9BQUE7OztRQUdBLFNBQUEsS0FBQSxVQUFBO1lBQ0EsS0FBQSxNQUFBOzs7O0lBSUEsU0FBQSxpQ0FBQTtRQUNBLE9BQUEsd0JBQUEsY0FBQSxNQUFBLFNBQUEsTUFBQTs7UUFFQSxTQUFBLFFBQUEsVUFBQTtZQUNBLE9BQUE7OztRQUdBLFNBQUEsS0FBQSxVQUFBO1lBQ0EsS0FBQSxNQUFBOzs7O0lBSUEsU0FBQSxzQkFBQSxpQkFBQTtRQUNBLE9BQUEsd0JBQUEsT0FBQSxDQUFBLElBQUEsZ0JBQUEsS0FBQSxpQkFBQSxTQUFBLE1BQUE7O1FBRUEsU0FBQSxRQUFBLFVBQUE7WUFDQSxPQUFBOzs7UUFHQSxTQUFBLEtBQUEsVUFBQTtZQUNBLEtBQUEsTUFBQTs7OztJQUlBLFNBQUEscUJBQUEsaUJBQUE7UUFDQSxPQUFBLHdCQUFBLE1BQUEsQ0FBQSxJQUFBLGdCQUFBLEtBQUEsaUJBQUEsU0FBQSxNQUFBOztRQUVBLFNBQUEsUUFBQSxVQUFBO1lBQ0EsT0FBQTs7O1FBR0EsU0FBQSxLQUFBLFVBQUE7WUFDQSxLQUFBLE1BQUE7Ozs7SUFJQSxTQUFBLHNCQUFBLGlCQUFBO1FBQ0EsT0FBQSx3QkFBQSxPQUFBLENBQUEsSUFBQSxnQkFBQSxLQUFBLGlCQUFBLFNBQUEsTUFBQTs7UUFFQSxTQUFBLFFBQUEsVUFBQTtZQUNBLE9BQUE7OztRQUdBLFNBQUEsS0FBQSxVQUFBO1lBQ0EsS0FBQSxNQUFBOzs7O0lBSUEsU0FBQSxxQkFBQSxpQkFBQTtRQUNBLE9BQUEsd0JBQUEscUJBQUEsQ0FBQSxJQUFBLGdCQUFBLEtBQUEsTUFBQSxTQUFBLE1BQUE7O1FBRUEsU0FBQSxRQUFBLFVBQUE7WUFDQSxPQUFBOzs7UUFHQSxTQUFBLEtBQUEsVUFBQTtZQUNBLEtBQUEsTUFBQTs7OztBQzVHQTtLQUNBLE9BQUE7S0FDQSxRQUFBLDJCQUFBOztBQUVBLFNBQUEsd0JBQUEsV0FBQTtJQUNBLElBQUEsVUFBQTtRQUNBLFVBQUE7WUFDQSxRQUFBO1lBQ0EsS0FBQTs7UUFFQSxPQUFBO1lBQ0EsUUFBQTtZQUNBLEtBQUE7O1FBRUEsU0FBQTtZQUNBLFFBQUE7WUFDQSxLQUFBOztRQUVBLGlCQUFBO1lBQ0EsUUFBQTtZQUNBLEtBQUE7O1FBRUEsVUFBQTtZQUNBLFFBQUE7WUFDQSxLQUFBOztRQUVBLFNBQUE7WUFDQSxRQUFBO1lBQ0EsS0FBQTs7UUFFQSxVQUFBO1lBQ0EsUUFBQTtZQUNBLEtBQUE7O1FBRUEsd0JBQUE7WUFDQSxRQUFBO1lBQ0EsS0FBQTs7O0lDdkNBLE9BQUEsVUFBQSxpQ0FBQSxNQUFBOzs7QUFHQTtLQUNBLE9BQUE7S0FDQSxXQUFBLDZCQUFBOztBQUVBLFNBQUEsMEJBQUEsd0JBQUEsY0FBQSx3QkFBQSxXQUFBLFdBQUEsUUFBQSxZQUFBLFFBQUEsVUFBQTs7SUFFQSxJQUFBLGVBQUEsVUFBQSxNQUFBLFFBQUEsU0FBQSxJQUFBLFFBQUEsVUFBQTtJQUNBLFVBQUEsVUFBQSxRQUFBLFVBQUEsVUFBQTs7SUFFQSxJQUFBLEtBQUE7SUFDQSxHQUFBLE9BQUE7SUFDQSxHQUFBLGtCQUFBO0lBQ0EsR0FBQSxvQkFBQTtJQUNBLEdBQUEsV0FBQTtJQUNBOztJQUVBLFNBQUEsV0FBQTtRQUNBOztLQUVBOztJQUVBLFNBQUEsdUJBQUE7UUFDQSxHQUFBLE9BQUE7UUFDQSx1QkFBQTthQUNBLEtBQUEsU0FBQSxnQkFBQTtnQkFDQSxHQUFBLG9CQUFBO2dCQUNBLEdBQUEsT0FBQTtlQUNBLFVBQUE7Z0JBQ0EsR0FBQSxPQUFBOzs7OztJQUtBLFNBQUEsV0FBQTtRQUNBLElBQUEsZ0JBQUEsT0FBQSxLQUFBO1lBQ0EsV0FBQTtZQUNBLGFBQUE7WUFDQSxVQUFBO1lBQ0EsYUFBQTtZQUNBLFlBQUE7WUFDQSxTQUFBO29CQUNBLGlCQUFBLFlBQUE7d0JBQ0EsT0FBQSxHQUFBOzs7O1FBSUEsY0FBQSxPQUFBO1lBQ0EsVUFBQSxpQkFBQTtnQkFDQSxHQUFBLG9CQUFBOzs7S0MwVEs7OztBQUdMIiwiZmlsZSI6ImxlYWRlcnNoaXAtc3R5bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyXG4gICAgLm1vZHVsZSgnbGVhZGVyc2hpcC1zdHlsZScsIFsnbmdSb3V0ZScsICd1aS1ub3RpZmljYXRpb24nXSk7XG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnbGVhZGVyc2hpcC1zdHlsZScpXG4gICAgLmNvbnRyb2xsZXIoJ1F1aXpDb250cm9sbGVyJywgUXVpekNvbnRyb2xsZXIpO1xuXG5mdW5jdGlvbiBRdWl6Q29udHJvbGxlcihhbmFseXRpY3MsIExlYWRlcnNoaXBTdHlsZVNlcnZpY2UsIE5vdGlmaWNhdGlvbiwgbGVhZGVyc2hpcFN0eWxlLCAkbG9jYXRpb24sICRtb2RhbCwgJG1vZGFsSW5zdGFuY2UsICRyb290U2NvcGUsICRzY29wZSkge1xuICAgIHZhciBsb2NhdGlvbl91cmwgPSAnL3F1aXovJyArIGxlYWRlcnNoaXBTdHlsZS5pZDtcbiAgICBhbmFseXRpY3MudHJhY2tQYWdlKCRzY29wZSwgJGxvY2F0aW9uLmFic1VybCgpLCBsb2NhdGlvbl91cmwpO1xuICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICB2bS5sZWFkZXJzaGlwU3R5bGUgPSBsZWFkZXJzaGlwU3R5bGU7XG4gICAgdm0ucGFuZWxfaW5kZXggPSAwO1xuICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICB2bS5jYW5jZWwgPSBjYW5jZWw7XG4gICAgdm0uY2xvc2UgPSBjbG9zZTtcbiAgICB2bS5hbnN3ZXJRdWVzdGlvbiA9IGFuc3dlclF1ZXN0aW9uO1xuICAgIHZtLnByZXZpb3VzUXVlc3Rpb24gPSBwcmV2aW91c1F1ZXN0aW9uO1xuICAgIHZtLnN0YXJ0T3ZlciA9IHN0YXJ0T3ZlcjtcbiAgICB2bS5zaG93V2hvQ2FuU2VlVGhpcyA9IHNob3dXaG9DYW5TZWVUaGlzO1xuICAgIHZtLmZpbmlzaCA9IGZpbmlzaDtcbiAgICB2bS5lbXBsb3llZSA9ICRyb290U2NvcGUuY3VycmVudFVzZXIuZW1wbG95ZWU7XG4gICAgdm0uc2VsZWN0ZWRBbnN3ZXIgPSBudWxsO1xuICAgIHZtLnNjb3JlcyA9IFtdO1xuXG4gICAgYWN0aXZhdGUoKVxuXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgIGlmIChsZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbikge1xuICAgICAgICAgICAgdm0uc2VsZWN0ZWRBbnN3ZXIgPSBsZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbi5hbnN3ZXI7XG4gICAgICAgIH1cbiAgICAgICAgaXNDb21wbGV0ZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQ29tcGxldGUoKSB7XG4gICAgICAgIGlmICh2bS5sZWFkZXJzaGlwU3R5bGUuY29tcGxldGVkIHx8ICF2bS5sZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbikge1xuICAgICAgICAgICAgaWYgKCF2bS5sZWFkZXJzaGlwU3R5bGUuY29tcGxldGVkKSB7XG4gICAgICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlLmFzc2Vzc29yID0gdm0ubGVhZGVyc2hpcFN0eWxlLmFzc2Vzc29yLmlkO1xuICAgICAgICAgICAgICAgIHZtLmxlYWRlcnNoaXBTdHlsZS5jb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIExlYWRlcnNoaXBTdHlsZVNlcnZpY2UudXBkYXRlTGVhZGVyc2hpcFN0eWxlKHZtLmxlYWRlcnNoaXBTdHlsZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5sZWFkZXJzaGlwU3R5bGUgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdm0uc2NvcmVzLnB1c2goeydzdHlsZScgOiAnVmlzaW9uYXJ5JywgJ3Njb3JlJzogdm0ubGVhZGVyc2hpcFN0eWxlLnZpc2lvbmFyeV9zY29yZX0pO1xuICAgICAgICAgICAgdm0uc2NvcmVzLnB1c2goeydzdHlsZScgOiAnT3BlcmF0b3InLCAnc2NvcmUnOiB2bS5sZWFkZXJzaGlwU3R5bGUub3BlcmF0b3Jfc2NvcmV9KTtcbiAgICAgICAgICAgIHZtLnNjb3Jlcy5wdXNoKHsnc3R5bGUnIDogJ1Byb2Nlc3NvcicsICdzY29yZSc6IHZtLmxlYWRlcnNoaXBTdHlsZS5wcm9jZXNzb3Jfc2NvcmV9KTtcbiAgICAgICAgICAgIHZtLnNjb3Jlcy5wdXNoKHsnc3R5bGUnIDogJ1N5bmVyZ2lzdCcsICdzY29yZSc6IHZtLmxlYWRlcnNoaXBTdHlsZS5zeW5lcmdpc3Rfc2NvcmV9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSh2bS5sZWFkZXJzaGlwU3R5bGUpXG4gICAgICAgIGlmICghdm0ubGVhZGVyc2hpcFN0eWxlLmNvbXBsZXRlZCkge1xuICAgICAgICAgICAgTm90aWZpY2F0aW9uLnN1Y2Nlc3MoJ1lvdXIgcHJvZ3Jlc3MgaGFzIGJlZW4gc2F2ZWQuJylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFuc3dlclF1ZXN0aW9uKGFuc3dlcikge1xuICAgICAgICB2bS5idXN5ID0gdHJ1ZTtcbiAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlLmxhc3RfcXVlc3Rpb25fYW5zd2VyZWQgPSB2bS5sZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbi5pZDtcbiAgICAgICAgaWYgKHZtLmxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uLmFuc3dlcikge1xuICAgICAgICAgICAgaWYgKHZtLmxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uLmFuc3dlci5pZCAhPSBhbnN3ZXIuaWQpIHtcbiAgICAgICAgICAgICAgICB2YXIgYW5zd2VycyA9IFthbnN3ZXIuaWRdO1xuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5sZWFkZXJzaGlwU3R5bGUuYW5zd2VycywgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2bS5sZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbi5hbnN3ZXIuaWQgIT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuc3dlcnMucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHZtLmxlYWRlcnNoaXBTdHlsZS5hbnN3ZXJzID0gYW5zd2VycztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZtLmxlYWRlcnNoaXBTdHlsZS5hbnN3ZXJzLnB1c2goYW5zd2VyLmlkKTtcbiAgICAgICAgfVxuICAgICAgICB2bS5sZWFkZXJzaGlwU3R5bGUuYXNzZXNzb3IgPSB2bS5sZWFkZXJzaGlwU3R5bGUuYXNzZXNzb3IuaWQ7XG4gICAgICAgIExlYWRlcnNoaXBTdHlsZVNlcnZpY2UudXBkYXRlTGVhZGVyc2hpcFN0eWxlKHZtLmxlYWRlcnNoaXBTdHlsZSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIGlzQ29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICBpZiAodm0ubGVhZGVyc2hpcFN0eWxlLm5leHRfcXVlc3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRBbnN3ZXIgPSB2bS5sZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbi5hbnN3ZXI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRBbnN3ZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2bS5idXN5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJldmlvdXNRdWVzdGlvbigpe1xuICAgICAgICB2bS5idXN5ID0gdHJ1ZTtcbiAgICAgICAgTGVhZGVyc2hpcFN0eWxlU2VydmljZS5nb1RvUHJldmlvdXNRdWVzdGlvbih2bS5sZWFkZXJzaGlwU3R5bGUpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgICAgIHZtLmxlYWRlcnNoaXBTdHlsZSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICBpZiAodm0ubGVhZGVyc2hpcFN0eWxlLm5leHRfcXVlc3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRBbnN3ZXIgPSB2bS5sZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbi5hbnN3ZXI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRBbnN3ZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2bS5idXN5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RhcnRPdmVyKCkge1xuICAgICAgICB2bS5idXN5ID0gdHJ1ZTtcbiAgICAgICAgTGVhZGVyc2hpcFN0eWxlU2VydmljZS5yZXRha2VMZWFkZXJzaGlwU3R5bGUodm0ubGVhZGVyc2hpcFN0eWxlKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgICAgICAgICB2bS5wYW5lbF9pbmRleD0wO1xuICAgICAgICAgICAgICAgIHZtLnNlbGVjdGVkQW5zd2VyPW51bGw7XG4gICAgICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaW5pc2goKSB7XG4gICAgICAgIHZtLmJ1c3kgPSB0cnVlO1xuICAgICAgICBMZWFkZXJzaGlwU3R5bGVTZXJ2aWNlLnVwZGF0ZUVtcGxveWVlWm9uZSh7aWQ6IHZtLmxlYWRlcnNoaXBTdHlsZS5pZCwgem9uZTogdm0ubGVhZGVyc2hpcFN0eWxlLnpvbmUuaWQsIG5vdGVzOiB2bS5sZWFkZXJzaGlwU3R5bGUubm90ZXMsIGNvbXBsZXRlZDogdHJ1ZX0pXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgICAgIHZtLmxlYWRlcnNoaXBTdHlsZSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICBOb3RpZmljYXRpb24uc3VjY2VzcygnWW91ciBxdWl6IHJlc3VsdHMgaGFzIGJlZW4gc2hhcmVkLicpXG4gICAgICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2UocmVzdWx0KTtcbiAgICAgICAgICAgICAgICBpZiAobGVhZGVyc2hpcFN0eWxlLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvaWQvJyArIHJlc3VsdC5pZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaG93V2hvQ2FuU2VlVGhpcyhlbXBsb3llZV9pZCwgZW1wbG95ZWVfdmlldykge1xuICAgICAgICAkbW9kYWwub3Blbih7XG4gICAgICAgICAgICBhbmltYXRpb246IHRydWUsXG4gICAgICAgICAgICBiYWNrZHJvcDogJ3N0YXRpYycsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9zdGF0aWMvYW5ndWxhci9wYXJ0aWFscy9fbW9kYWxzL3doby1jYW4tc2VlLXRoaXMuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnU3VwcG9ydFRlYW1DdHJsJyxcbiAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICBlbXBsb3llZV92aWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbXBsb3llZV92aWV3XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlbXBsb3llZV9pZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZW1wbG95ZWVfaWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2xlYWRlcnNoaXAtc3R5bGUnKVxuICAgIC5mYWN0b3J5KCdMZWFkZXJzaGlwU3R5bGVTZXJ2aWNlJywgTGVhZGVyc2hpcFN0eWxlU2VydmljZSk7XG5cbmZ1bmN0aW9uIExlYWRlcnNoaXBTdHlsZVNlcnZpY2UoJGh0dHAsICRsb2csIExlYWRlcnNoaXBTdHlsZVJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY3JlYXRlTGVhZGVyc2hpcFN0eWxlOiBjcmVhdGVMZWFkZXJzaGlwU3R5bGUsXG4gICAgICAgIGdldExlYWRlcnNoaXBTdHlsZTogZ2V0TGVhZGVyc2hpcFN0eWxlLFxuICAgICAgICBnZXRNeUxlYWRlcnNoaXBTdHlsZTogZ2V0TXlMZWFkZXJzaGlwU3R5bGUsXG4gICAgICAgIGdldE15VW5maW5pc2hlZExlYWRlcnNoaXBTdHlsZTogZ2V0TXlVbmZpbmlzaGVkTGVhZGVyc2hpcFN0eWxlLFxuICAgICAgICByZXRha2VMZWFkZXJzaGlwU3R5bGU6IHJldGFrZUxlYWRlcnNoaXBTdHlsZSxcbiAgICAgICAgc2hhcmVMZWFkZXJzaGlwU3R5bGU6IHNoYXJlTGVhZGVyc2hpcFN0eWxlLFxuICAgICAgICB1cGRhdGVMZWFkZXJzaGlwU3R5bGU6IHVwZGF0ZUxlYWRlcnNoaXBTdHlsZSxcbiAgICAgICAgZ29Ub1ByZXZpb3VzUXVlc3Rpb246IGdvVG9QcmV2aW91c1F1ZXN0aW9uXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUxlYWRlcnNoaXBTdHlsZShsZWFkZXJzaGlwU3R5bGUpIHtcbiAgICAgICAgcmV0dXJuIExlYWRlcnNoaXBTdHlsZVJlc291cmNlLmNyZWF0ZShsZWFkZXJzaGlwU3R5bGUsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ2NyZWF0ZUxlYWRlcnNoaXBTdHlsZSBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldExlYWRlcnNoaXBTdHlsZShsZWFkZXJzaGlwU3R5bGVJZCkge1xuICAgICAgICByZXR1cm4gTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2UuZ2V0KHtpZDogbGVhZGVyc2hpcFN0eWxlSWR9LCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdnZXRMZWFkZXJzaGlwU3R5bGUgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRNeUxlYWRlcnNoaXBTdHlsZSgpIHtcbiAgICAgICAgcmV0dXJuIExlYWRlcnNoaXBTdHlsZVJlc291cmNlLmdldE15KHtpZDogJ215J30sIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ2dldE15TGVhZGVyc2hpcFN0eWxlIGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0TXlVbmZpbmlzaGVkTGVhZGVyc2hpcFN0eWxlKCkge1xuICAgICAgICByZXR1cm4gTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2UuZ2V0VW5maW5pc2hlZChudWxsLCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdnZXRVbmZpbmlzaGVkIGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmV0YWtlTGVhZGVyc2hpcFN0eWxlKGxlYWRlcnNoaXBTdHlsZSkge1xuICAgICAgICByZXR1cm4gTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2UucmV0YWtlKHtpZDogbGVhZGVyc2hpcFN0eWxlLmlkfSwgbGVhZGVyc2hpcFN0eWxlLCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdyZXRha2VMZWFkZXJzaGlwU3R5bGUgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaGFyZUxlYWRlcnNoaXBTdHlsZShsZWFkZXJzaGlwU3R5bGUpIHtcbiAgICAgICAgcmV0dXJuIExlYWRlcnNoaXBTdHlsZVJlc291cmNlLnNoYXJlKHtpZDogbGVhZGVyc2hpcFN0eWxlLmlkfSwgbGVhZGVyc2hpcFN0eWxlLCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdzaGFyZUxlYWRlcnNoaXBTdHlsZSBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZUxlYWRlcnNoaXBTdHlsZShsZWFkZXJzaGlwU3R5bGUpIHtcbiAgICAgICAgcmV0dXJuIExlYWRlcnNoaXBTdHlsZVJlc291cmNlLnVwZGF0ZSh7aWQ6IGxlYWRlcnNoaXBTdHlsZS5pZH0sIGxlYWRlcnNoaXBTdHlsZSwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcigndXBkYXRlTGVhZGVyc2hpcFN0eWxlIGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ29Ub1ByZXZpb3VzUXVlc3Rpb24obGVhZGVyc2hpcFN0eWxlKSB7XG4gICAgICAgIHJldHVybiBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZS5nb1RvUHJldmlvdXNRdWVzdGlvbih7aWQ6IGxlYWRlcnNoaXBTdHlsZS5pZH0sIG51bGwsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ2dvVG9QcmV2aW91c1F1ZXN0aW9uIGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxufSIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdsZWFkZXJzaGlwLXN0eWxlJylcbiAgICAuZmFjdG9yeSgnTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2UnLCBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZSk7XG5cbmZ1bmN0aW9uIExlYWRlcnNoaXBTdHlsZVJlc291cmNlKCRyZXNvdXJjZSkge1xuICAgIHZhciBhY3Rpb25zID0ge1xuICAgICAgICAnY3JlYXRlJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL2xlYWRlcnNoaXAtc3R5bGUvY3JlYXRlLydcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldCc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL2xlYWRlcnNoaXAtc3R5bGUvOmlkLydcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldE15Jzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvbGVhZGVyc2hpcC1zdHlsZS86aWQvJ1xuICAgICAgICB9LFxuICAgICAgICAnZ2V0VW5maW5pc2hlZCc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL2xlYWRlcnNoaXAtc3R5bGUvdW5maW5pc2hlZC8nXG4gICAgICAgIH0sXG4gICAgICAgICdyZXRha2UnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlLzppZC9yZXRha2UvJ1xuICAgICAgICB9LFxuICAgICAgICAnc2hhcmUnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlLzppZC9zaGFyZS8nXG4gICAgICAgIH0sXG4gICAgICAgICd1cGRhdGUnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlLzppZC91cGRhdGUvJ1xuICAgICAgICB9LFxuICAgICAgICAnZ29Ub1ByZXZpb3VzUXVlc3Rpb24nOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlLzppZC9wcmV2aW91cy1xdWVzdGlvbi8nXG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiAkcmVzb3VyY2UoJy9hcGkvdjEvbGVhZGVyc2hpcC1zdHlsZS86aWQvJywgbnVsbCwgYWN0aW9ucyk7XG59XG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnbGVhZGVyc2hpcC1zdHlsZScpXG4gICAgLmNvbnRyb2xsZXIoJ0xlYWRlcnNoaXBTdHlsZUNvbnRyb2xsZXInLCBMZWFkZXJzaGlwU3R5bGVDb250cm9sbGVyKTtcblxuZnVuY3Rpb24gTGVhZGVyc2hpcFN0eWxlQ29udHJvbGxlcihMZWFkZXJzaGlwU3R5bGVTZXJ2aWNlLCBOb3RpZmljYXRpb24sIFVzZXJQcmVmZXJlbmNlc1NlcnZpY2UsIGFuYWx5dGljcywgJGxvY2F0aW9uLCAkbW9kYWwsICRyb290U2NvcGUsICRzY29wZSwgJHRpbWVvdXQpIHtcbiAgICAvKiBTaW5jZSB0aGlzIHBhZ2UgY2FuIGJlIHRoZSByb290IGZvciBzb21lIHVzZXJzIGxldCdzIG1ha2Ugc3VyZSB3ZSBjYXB0dXJlIHRoZSBjb3JyZWN0IHBhZ2UgKi9cbiAgICB2YXIgbG9jYXRpb25fdXJsID0gJGxvY2F0aW9uLnVybCgpLmluZGV4T2YoJy9pZCcpIDwgMCA/ICcvaWQnIDogJGxvY2F0aW9uLnVybCgpO1xuICAgIGFuYWx5dGljcy50cmFja1BhZ2UoJHNjb3BlLCAkbG9jYXRpb24uYWJzVXJsKCksIGxvY2F0aW9uX3VybCk7XG5cbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLmJ1c3kgPSB0cnVlO1xuICAgIHZtLnNob3dFbXB0eVNjcmVlbiA9IGZhbHNlO1xuICAgIHZtLm15TGVhZGVyc2hpcFN0eWxlID0gbnVsbDtcbiAgICB2bS50YWtlUXVpeiA9IHRha2VRdWl6O1xuICAgIGFjdGl2YXRlKCk7XG5cbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgZ2V0TXlMZWFkZXJzaGlwU3R5bGUoKTtcblxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRNeUxlYWRlcnNoaXBTdHlsZSgpIHtcbiAgICAgICAgdm0uYnVzeSA9IHRydWU7XG4gICAgICAgIExlYWRlcnNoaXBTdHlsZVNlcnZpY2UuZ2V0TXlMZWFkZXJzaGlwU3R5bGUoKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24obGVhZGVyc2hpcFN0eWxlKXtcbiAgICAgICAgICAgICAgICB2bS5teUxlYWRlcnNoaXBTdHlsZSA9IGxlYWRlcnNoaXBTdHlsZTtcbiAgICAgICAgICAgICAgICB2bS5idXN5ID0gZmFsc2U7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRha2VRdWl6KCkge1xuICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIHdpbmRvd0NsYXNzOiAneHgtZGlhbG9nIGZhZGUgem9vbScsXG4gICAgICAgICAgICBiYWNrZHJvcDogJ3N0YXRpYycsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9zdGF0aWMvYW5ndWxhci9sZWFkZXJzaGlwLXN0eWxlL3BhcnRpYWxzL19tb2RhbHMvcXVpei5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdRdWl6Q29udHJvbGxlciBhcyBxdWl6JyxcbiAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgbGVhZGVyc2hpcFN0eWxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm0ubXlMZWFkZXJzaGlwU3R5bGVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIChsZWFkZXJzaGlwU3R5bGUpIHtcbiAgICAgICAgICAgICAgICB2bS5teUxlYWRlcnNoaXBTdHlsZSA9IGxlYWRlcnNoaXBTdHlsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9O1xufVxuIiwiOyhmdW5jdGlvbigpIHtcblwidXNlIHN0cmljdFwiO1xuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnbGVhZGVyc2hpcC1zdHlsZScsIFsnbmdSb3V0ZScsICd1aS1ub3RpZmljYXRpb24nXSk7XG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdsZWFkZXJzaGlwLXN0eWxlJylcbiAgICAuY29udHJvbGxlcignUXVpekNvbnRyb2xsZXInLCBRdWl6Q29udHJvbGxlcik7XG5cbmZ1bmN0aW9uIFF1aXpDb250cm9sbGVyKGFuYWx5dGljcywgTGVhZGVyc2hpcFN0eWxlU2VydmljZSwgTm90aWZpY2F0aW9uLCBsZWFkZXJzaGlwU3R5bGUsICRsb2NhdGlvbiwgJG1vZGFsLCAkbW9kYWxJbnN0YW5jZSwgJHJvb3RTY29wZSwgJHNjb3BlKSB7XG4gICAgdmFyIGxvY2F0aW9uX3VybCA9ICcvcXVpei8nICsgbGVhZGVyc2hpcFN0eWxlLmlkO1xuICAgIGFuYWx5dGljcy50cmFja1BhZ2UoJHNjb3BlLCAkbG9jYXRpb24uYWJzVXJsKCksIGxvY2F0aW9uX3VybCk7XG4gICAgdmFyIHZtID0gdGhpcztcblxuICAgIHZtLmxlYWRlcnNoaXBTdHlsZSA9IGxlYWRlcnNoaXBTdHlsZTtcbiAgICB2bS5wYW5lbF9pbmRleCA9IDA7XG4gICAgdm0uYnVzeSA9IGZhbHNlO1xuICAgIHZtLmNhbmNlbCA9IGNhbmNlbDtcbiAgICB2bS5jbG9zZSA9IGNsb3NlO1xuICAgIHZtLmFuc3dlclF1ZXN0aW9uID0gYW5zd2VyUXVlc3Rpb247XG4gICAgdm0ucHJldmlvdXNRdWVzdGlvbiA9IHByZXZpb3VzUXVlc3Rpb247XG4gICAgdm0uc3RhcnRPdmVyID0gc3RhcnRPdmVyO1xuICAgIHZtLnNob3dXaG9DYW5TZWVUaGlzID0gc2hvd1dob0NhblNlZVRoaXM7XG4gICAgdm0uZmluaXNoID0gZmluaXNoO1xuICAgIHZtLmVtcGxveWVlID0gJHJvb3RTY29wZS5jdXJyZW50VXNlci5lbXBsb3llZTtcbiAgICB2bS5zZWxlY3RlZEFuc3dlciA9IG51bGw7XG4gICAgdm0uc2NvcmVzID0gW107XG5cbiAgICBhY3RpdmF0ZSgpXG5cbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgaWYgKGxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uKSB7XG4gICAgICAgICAgICB2bS5zZWxlY3RlZEFuc3dlciA9IGxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uLmFuc3dlcjtcbiAgICAgICAgfVxuICAgICAgICBpc0NvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNDb21wbGV0ZSgpIHtcbiAgICAgICAgaWYgKHZtLmxlYWRlcnNoaXBTdHlsZS5jb21wbGV0ZWQgfHwgIXZtLmxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uKSB7XG4gICAgICAgICAgICBpZiAoIXZtLmxlYWRlcnNoaXBTdHlsZS5jb21wbGV0ZWQpIHtcbiAgICAgICAgICAgICAgICB2bS5sZWFkZXJzaGlwU3R5bGUuYXNzZXNzb3IgPSB2bS5sZWFkZXJzaGlwU3R5bGUuYXNzZXNzb3IuaWQ7XG4gICAgICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlLmNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgTGVhZGVyc2hpcFN0eWxlU2VydmljZS51cGRhdGVMZWFkZXJzaGlwU3R5bGUodm0ubGVhZGVyc2hpcFN0eWxlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmxlYWRlcnNoaXBTdHlsZSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uYnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2bS5zY29yZXMucHVzaCh7J3N0eWxlJyA6ICdWaXNpb25hcnknLCAnc2NvcmUnOiB2bS5sZWFkZXJzaGlwU3R5bGUudmlzaW9uYXJ5X3Njb3JlfSk7XG4gICAgICAgICAgICB2bS5zY29yZXMucHVzaCh7J3N0eWxlJyA6ICdPcGVyYXRvcicsICdzY29yZSc6IHZtLmxlYWRlcnNoaXBTdHlsZS5vcGVyYXRvcl9zY29yZX0pO1xuICAgICAgICAgICAgdm0uc2NvcmVzLnB1c2goeydzdHlsZScgOiAnUHJvY2Vzc29yJywgJ3Njb3JlJzogdm0ubGVhZGVyc2hpcFN0eWxlLnByb2Nlc3Nvcl9zY29yZX0pO1xuICAgICAgICAgICAgdm0uc2NvcmVzLnB1c2goeydzdHlsZScgOiAnU3luZXJnaXN0JywgJ3Njb3JlJzogdm0ubGVhZGVyc2hpcFN0eWxlLnN5bmVyZ2lzdF9zY29yZX0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKHZtLmxlYWRlcnNoaXBTdHlsZSlcbiAgICAgICAgaWYgKCF2bS5sZWFkZXJzaGlwU3R5bGUuY29tcGxldGVkKSB7XG4gICAgICAgICAgICBOb3RpZmljYXRpb24uc3VjY2VzcygnWW91ciBwcm9ncmVzcyBoYXMgYmVlbiBzYXZlZC4nKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYW5zd2VyUXVlc3Rpb24oYW5zd2VyKSB7XG4gICAgICAgIHZtLmJ1c3kgPSB0cnVlO1xuICAgICAgICB2bS5sZWFkZXJzaGlwU3R5bGUubGFzdF9xdWVzdGlvbl9hbnN3ZXJlZCA9IHZtLmxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uLmlkO1xuICAgICAgICBpZiAodm0ubGVhZGVyc2hpcFN0eWxlLm5leHRfcXVlc3Rpb24uYW5zd2VyKSB7XG4gICAgICAgICAgICBpZiAodm0ubGVhZGVyc2hpcFN0eWxlLm5leHRfcXVlc3Rpb24uYW5zd2VyLmlkICE9IGFuc3dlci5pZCkge1xuICAgICAgICAgICAgICAgIHZhciBhbnN3ZXJzID0gW2Fuc3dlci5pZF07XG4gICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLmxlYWRlcnNoaXBTdHlsZS5hbnN3ZXJzLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZtLmxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uLmFuc3dlci5pZCAhPSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2Vycy5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlLmFuc3dlcnMgPSBhbnN3ZXJzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlLmFuc3dlcnMucHVzaChhbnN3ZXIuaWQpO1xuICAgICAgICB9XG4gICAgICAgIHZtLmxlYWRlcnNoaXBTdHlsZS5hc3Nlc3NvciA9IHZtLmxlYWRlcnNoaXBTdHlsZS5hc3Nlc3Nvci5pZDtcbiAgICAgICAgTGVhZGVyc2hpcFN0eWxlU2VydmljZS51cGRhdGVMZWFkZXJzaGlwU3R5bGUodm0ubGVhZGVyc2hpcFN0eWxlKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgICAgICAgICB2bS5sZWFkZXJzaGlwU3R5bGUgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgaXNDb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIGlmICh2bS5sZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZEFuc3dlciA9IHZtLmxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uLmFuc3dlcjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZEFuc3dlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmV2aW91c1F1ZXN0aW9uKCl7XG4gICAgICAgIHZtLmJ1c3kgPSB0cnVlO1xuICAgICAgICBMZWFkZXJzaGlwU3R5bGVTZXJ2aWNlLmdvVG9QcmV2aW91c1F1ZXN0aW9uKHZtLmxlYWRlcnNoaXBTdHlsZSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIGlmICh2bS5sZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZEFuc3dlciA9IHZtLmxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uLmFuc3dlcjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZEFuc3dlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdGFydE92ZXIoKSB7XG4gICAgICAgIHZtLmJ1c3kgPSB0cnVlO1xuICAgICAgICBMZWFkZXJzaGlwU3R5bGVTZXJ2aWNlLnJldGFrZUxlYWRlcnNoaXBTdHlsZSh2bS5sZWFkZXJzaGlwU3R5bGUpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgICAgIHZtLnBhbmVsX2luZGV4PTA7XG4gICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRBbnN3ZXI9bnVsbDtcbiAgICAgICAgICAgICAgICB2bS5sZWFkZXJzaGlwU3R5bGUgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgdm0uYnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbmlzaCgpIHtcbiAgICAgICAgdm0uYnVzeSA9IHRydWU7XG4gICAgICAgIExlYWRlcnNoaXBTdHlsZVNlcnZpY2UudXBkYXRlRW1wbG95ZWVab25lKHtpZDogdm0ubGVhZGVyc2hpcFN0eWxlLmlkLCB6b25lOiB2bS5sZWFkZXJzaGlwU3R5bGUuem9uZS5pZCwgbm90ZXM6IHZtLmxlYWRlcnNoaXBTdHlsZS5ub3RlcywgY29tcGxldGVkOiB0cnVlfSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIE5vdGlmaWNhdGlvbi5zdWNjZXNzKCdZb3VyIHF1aXogcmVzdWx0cyBoYXMgYmVlbiBzaGFyZWQuJylcbiAgICAgICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZShyZXN1bHQpO1xuICAgICAgICAgICAgICAgIGlmIChsZWFkZXJzaGlwU3R5bGUuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9pZC8nICsgcmVzdWx0LmlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdm0uYnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNob3dXaG9DYW5TZWVUaGlzKGVtcGxveWVlX2lkLCBlbXBsb3llZV92aWV3KSB7XG4gICAgICAgICRtb2RhbC5vcGVuKHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIGJhY2tkcm9wOiAnc3RhdGljJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3N0YXRpYy9hbmd1bGFyL3BhcnRpYWxzL19tb2RhbHMvd2hvLWNhbi1zZWUtdGhpcy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdTdXBwb3J0VGVhbUN0cmwnLFxuICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgIGVtcGxveWVlX3ZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVtcGxveWVlX3ZpZXdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVtcGxveWVlX2lkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbXBsb3llZV9pZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdsZWFkZXJzaGlwLXN0eWxlJylcbiAgICAuZmFjdG9yeSgnTGVhZGVyc2hpcFN0eWxlU2VydmljZScsIExlYWRlcnNoaXBTdHlsZVNlcnZpY2UpO1xuXG5mdW5jdGlvbiBMZWFkZXJzaGlwU3R5bGVTZXJ2aWNlKCRodHRwLCAkbG9nLCBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNyZWF0ZUxlYWRlcnNoaXBTdHlsZTogY3JlYXRlTGVhZGVyc2hpcFN0eWxlLFxuICAgICAgICBnZXRMZWFkZXJzaGlwU3R5bGU6IGdldExlYWRlcnNoaXBTdHlsZSxcbiAgICAgICAgZ2V0TXlMZWFkZXJzaGlwU3R5bGU6IGdldE15TGVhZGVyc2hpcFN0eWxlLFxuICAgICAgICBnZXRNeVVuZmluaXNoZWRMZWFkZXJzaGlwU3R5bGU6IGdldE15VW5maW5pc2hlZExlYWRlcnNoaXBTdHlsZSxcbiAgICAgICAgcmV0YWtlTGVhZGVyc2hpcFN0eWxlOiByZXRha2VMZWFkZXJzaGlwU3R5bGUsXG4gICAgICAgIHNoYXJlTGVhZGVyc2hpcFN0eWxlOiBzaGFyZUxlYWRlcnNoaXBTdHlsZSxcbiAgICAgICAgdXBkYXRlTGVhZGVyc2hpcFN0eWxlOiB1cGRhdGVMZWFkZXJzaGlwU3R5bGUsXG4gICAgICAgIGdvVG9QcmV2aW91c1F1ZXN0aW9uOiBnb1RvUHJldmlvdXNRdWVzdGlvblxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVMZWFkZXJzaGlwU3R5bGUobGVhZGVyc2hpcFN0eWxlKSB7XG4gICAgICAgIHJldHVybiBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZS5jcmVhdGUobGVhZGVyc2hpcFN0eWxlLCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdjcmVhdGVMZWFkZXJzaGlwU3R5bGUgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRMZWFkZXJzaGlwU3R5bGUobGVhZGVyc2hpcFN0eWxlSWQpIHtcbiAgICAgICAgcmV0dXJuIExlYWRlcnNoaXBTdHlsZVJlc291cmNlLmdldCh7aWQ6IGxlYWRlcnNoaXBTdHlsZUlkfSwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignZ2V0TGVhZGVyc2hpcFN0eWxlIGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0TXlMZWFkZXJzaGlwU3R5bGUoKSB7XG4gICAgICAgIHJldHVybiBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZS5nZXRNeSh7aWQ6ICdteSd9LCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdnZXRNeUxlYWRlcnNoaXBTdHlsZSBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE15VW5maW5pc2hlZExlYWRlcnNoaXBTdHlsZSgpIHtcbiAgICAgICAgcmV0dXJuIExlYWRlcnNoaXBTdHlsZVJlc291cmNlLmdldFVuZmluaXNoZWQobnVsbCwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignZ2V0VW5maW5pc2hlZCBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJldGFrZUxlYWRlcnNoaXBTdHlsZShsZWFkZXJzaGlwU3R5bGUpIHtcbiAgICAgICAgcmV0dXJuIExlYWRlcnNoaXBTdHlsZVJlc291cmNlLnJldGFrZSh7aWQ6IGxlYWRlcnNoaXBTdHlsZS5pZH0sIGxlYWRlcnNoaXBTdHlsZSwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcigncmV0YWtlTGVhZGVyc2hpcFN0eWxlIGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2hhcmVMZWFkZXJzaGlwU3R5bGUobGVhZGVyc2hpcFN0eWxlKSB7XG4gICAgICAgIHJldHVybiBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZS5zaGFyZSh7aWQ6IGxlYWRlcnNoaXBTdHlsZS5pZH0sIGxlYWRlcnNoaXBTdHlsZSwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignc2hhcmVMZWFkZXJzaGlwU3R5bGUgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVMZWFkZXJzaGlwU3R5bGUobGVhZGVyc2hpcFN0eWxlKSB7XG4gICAgICAgIHJldHVybiBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZS51cGRhdGUoe2lkOiBsZWFkZXJzaGlwU3R5bGUuaWR9LCBsZWFkZXJzaGlwU3R5bGUsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ3VwZGF0ZUxlYWRlcnNoaXBTdHlsZSBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdvVG9QcmV2aW91c1F1ZXN0aW9uKGxlYWRlcnNoaXBTdHlsZSkge1xuICAgICAgICByZXR1cm4gTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2UuZ29Ub1ByZXZpb3VzUXVlc3Rpb24oe2lkOiBsZWFkZXJzaGlwU3R5bGUuaWR9LCBudWxsLCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdnb1RvUHJldmlvdXNRdWVzdGlvbiBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdsZWFkZXJzaGlwLXN0eWxlJylcbiAgICAuZmFjdG9yeSgnTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2UnLCBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZSk7XG5cbmZ1bmN0aW9uIExlYWRlcnNoaXBTdHlsZVJlc291cmNlKCRyZXNvdXJjZSkge1xuICAgIHZhciBhY3Rpb25zID0ge1xuICAgICAgICAnY3JlYXRlJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL2xlYWRlcnNoaXAtc3R5bGUvY3JlYXRlLydcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldCc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL2xlYWRlcnNoaXAtc3R5bGUvOmlkLydcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldE15Jzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvbGVhZGVyc2hpcC1zdHlsZS86aWQvJ1xuICAgICAgICB9LFxuICAgICAgICAnZ2V0VW5maW5pc2hlZCc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL2xlYWRlcnNoaXAtc3R5bGUvdW5maW5pc2hlZC8nXG4gICAgICAgIH0sXG4gICAgICAgICdyZXRha2UnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlLzppZC9yZXRha2UvJ1xuICAgICAgICB9LFxuICAgICAgICAnc2hhcmUnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlLzppZC9zaGFyZS8nXG4gICAgICAgIH0sXG4gICAgICAgICd1cGRhdGUnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlLzppZC91cGRhdGUvJ1xuICAgICAgICB9LFxuICAgICAgICAnZ29Ub1ByZXZpb3VzUXVlc3Rpb24nOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlLzppZC9wcmV2aW91cy1xdWVzdGlvbi8nXG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiAkcmVzb3VyY2UoJy9hcGkvdjEvbGVhZGVyc2hpcC1zdHlsZS86aWQvJywgbnVsbCwgYWN0aW9ucyk7XG59XG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdsZWFkZXJzaGlwLXN0eWxlJylcbiAgICAuY29udHJvbGxlcignTGVhZGVyc2hpcFN0eWxlQ29udHJvbGxlcicsIExlYWRlcnNoaXBTdHlsZUNvbnRyb2xsZXIpO1xuXG5mdW5jdGlvbiBMZWFkZXJzaGlwU3R5bGVDb250cm9sbGVyKExlYWRlcnNoaXBTdHlsZVNlcnZpY2UsIE5vdGlmaWNhdGlvbiwgVXNlclByZWZlcmVuY2VzU2VydmljZSwgYW5hbHl0aWNzLCAkbG9jYXRpb24sICRtb2RhbCwgJHJvb3RTY29wZSwgJHNjb3BlLCAkdGltZW91dCkge1xuICAgIC8qIFNpbmNlIHRoaXMgcGFnZSBjYW4gYmUgdGhlIHJvb3QgZm9yIHNvbWUgdXNlcnMgbGV0J3MgbWFrZSBzdXJlIHdlIGNhcHR1cmUgdGhlIGNvcnJlY3QgcGFnZSAqL1xuICAgIHZhciBsb2NhdGlvbl91cmwgPSAkbG9jYXRpb24udXJsKCkuaW5kZXhPZignL2lkJykgPCAwID8gJy9pZCcgOiAkbG9jYXRpb24udXJsKCk7XG4gICAgYW5hbHl0aWNzLnRyYWNrUGFnZSgkc2NvcGUsICRsb2NhdGlvbi5hYnNVcmwoKSwgbG9jYXRpb25fdXJsKTtcblxuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uYnVzeSA9IHRydWU7XG4gICAgdm0uc2hvd0VtcHR5U2NyZWVuID0gZmFsc2U7XG4gICAgdm0ubXlMZWFkZXJzaGlwU3R5bGUgPSBudWxsO1xuICAgIHZtLnRha2VRdWl6ID0gdGFrZVF1aXo7XG4gICAgYWN0aXZhdGUoKTtcblxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICBnZXRNeUxlYWRlcnNoaXBTdHlsZSgpO1xuXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldE15TGVhZGVyc2hpcFN0eWxlKCkge1xuICAgICAgICB2bS5idXN5ID0gdHJ1ZTtcbiAgICAgICAgTGVhZGVyc2hpcFN0eWxlU2VydmljZS5nZXRNeUxlYWRlcnNoaXBTdHlsZSgpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihsZWFkZXJzaGlwU3R5bGUpe1xuICAgICAgICAgICAgICAgIHZtLm15TGVhZGVyc2hpcFN0eWxlID0gbGVhZGVyc2hpcFN0eWxlO1xuICAgICAgICAgICAgICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdm0uYnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdGFrZVF1aXooKSB7XG4gICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuICAgICAgICAgICAgYW5pbWF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgd2luZG93Q2xhc3M6ICd4eC1kaWFsb2cgZmFkZSB6b29tJyxcbiAgICAgICAgICAgIGJhY2tkcm9wOiAnc3RhdGljJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3N0YXRpYy9hbmd1bGFyL2xlYWRlcnNoaXAtc3R5bGUvcGFydGlhbHMvX21vZGFscy9xdWl6Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ1F1aXpDb250cm9sbGVyIGFzIHF1aXonLFxuICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICBsZWFkZXJzaGlwU3R5bGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2bS5teUxlYWRlcnNoaXBTdHlsZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKFxuICAgICAgICAgICAgZnVuY3Rpb24gKGxlYWRlcnNoaXBTdHlsZSkge1xuICAgICAgICAgICAgICAgIHZtLm15TGVhZGVyc2hpcFN0eWxlID0gbGVhZGVyc2hpcFN0eWxlO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH07XG59XG59KCkpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
