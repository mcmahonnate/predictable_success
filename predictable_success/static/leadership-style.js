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

    activate()

    function activate() {
        if (leadershipStyle.next_question) {
            vm.selectedAnswer = leadershipStyle.next_question.answer;
        }
    }

    function cancel() {
        $modalInstance.dismiss();
    }

    function close() {
        $modalInstance.close(vm.leadershipStyle)
        Notification.success('Your progress has been saved.')
    }

    function answerQuestion(answer) {
        vm.busy = true;
        vm.leadershipStyle.last_question_answered = vm.leadershipStyle.next_question.id;
        if (vm.leadershipStyle.next_question.answer && vm.leadershipStyle.next_question.answer.id != answer.id) {
            var answers = [answer.id];
            angular.forEach(vm.leadershipStyle.answers, function(value) {
                if (vm.leadershipStyle.next_question.answer.id != value) {
                    answers.push(value);
                }
            })
            vm.leadershipStyle.answers = answers;
        }
        vm.leadershipStyle.assessor = vm.leadershipStyle.assessor.id;
        LeadershipStyleService.updateLeadershipStyle(vm.leadershipStyle)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxlYWRlcnNoaXAtc3R5bGUubW9kdWxlLmpzIiwicXVpei5jb250cm9sbGVyLmpzIiwibGVhZGVyc2hpcC1zdHlsZS5zZXJ2aWNlLmpzIiwibGVhZGVyc2hpcC1zdHlsZS5yZXNvdXJjZS5qcyIsImxlYWRlcnNoaXAtc3R5bGUuY29udHJvbGxlci5qcyIsImxlYWRlcnNoaXAtc3R5bGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxDQUFBLFdBQUE7QUFDQTs7Ozs7O0FDREE7S0FDQSxPQUFBLG9CQUFBLENBQUEsV0FBQTs7QUFFQTtLQUNBLE9BQUE7S0FDQSxXQUFBLGtCQUFBOztBQUVBLFNBQUEsZUFBQSxXQUFBLHdCQUFBLGNBQUEsaUJBQUEsV0FBQSxRQUFBLGdCQUFBLFlBQUEsUUFBQTtJQUNBLElBQUEsZUFBQSxXQUFBLGdCQUFBO0lBQ0EsVUFBQSxVQUFBLFFBQUEsVUFBQSxVQUFBO0lBQ0EsSUFBQSxLQUFBOztJQUVBLEdBQUEsa0JBQUE7SUFDQSxHQUFBLGNBQUE7SUFDQSxHQUFBLE9BQUE7SUFDQSxHQUFBLFNBQUE7SUFDQSxHQUFBLFFBQUE7SUFDQSxHQUFBLGlCQUFBO0lBQ0EsR0FBQSxtQkFBQTtJQUNBLEdBQUEsWUFBQTtJQUNBLEdBQUEsb0JBQUE7SUFDQSxHQUFBLFNBQUE7SUFDQSxHQUFBLFdBQUEsV0FBQSxZQUFBO0lBQ0EsR0FBQSxpQkFBQTs7SUFFQTs7SUFFQSxTQUFBLFdBQUE7UUFDQSxJQUFBLGdCQUFBLGVBQUE7WUFDQSxHQUFBLGlCQUFBLGdCQUFBLGNBQUE7Ozs7SUFJQSxTQUFBLFNBQUE7UUFDQSxlQUFBOzs7SUFHQSxTQUFBLFFBQUE7UUFDQSxlQUFBLE1BQUEsR0FBQTtRQUNBLGFBQUEsUUFBQTs7O0lBR0EsU0FBQSxlQUFBLFFBQUE7UUFDQSxHQUFBLE9BQUE7UUFDQSxHQUFBLGdCQUFBLHlCQUFBLEdBQUEsZ0JBQUEsY0FBQTtRQUNBLElBQUEsR0FBQSxnQkFBQSxjQUFBLFVBQUEsR0FBQSxn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QTtZQUNBLEtBQUEsTUFBQTs7OztJQUlBLFNBQUEsc0JBQUEsaUJBQUE7UUFDQSxPQUFBLHdCQUFBLE9BQUEsQ0FBQSxJQUFBLGdCQUFBLEtBQUEsaUJBQUEsU0FBQSxNQUFBOztRQUVBLFNBQUEsUUFBQSxVQUFBO1lBQ0EsT0FBQTs7O1FBR0EsU0FBQSxLQUFBLFVBQUE7WUFDQSxLQUFBLE1BQUE7Ozs7SUFJQSxTQUFBLHFCQUFBLGlCQUFBO1FBQ0EsT0FBQSx3QkFBQSxNQUFBLENBQUEsSUFBQSxnQkFBQSxLQUFBLGlCQUFBLFNBQUEsTUFBQTs7UUFFQSxTQUFBLFFBQUEsVUFBQTtZQUNBLE9BQUE7OztRQUdBLFNBQUEsS0FBQSxVQUFBO1lBQ0EsS0FBQSxNQUFBOzs7O0lBSUEsU0FBQSxzQkFBQSxpQkFBQTtRQUNBLE9BQUEsd0JBQUEsT0FBQSxDQUFBLElBQUEsZ0JBQUEsS0FBQSxpQkFBQSxTQUFBLE1BQUE7O1FBRUEsU0FBQSxRQUFBLFVBQUE7WUFDQSxPQUFBOzs7UUFHQSxTQUFBLEtBQUEsVUFBQTtZQUNBLEtBQUEsTUFBQTs7OztJQUlBLFNBQUEscUJBQUEsaUJBQUE7UUFDQSxPQUFBLHdCQUFBLHFCQUFBLENBQUEsSUFBQSxnQkFBQSxLQUFBLE1BQUEsU0FBQSxNQUFBOztRQUVBLFNBQUEsUUFBQSxVQUFBO1lBQ0EsT0FBQTs7O1FBR0EsU0FBQSxLQUFBLFVBQUE7WUFDQSxLQUFBLE1BQUE7Ozs7QUM1R0E7S0FDQSxPQUFBO0tBQ0EsUUFBQSwyQkFBQTs7QUFFQSxTQUFBLHdCQUFBLFdBQUE7SUFDQSxJQUFBLFVBQUE7UUFDQSxVQUFBO1lBQ0EsUUFBQTtZQUNBLEtBQUE7O1FBRUEsT0FBQTtZQUNBLFFBQUE7WUFDQSxLQUFBOztRQUVBLFNBQUE7WUFDQSxRQUFBO1lBQ0EsS0FBQTs7UUFFQSxpQkFBQTtZQUNBLFFBQUE7WUFDQSxLQUFBOztRQUVBLFVBQUE7WUFDQSxRQUFBO1lBQ0EsS0FBQTs7UUFFQSxTQUFBO1lBQ0EsUUFBQTtZQUNBLEtBQUE7O1FBRUEsVUFBQTtZQUNBLFFBQUE7WUFDQSxLQUFBOztRQUVBLHdCQUFBO1lBQ0EsUUFBQTtZQUNBLEtBQUE7OztJQ3ZDQSxPQUFBLFVBQUEsaUNBQUEsTUFBQTs7O0FBR0E7S0FDQSxPQUFBO0tBQ0EsV0FBQSw2QkFBQTs7QUFFQSxTQUFBLDBCQUFBLHdCQUFBLGNBQUEsd0JBQUEsV0FBQSxXQUFBLFFBQUEsWUFBQSxRQUFBLFVBQUE7O0lBRUEsSUFBQSxlQUFBLFVBQUEsTUFBQSxRQUFBLFNBQUEsSUFBQSxRQUFBLFVBQUE7SUFDQSxVQUFBLFVBQUEsUUFBQSxVQUFBLFVBQUE7O0lBRUEsSUFBQSxLQUFBO0lBQ0EsR0FBQSxPQUFBO0lBQ0EsR0FBQSxrQkFBQTtJQUNBLEdBQUEsb0JBQUE7SUFDQSxHQUFBLFdBQUE7SUFDQTs7SUFFQSxTQUFBLFdBQUE7UUFDQTs7S0FFQTs7SUFFQSxTQUFBLHVCQUFBO1FBQ0EsR0FBQSxPQUFBO1FBQ0EsdUJBQUE7YUFDQSxLQUFBLFNBQUEsZ0JBQUE7Z0JBQ0EsR0FBQSxvQkFBQTtnQkFDQSxHQUFBLE9BQUE7ZUFDQSxVQUFBO2dCQUNBLEdBQUEsT0FBQTs7Ozs7SUFLQSxTQUFBLFdBQUE7UUFDQSxJQUFBLGdCQUFBLE9BQUEsS0FBQTtZQUNBLFdBQUE7WUFDQSxhQUFBO1lBQ0EsVUFBQTtZQUNBLGFBQUE7WUFDQSxZQUFBO1lBQ0EsU0FBQTtvQkFDQSxpQkFBQSxZQUFBO3dCQUNBLE9BQUEsR0FBQTs7OztRQUlBLGNBQUEsT0FBQTtZQUNBLFVBQUEsaUJBQUE7Z0JBQ0EsR0FBQSxvQkFBQTs7O0tDOFJLOzs7QUFHTCIsImZpbGUiOiJsZWFkZXJzaGlwLXN0eWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2xlYWRlcnNoaXAtc3R5bGUnLCBbJ25nUm91dGUnLCAndWktbm90aWZpY2F0aW9uJ10pO1xuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2xlYWRlcnNoaXAtc3R5bGUnKVxuICAgIC5jb250cm9sbGVyKCdRdWl6Q29udHJvbGxlcicsIFF1aXpDb250cm9sbGVyKTtcblxuZnVuY3Rpb24gUXVpekNvbnRyb2xsZXIoYW5hbHl0aWNzLCBMZWFkZXJzaGlwU3R5bGVTZXJ2aWNlLCBOb3RpZmljYXRpb24sIGxlYWRlcnNoaXBTdHlsZSwgJGxvY2F0aW9uLCAkbW9kYWwsICRtb2RhbEluc3RhbmNlLCAkcm9vdFNjb3BlLCAkc2NvcGUpIHtcbiAgICB2YXIgbG9jYXRpb25fdXJsID0gJy9xdWl6LycgKyBsZWFkZXJzaGlwU3R5bGUuaWQ7XG4gICAgYW5hbHl0aWNzLnRyYWNrUGFnZSgkc2NvcGUsICRsb2NhdGlvbi5hYnNVcmwoKSwgbG9jYXRpb25fdXJsKTtcbiAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgdm0ubGVhZGVyc2hpcFN0eWxlID0gbGVhZGVyc2hpcFN0eWxlO1xuICAgIHZtLnBhbmVsX2luZGV4ID0gMDtcbiAgICB2bS5idXN5ID0gZmFsc2U7XG4gICAgdm0uY2FuY2VsID0gY2FuY2VsO1xuICAgIHZtLmNsb3NlID0gY2xvc2U7XG4gICAgdm0uYW5zd2VyUXVlc3Rpb24gPSBhbnN3ZXJRdWVzdGlvbjtcbiAgICB2bS5wcmV2aW91c1F1ZXN0aW9uID0gcHJldmlvdXNRdWVzdGlvbjtcbiAgICB2bS5zdGFydE92ZXIgPSBzdGFydE92ZXI7XG4gICAgdm0uc2hvd1dob0NhblNlZVRoaXMgPSBzaG93V2hvQ2FuU2VlVGhpcztcbiAgICB2bS5maW5pc2ggPSBmaW5pc2g7XG4gICAgdm0uZW1wbG95ZWUgPSAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLmVtcGxveWVlO1xuICAgIHZtLnNlbGVjdGVkQW5zd2VyID0gbnVsbDtcblxuICAgIGFjdGl2YXRlKClcblxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICBpZiAobGVhZGVyc2hpcFN0eWxlLm5leHRfcXVlc3Rpb24pIHtcbiAgICAgICAgICAgIHZtLnNlbGVjdGVkQW5zd2VyID0gbGVhZGVyc2hpcFN0eWxlLm5leHRfcXVlc3Rpb24uYW5zd2VyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKHZtLmxlYWRlcnNoaXBTdHlsZSlcbiAgICAgICAgTm90aWZpY2F0aW9uLnN1Y2Nlc3MoJ1lvdXIgcHJvZ3Jlc3MgaGFzIGJlZW4gc2F2ZWQuJylcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhbnN3ZXJRdWVzdGlvbihhbnN3ZXIpIHtcbiAgICAgICAgdm0uYnVzeSA9IHRydWU7XG4gICAgICAgIHZtLmxlYWRlcnNoaXBTdHlsZS5sYXN0X3F1ZXN0aW9uX2Fuc3dlcmVkID0gdm0ubGVhZGVyc2hpcFN0eWxlLm5leHRfcXVlc3Rpb24uaWQ7XG4gICAgICAgIGlmICh2bS5sZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbi5hbnN3ZXIgJiYgdm0ubGVhZGVyc2hpcFN0eWxlLm5leHRfcXVlc3Rpb24uYW5zd2VyLmlkICE9IGFuc3dlci5pZCkge1xuICAgICAgICAgICAgdmFyIGFuc3dlcnMgPSBbYW5zd2VyLmlkXTtcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5sZWFkZXJzaGlwU3R5bGUuYW5zd2VycywgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodm0ubGVhZGVyc2hpcFN0eWxlLm5leHRfcXVlc3Rpb24uYW5zd2VyLmlkICE9IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGFuc3dlcnMucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHZtLmxlYWRlcnNoaXBTdHlsZS5hbnN3ZXJzID0gYW5zd2VycztcbiAgICAgICAgfVxuICAgICAgICB2bS5sZWFkZXJzaGlwU3R5bGUuYXNzZXNzb3IgPSB2bS5sZWFkZXJzaGlwU3R5bGUuYXNzZXNzb3IuaWQ7XG4gICAgICAgIExlYWRlcnNoaXBTdHlsZVNlcnZpY2UudXBkYXRlTGVhZGVyc2hpcFN0eWxlKHZtLmxlYWRlcnNoaXBTdHlsZSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIGlmICh2bS5sZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZEFuc3dlciA9IHZtLmxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uLmFuc3dlcjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZEFuc3dlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmV2aW91c1F1ZXN0aW9uKCl7XG4gICAgICAgIHZtLmJ1c3kgPSB0cnVlO1xuICAgICAgICBMZWFkZXJzaGlwU3R5bGVTZXJ2aWNlLmdvVG9QcmV2aW91c1F1ZXN0aW9uKHZtLmxlYWRlcnNoaXBTdHlsZSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIGlmICh2bS5sZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZEFuc3dlciA9IHZtLmxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uLmFuc3dlcjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZEFuc3dlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdGFydE92ZXIoKSB7XG4gICAgICAgIHZtLmJ1c3kgPSB0cnVlO1xuICAgICAgICBMZWFkZXJzaGlwU3R5bGVTZXJ2aWNlLnJldGFrZUxlYWRlcnNoaXBTdHlsZSh2bS5sZWFkZXJzaGlwU3R5bGUpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgICAgIHZtLnBhbmVsX2luZGV4PTA7XG4gICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRBbnN3ZXI9bnVsbDtcbiAgICAgICAgICAgICAgICB2bS5sZWFkZXJzaGlwU3R5bGUgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgdm0uYnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbmlzaCgpIHtcbiAgICAgICAgdm0uYnVzeSA9IHRydWU7XG4gICAgICAgIExlYWRlcnNoaXBTdHlsZVNlcnZpY2UudXBkYXRlRW1wbG95ZWVab25lKHtpZDogdm0ubGVhZGVyc2hpcFN0eWxlLmlkLCB6b25lOiB2bS5sZWFkZXJzaGlwU3R5bGUuem9uZS5pZCwgbm90ZXM6IHZtLmxlYWRlcnNoaXBTdHlsZS5ub3RlcywgY29tcGxldGVkOiB0cnVlfSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIE5vdGlmaWNhdGlvbi5zdWNjZXNzKCdZb3VyIHF1aXogcmVzdWx0cyBoYXMgYmVlbiBzaGFyZWQuJylcbiAgICAgICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZShyZXN1bHQpO1xuICAgICAgICAgICAgICAgIGlmIChsZWFkZXJzaGlwU3R5bGUuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9pZC8nICsgcmVzdWx0LmlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdm0uYnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNob3dXaG9DYW5TZWVUaGlzKGVtcGxveWVlX2lkLCBlbXBsb3llZV92aWV3KSB7XG4gICAgICAgICRtb2RhbC5vcGVuKHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIGJhY2tkcm9wOiAnc3RhdGljJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3N0YXRpYy9hbmd1bGFyL3BhcnRpYWxzL19tb2RhbHMvd2hvLWNhbi1zZWUtdGhpcy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdTdXBwb3J0VGVhbUN0cmwnLFxuICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgIGVtcGxveWVlX3ZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVtcGxveWVlX3ZpZXdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVtcGxveWVlX2lkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbXBsb3llZV9pZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnbGVhZGVyc2hpcC1zdHlsZScpXG4gICAgLmZhY3RvcnkoJ0xlYWRlcnNoaXBTdHlsZVNlcnZpY2UnLCBMZWFkZXJzaGlwU3R5bGVTZXJ2aWNlKTtcblxuZnVuY3Rpb24gTGVhZGVyc2hpcFN0eWxlU2VydmljZSgkaHR0cCwgJGxvZywgTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBjcmVhdGVMZWFkZXJzaGlwU3R5bGU6IGNyZWF0ZUxlYWRlcnNoaXBTdHlsZSxcbiAgICAgICAgZ2V0TGVhZGVyc2hpcFN0eWxlOiBnZXRMZWFkZXJzaGlwU3R5bGUsXG4gICAgICAgIGdldE15TGVhZGVyc2hpcFN0eWxlOiBnZXRNeUxlYWRlcnNoaXBTdHlsZSxcbiAgICAgICAgZ2V0TXlVbmZpbmlzaGVkTGVhZGVyc2hpcFN0eWxlOiBnZXRNeVVuZmluaXNoZWRMZWFkZXJzaGlwU3R5bGUsXG4gICAgICAgIHJldGFrZUxlYWRlcnNoaXBTdHlsZTogcmV0YWtlTGVhZGVyc2hpcFN0eWxlLFxuICAgICAgICBzaGFyZUxlYWRlcnNoaXBTdHlsZTogc2hhcmVMZWFkZXJzaGlwU3R5bGUsXG4gICAgICAgIHVwZGF0ZUxlYWRlcnNoaXBTdHlsZTogdXBkYXRlTGVhZGVyc2hpcFN0eWxlLFxuICAgICAgICBnb1RvUHJldmlvdXNRdWVzdGlvbjogZ29Ub1ByZXZpb3VzUXVlc3Rpb25cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlTGVhZGVyc2hpcFN0eWxlKGxlYWRlcnNoaXBTdHlsZSkge1xuICAgICAgICByZXR1cm4gTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2UuY3JlYXRlKGxlYWRlcnNoaXBTdHlsZSwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignY3JlYXRlTGVhZGVyc2hpcFN0eWxlIGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0TGVhZGVyc2hpcFN0eWxlKGxlYWRlcnNoaXBTdHlsZUlkKSB7XG4gICAgICAgIHJldHVybiBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZS5nZXQoe2lkOiBsZWFkZXJzaGlwU3R5bGVJZH0sIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ2dldExlYWRlcnNoaXBTdHlsZSBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE15TGVhZGVyc2hpcFN0eWxlKCkge1xuICAgICAgICByZXR1cm4gTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2UuZ2V0TXkoe2lkOiAnbXknfSwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignZ2V0TXlMZWFkZXJzaGlwU3R5bGUgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRNeVVuZmluaXNoZWRMZWFkZXJzaGlwU3R5bGUoKSB7XG4gICAgICAgIHJldHVybiBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZS5nZXRVbmZpbmlzaGVkKG51bGwsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ2dldFVuZmluaXNoZWQgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXRha2VMZWFkZXJzaGlwU3R5bGUobGVhZGVyc2hpcFN0eWxlKSB7XG4gICAgICAgIHJldHVybiBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZS5yZXRha2Uoe2lkOiBsZWFkZXJzaGlwU3R5bGUuaWR9LCBsZWFkZXJzaGlwU3R5bGUsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ3JldGFrZUxlYWRlcnNoaXBTdHlsZSBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNoYXJlTGVhZGVyc2hpcFN0eWxlKGxlYWRlcnNoaXBTdHlsZSkge1xuICAgICAgICByZXR1cm4gTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2Uuc2hhcmUoe2lkOiBsZWFkZXJzaGlwU3R5bGUuaWR9LCBsZWFkZXJzaGlwU3R5bGUsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ3NoYXJlTGVhZGVyc2hpcFN0eWxlIGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlTGVhZGVyc2hpcFN0eWxlKGxlYWRlcnNoaXBTdHlsZSkge1xuICAgICAgICByZXR1cm4gTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2UudXBkYXRlKHtpZDogbGVhZGVyc2hpcFN0eWxlLmlkfSwgbGVhZGVyc2hpcFN0eWxlLCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCd1cGRhdGVMZWFkZXJzaGlwU3R5bGUgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnb1RvUHJldmlvdXNRdWVzdGlvbihsZWFkZXJzaGlwU3R5bGUpIHtcbiAgICAgICAgcmV0dXJuIExlYWRlcnNoaXBTdHlsZVJlc291cmNlLmdvVG9QcmV2aW91c1F1ZXN0aW9uKHtpZDogbGVhZGVyc2hpcFN0eWxlLmlkfSwgbnVsbCwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignZ29Ub1ByZXZpb3VzUXVlc3Rpb24gZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2xlYWRlcnNoaXAtc3R5bGUnKVxuICAgIC5mYWN0b3J5KCdMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZScsIExlYWRlcnNoaXBTdHlsZVJlc291cmNlKTtcblxuZnVuY3Rpb24gTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2UoJHJlc291cmNlKSB7XG4gICAgdmFyIGFjdGlvbnMgPSB7XG4gICAgICAgICdjcmVhdGUnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvbGVhZGVyc2hpcC1zdHlsZS9jcmVhdGUvJ1xuICAgICAgICB9LFxuICAgICAgICAnZ2V0Jzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvbGVhZGVyc2hpcC1zdHlsZS86aWQvJ1xuICAgICAgICB9LFxuICAgICAgICAnZ2V0TXknOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlLzppZC8nXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRVbmZpbmlzaGVkJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvbGVhZGVyc2hpcC1zdHlsZS91bmZpbmlzaGVkLydcbiAgICAgICAgfSxcbiAgICAgICAgJ3JldGFrZSc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL2xlYWRlcnNoaXAtc3R5bGUvOmlkL3JldGFrZS8nXG4gICAgICAgIH0sXG4gICAgICAgICdzaGFyZSc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL2xlYWRlcnNoaXAtc3R5bGUvOmlkL3NoYXJlLydcbiAgICAgICAgfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL2xlYWRlcnNoaXAtc3R5bGUvOmlkL3VwZGF0ZS8nXG4gICAgICAgIH0sXG4gICAgICAgICdnb1RvUHJldmlvdXNRdWVzdGlvbic6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL2xlYWRlcnNoaXAtc3R5bGUvOmlkL3ByZXZpb3VzLXF1ZXN0aW9uLydcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuICRyZXNvdXJjZSgnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlLzppZC8nLCBudWxsLCBhY3Rpb25zKTtcbn1cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdsZWFkZXJzaGlwLXN0eWxlJylcbiAgICAuY29udHJvbGxlcignTGVhZGVyc2hpcFN0eWxlQ29udHJvbGxlcicsIExlYWRlcnNoaXBTdHlsZUNvbnRyb2xsZXIpO1xuXG5mdW5jdGlvbiBMZWFkZXJzaGlwU3R5bGVDb250cm9sbGVyKExlYWRlcnNoaXBTdHlsZVNlcnZpY2UsIE5vdGlmaWNhdGlvbiwgVXNlclByZWZlcmVuY2VzU2VydmljZSwgYW5hbHl0aWNzLCAkbG9jYXRpb24sICRtb2RhbCwgJHJvb3RTY29wZSwgJHNjb3BlLCAkdGltZW91dCkge1xuICAgIC8qIFNpbmNlIHRoaXMgcGFnZSBjYW4gYmUgdGhlIHJvb3QgZm9yIHNvbWUgdXNlcnMgbGV0J3MgbWFrZSBzdXJlIHdlIGNhcHR1cmUgdGhlIGNvcnJlY3QgcGFnZSAqL1xuICAgIHZhciBsb2NhdGlvbl91cmwgPSAkbG9jYXRpb24udXJsKCkuaW5kZXhPZignL2lkJykgPCAwID8gJy9pZCcgOiAkbG9jYXRpb24udXJsKCk7XG4gICAgYW5hbHl0aWNzLnRyYWNrUGFnZSgkc2NvcGUsICRsb2NhdGlvbi5hYnNVcmwoKSwgbG9jYXRpb25fdXJsKTtcblxuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uYnVzeSA9IHRydWU7XG4gICAgdm0uc2hvd0VtcHR5U2NyZWVuID0gZmFsc2U7XG4gICAgdm0ubXlMZWFkZXJzaGlwU3R5bGUgPSBudWxsO1xuICAgIHZtLnRha2VRdWl6ID0gdGFrZVF1aXo7XG4gICAgYWN0aXZhdGUoKTtcblxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICBnZXRNeUxlYWRlcnNoaXBTdHlsZSgpO1xuXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldE15TGVhZGVyc2hpcFN0eWxlKCkge1xuICAgICAgICB2bS5idXN5ID0gdHJ1ZTtcbiAgICAgICAgTGVhZGVyc2hpcFN0eWxlU2VydmljZS5nZXRNeUxlYWRlcnNoaXBTdHlsZSgpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihsZWFkZXJzaGlwU3R5bGUpe1xuICAgICAgICAgICAgICAgIHZtLm15TGVhZGVyc2hpcFN0eWxlID0gbGVhZGVyc2hpcFN0eWxlO1xuICAgICAgICAgICAgICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdm0uYnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdGFrZVF1aXooKSB7XG4gICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuICAgICAgICAgICAgYW5pbWF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgd2luZG93Q2xhc3M6ICd4eC1kaWFsb2cgZmFkZSB6b29tJyxcbiAgICAgICAgICAgIGJhY2tkcm9wOiAnc3RhdGljJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3N0YXRpYy9hbmd1bGFyL2xlYWRlcnNoaXAtc3R5bGUvcGFydGlhbHMvX21vZGFscy9xdWl6Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ1F1aXpDb250cm9sbGVyIGFzIHF1aXonLFxuICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICBsZWFkZXJzaGlwU3R5bGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2bS5teUxlYWRlcnNoaXBTdHlsZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKFxuICAgICAgICAgICAgZnVuY3Rpb24gKGxlYWRlcnNoaXBTdHlsZSkge1xuICAgICAgICAgICAgICAgIHZtLm15TGVhZGVyc2hpcFN0eWxlID0gbGVhZGVyc2hpcFN0eWxlO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH07XG59XG4iLCI7KGZ1bmN0aW9uKCkge1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdsZWFkZXJzaGlwLXN0eWxlJywgWyduZ1JvdXRlJywgJ3VpLW5vdGlmaWNhdGlvbiddKTtcblxuYW5ndWxhclxuICAgIC5tb2R1bGUoJ2xlYWRlcnNoaXAtc3R5bGUnKVxuICAgIC5jb250cm9sbGVyKCdRdWl6Q29udHJvbGxlcicsIFF1aXpDb250cm9sbGVyKTtcblxuZnVuY3Rpb24gUXVpekNvbnRyb2xsZXIoYW5hbHl0aWNzLCBMZWFkZXJzaGlwU3R5bGVTZXJ2aWNlLCBOb3RpZmljYXRpb24sIGxlYWRlcnNoaXBTdHlsZSwgJGxvY2F0aW9uLCAkbW9kYWwsICRtb2RhbEluc3RhbmNlLCAkcm9vdFNjb3BlLCAkc2NvcGUpIHtcbiAgICB2YXIgbG9jYXRpb25fdXJsID0gJy9xdWl6LycgKyBsZWFkZXJzaGlwU3R5bGUuaWQ7XG4gICAgYW5hbHl0aWNzLnRyYWNrUGFnZSgkc2NvcGUsICRsb2NhdGlvbi5hYnNVcmwoKSwgbG9jYXRpb25fdXJsKTtcbiAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgdm0ubGVhZGVyc2hpcFN0eWxlID0gbGVhZGVyc2hpcFN0eWxlO1xuICAgIHZtLnBhbmVsX2luZGV4ID0gMDtcbiAgICB2bS5idXN5ID0gZmFsc2U7XG4gICAgdm0uY2FuY2VsID0gY2FuY2VsO1xuICAgIHZtLmNsb3NlID0gY2xvc2U7XG4gICAgdm0uYW5zd2VyUXVlc3Rpb24gPSBhbnN3ZXJRdWVzdGlvbjtcbiAgICB2bS5wcmV2aW91c1F1ZXN0aW9uID0gcHJldmlvdXNRdWVzdGlvbjtcbiAgICB2bS5zdGFydE92ZXIgPSBzdGFydE92ZXI7XG4gICAgdm0uc2hvd1dob0NhblNlZVRoaXMgPSBzaG93V2hvQ2FuU2VlVGhpcztcbiAgICB2bS5maW5pc2ggPSBmaW5pc2g7XG4gICAgdm0uZW1wbG95ZWUgPSAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLmVtcGxveWVlO1xuICAgIHZtLnNlbGVjdGVkQW5zd2VyID0gbnVsbDtcblxuICAgIGFjdGl2YXRlKClcblxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICBpZiAobGVhZGVyc2hpcFN0eWxlLm5leHRfcXVlc3Rpb24pIHtcbiAgICAgICAgICAgIHZtLnNlbGVjdGVkQW5zd2VyID0gbGVhZGVyc2hpcFN0eWxlLm5leHRfcXVlc3Rpb24uYW5zd2VyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKHZtLmxlYWRlcnNoaXBTdHlsZSlcbiAgICAgICAgTm90aWZpY2F0aW9uLnN1Y2Nlc3MoJ1lvdXIgcHJvZ3Jlc3MgaGFzIGJlZW4gc2F2ZWQuJylcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhbnN3ZXJRdWVzdGlvbihhbnN3ZXIpIHtcbiAgICAgICAgdm0uYnVzeSA9IHRydWU7XG4gICAgICAgIHZtLmxlYWRlcnNoaXBTdHlsZS5sYXN0X3F1ZXN0aW9uX2Fuc3dlcmVkID0gdm0ubGVhZGVyc2hpcFN0eWxlLm5leHRfcXVlc3Rpb24uaWQ7XG4gICAgICAgIGlmICh2bS5sZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbi5hbnN3ZXIgJiYgdm0ubGVhZGVyc2hpcFN0eWxlLm5leHRfcXVlc3Rpb24uYW5zd2VyLmlkICE9IGFuc3dlci5pZCkge1xuICAgICAgICAgICAgdmFyIGFuc3dlcnMgPSBbYW5zd2VyLmlkXTtcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5sZWFkZXJzaGlwU3R5bGUuYW5zd2VycywgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodm0ubGVhZGVyc2hpcFN0eWxlLm5leHRfcXVlc3Rpb24uYW5zd2VyLmlkICE9IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGFuc3dlcnMucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHZtLmxlYWRlcnNoaXBTdHlsZS5hbnN3ZXJzID0gYW5zd2VycztcbiAgICAgICAgfVxuICAgICAgICB2bS5sZWFkZXJzaGlwU3R5bGUuYXNzZXNzb3IgPSB2bS5sZWFkZXJzaGlwU3R5bGUuYXNzZXNzb3IuaWQ7XG4gICAgICAgIExlYWRlcnNoaXBTdHlsZVNlcnZpY2UudXBkYXRlTGVhZGVyc2hpcFN0eWxlKHZtLmxlYWRlcnNoaXBTdHlsZSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIGlmICh2bS5sZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZEFuc3dlciA9IHZtLmxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uLmFuc3dlcjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZEFuc3dlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmV2aW91c1F1ZXN0aW9uKCl7XG4gICAgICAgIHZtLmJ1c3kgPSB0cnVlO1xuICAgICAgICBMZWFkZXJzaGlwU3R5bGVTZXJ2aWNlLmdvVG9QcmV2aW91c1F1ZXN0aW9uKHZtLmxlYWRlcnNoaXBTdHlsZSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIGlmICh2bS5sZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZEFuc3dlciA9IHZtLmxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uLmFuc3dlcjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZEFuc3dlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdGFydE92ZXIoKSB7XG4gICAgICAgIHZtLmJ1c3kgPSB0cnVlO1xuICAgICAgICBMZWFkZXJzaGlwU3R5bGVTZXJ2aWNlLnJldGFrZUxlYWRlcnNoaXBTdHlsZSh2bS5sZWFkZXJzaGlwU3R5bGUpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgICAgIHZtLnBhbmVsX2luZGV4PTA7XG4gICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRBbnN3ZXI9bnVsbDtcbiAgICAgICAgICAgICAgICB2bS5sZWFkZXJzaGlwU3R5bGUgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgdm0uYnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbmlzaCgpIHtcbiAgICAgICAgdm0uYnVzeSA9IHRydWU7XG4gICAgICAgIExlYWRlcnNoaXBTdHlsZVNlcnZpY2UudXBkYXRlRW1wbG95ZWVab25lKHtpZDogdm0ubGVhZGVyc2hpcFN0eWxlLmlkLCB6b25lOiB2bS5sZWFkZXJzaGlwU3R5bGUuem9uZS5pZCwgbm90ZXM6IHZtLmxlYWRlcnNoaXBTdHlsZS5ub3RlcywgY29tcGxldGVkOiB0cnVlfSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIE5vdGlmaWNhdGlvbi5zdWNjZXNzKCdZb3VyIHF1aXogcmVzdWx0cyBoYXMgYmVlbiBzaGFyZWQuJylcbiAgICAgICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZShyZXN1bHQpO1xuICAgICAgICAgICAgICAgIGlmIChsZWFkZXJzaGlwU3R5bGUuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9pZC8nICsgcmVzdWx0LmlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdm0uYnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNob3dXaG9DYW5TZWVUaGlzKGVtcGxveWVlX2lkLCBlbXBsb3llZV92aWV3KSB7XG4gICAgICAgICRtb2RhbC5vcGVuKHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIGJhY2tkcm9wOiAnc3RhdGljJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3N0YXRpYy9hbmd1bGFyL3BhcnRpYWxzL19tb2RhbHMvd2hvLWNhbi1zZWUtdGhpcy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdTdXBwb3J0VGVhbUN0cmwnLFxuICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgIGVtcGxveWVlX3ZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVtcGxveWVlX3ZpZXdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVtcGxveWVlX2lkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbXBsb3llZV9pZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdsZWFkZXJzaGlwLXN0eWxlJylcbiAgICAuZmFjdG9yeSgnTGVhZGVyc2hpcFN0eWxlU2VydmljZScsIExlYWRlcnNoaXBTdHlsZVNlcnZpY2UpO1xuXG5mdW5jdGlvbiBMZWFkZXJzaGlwU3R5bGVTZXJ2aWNlKCRodHRwLCAkbG9nLCBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNyZWF0ZUxlYWRlcnNoaXBTdHlsZTogY3JlYXRlTGVhZGVyc2hpcFN0eWxlLFxuICAgICAgICBnZXRMZWFkZXJzaGlwU3R5bGU6IGdldExlYWRlcnNoaXBTdHlsZSxcbiAgICAgICAgZ2V0TXlMZWFkZXJzaGlwU3R5bGU6IGdldE15TGVhZGVyc2hpcFN0eWxlLFxuICAgICAgICBnZXRNeVVuZmluaXNoZWRMZWFkZXJzaGlwU3R5bGU6IGdldE15VW5maW5pc2hlZExlYWRlcnNoaXBTdHlsZSxcbiAgICAgICAgcmV0YWtlTGVhZGVyc2hpcFN0eWxlOiByZXRha2VMZWFkZXJzaGlwU3R5bGUsXG4gICAgICAgIHNoYXJlTGVhZGVyc2hpcFN0eWxlOiBzaGFyZUxlYWRlcnNoaXBTdHlsZSxcbiAgICAgICAgdXBkYXRlTGVhZGVyc2hpcFN0eWxlOiB1cGRhdGVMZWFkZXJzaGlwU3R5bGUsXG4gICAgICAgIGdvVG9QcmV2aW91c1F1ZXN0aW9uOiBnb1RvUHJldmlvdXNRdWVzdGlvblxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVMZWFkZXJzaGlwU3R5bGUobGVhZGVyc2hpcFN0eWxlKSB7XG4gICAgICAgIHJldHVybiBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZS5jcmVhdGUobGVhZGVyc2hpcFN0eWxlLCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdjcmVhdGVMZWFkZXJzaGlwU3R5bGUgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRMZWFkZXJzaGlwU3R5bGUobGVhZGVyc2hpcFN0eWxlSWQpIHtcbiAgICAgICAgcmV0dXJuIExlYWRlcnNoaXBTdHlsZVJlc291cmNlLmdldCh7aWQ6IGxlYWRlcnNoaXBTdHlsZUlkfSwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignZ2V0TGVhZGVyc2hpcFN0eWxlIGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0TXlMZWFkZXJzaGlwU3R5bGUoKSB7XG4gICAgICAgIHJldHVybiBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZS5nZXRNeSh7aWQ6ICdteSd9LCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdnZXRNeUxlYWRlcnNoaXBTdHlsZSBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE15VW5maW5pc2hlZExlYWRlcnNoaXBTdHlsZSgpIHtcbiAgICAgICAgcmV0dXJuIExlYWRlcnNoaXBTdHlsZVJlc291cmNlLmdldFVuZmluaXNoZWQobnVsbCwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignZ2V0VW5maW5pc2hlZCBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJldGFrZUxlYWRlcnNoaXBTdHlsZShsZWFkZXJzaGlwU3R5bGUpIHtcbiAgICAgICAgcmV0dXJuIExlYWRlcnNoaXBTdHlsZVJlc291cmNlLnJldGFrZSh7aWQ6IGxlYWRlcnNoaXBTdHlsZS5pZH0sIGxlYWRlcnNoaXBTdHlsZSwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcigncmV0YWtlTGVhZGVyc2hpcFN0eWxlIGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2hhcmVMZWFkZXJzaGlwU3R5bGUobGVhZGVyc2hpcFN0eWxlKSB7XG4gICAgICAgIHJldHVybiBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZS5zaGFyZSh7aWQ6IGxlYWRlcnNoaXBTdHlsZS5pZH0sIGxlYWRlcnNoaXBTdHlsZSwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignc2hhcmVMZWFkZXJzaGlwU3R5bGUgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVMZWFkZXJzaGlwU3R5bGUobGVhZGVyc2hpcFN0eWxlKSB7XG4gICAgICAgIHJldHVybiBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZS51cGRhdGUoe2lkOiBsZWFkZXJzaGlwU3R5bGUuaWR9LCBsZWFkZXJzaGlwU3R5bGUsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ3VwZGF0ZUxlYWRlcnNoaXBTdHlsZSBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdvVG9QcmV2aW91c1F1ZXN0aW9uKGxlYWRlcnNoaXBTdHlsZSkge1xuICAgICAgICByZXR1cm4gTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2UuZ29Ub1ByZXZpb3VzUXVlc3Rpb24oe2lkOiBsZWFkZXJzaGlwU3R5bGUuaWR9LCBudWxsLCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdnb1RvUHJldmlvdXNRdWVzdGlvbiBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdsZWFkZXJzaGlwLXN0eWxlJylcbiAgICAuZmFjdG9yeSgnTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2UnLCBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZSk7XG5cbmZ1bmN0aW9uIExlYWRlcnNoaXBTdHlsZVJlc291cmNlKCRyZXNvdXJjZSkge1xuICAgIHZhciBhY3Rpb25zID0ge1xuICAgICAgICAnY3JlYXRlJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL2xlYWRlcnNoaXAtc3R5bGUvY3JlYXRlLydcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldCc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL2xlYWRlcnNoaXAtc3R5bGUvOmlkLydcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldE15Jzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvbGVhZGVyc2hpcC1zdHlsZS86aWQvJ1xuICAgICAgICB9LFxuICAgICAgICAnZ2V0VW5maW5pc2hlZCc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL2xlYWRlcnNoaXAtc3R5bGUvdW5maW5pc2hlZC8nXG4gICAgICAgIH0sXG4gICAgICAgICdyZXRha2UnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlLzppZC9yZXRha2UvJ1xuICAgICAgICB9LFxuICAgICAgICAnc2hhcmUnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlLzppZC9zaGFyZS8nXG4gICAgICAgIH0sXG4gICAgICAgICd1cGRhdGUnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlLzppZC91cGRhdGUvJ1xuICAgICAgICB9LFxuICAgICAgICAnZ29Ub1ByZXZpb3VzUXVlc3Rpb24nOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlLzppZC9wcmV2aW91cy1xdWVzdGlvbi8nXG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiAkcmVzb3VyY2UoJy9hcGkvdjEvbGVhZGVyc2hpcC1zdHlsZS86aWQvJywgbnVsbCwgYWN0aW9ucyk7XG59XG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdsZWFkZXJzaGlwLXN0eWxlJylcbiAgICAuY29udHJvbGxlcignTGVhZGVyc2hpcFN0eWxlQ29udHJvbGxlcicsIExlYWRlcnNoaXBTdHlsZUNvbnRyb2xsZXIpO1xuXG5mdW5jdGlvbiBMZWFkZXJzaGlwU3R5bGVDb250cm9sbGVyKExlYWRlcnNoaXBTdHlsZVNlcnZpY2UsIE5vdGlmaWNhdGlvbiwgVXNlclByZWZlcmVuY2VzU2VydmljZSwgYW5hbHl0aWNzLCAkbG9jYXRpb24sICRtb2RhbCwgJHJvb3RTY29wZSwgJHNjb3BlLCAkdGltZW91dCkge1xuICAgIC8qIFNpbmNlIHRoaXMgcGFnZSBjYW4gYmUgdGhlIHJvb3QgZm9yIHNvbWUgdXNlcnMgbGV0J3MgbWFrZSBzdXJlIHdlIGNhcHR1cmUgdGhlIGNvcnJlY3QgcGFnZSAqL1xuICAgIHZhciBsb2NhdGlvbl91cmwgPSAkbG9jYXRpb24udXJsKCkuaW5kZXhPZignL2lkJykgPCAwID8gJy9pZCcgOiAkbG9jYXRpb24udXJsKCk7XG4gICAgYW5hbHl0aWNzLnRyYWNrUGFnZSgkc2NvcGUsICRsb2NhdGlvbi5hYnNVcmwoKSwgbG9jYXRpb25fdXJsKTtcblxuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uYnVzeSA9IHRydWU7XG4gICAgdm0uc2hvd0VtcHR5U2NyZWVuID0gZmFsc2U7XG4gICAgdm0ubXlMZWFkZXJzaGlwU3R5bGUgPSBudWxsO1xuICAgIHZtLnRha2VRdWl6ID0gdGFrZVF1aXo7XG4gICAgYWN0aXZhdGUoKTtcblxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICBnZXRNeUxlYWRlcnNoaXBTdHlsZSgpO1xuXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldE15TGVhZGVyc2hpcFN0eWxlKCkge1xuICAgICAgICB2bS5idXN5ID0gdHJ1ZTtcbiAgICAgICAgTGVhZGVyc2hpcFN0eWxlU2VydmljZS5nZXRNeUxlYWRlcnNoaXBTdHlsZSgpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihsZWFkZXJzaGlwU3R5bGUpe1xuICAgICAgICAgICAgICAgIHZtLm15TGVhZGVyc2hpcFN0eWxlID0gbGVhZGVyc2hpcFN0eWxlO1xuICAgICAgICAgICAgICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdm0uYnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdGFrZVF1aXooKSB7XG4gICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuICAgICAgICAgICAgYW5pbWF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgd2luZG93Q2xhc3M6ICd4eC1kaWFsb2cgZmFkZSB6b29tJyxcbiAgICAgICAgICAgIGJhY2tkcm9wOiAnc3RhdGljJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3N0YXRpYy9hbmd1bGFyL2xlYWRlcnNoaXAtc3R5bGUvcGFydGlhbHMvX21vZGFscy9xdWl6Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ1F1aXpDb250cm9sbGVyIGFzIHF1aXonLFxuICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICBsZWFkZXJzaGlwU3R5bGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2bS5teUxlYWRlcnNoaXBTdHlsZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKFxuICAgICAgICAgICAgZnVuY3Rpb24gKGxlYWRlcnNoaXBTdHlsZSkge1xuICAgICAgICAgICAgICAgIHZtLm15TGVhZGVyc2hpcFN0eWxlID0gbGVhZGVyc2hpcFN0eWxlO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH07XG59XG59KCkpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
