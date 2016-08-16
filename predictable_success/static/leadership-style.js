;(function() {
"use strict";

QuizController.$inject = ["analytics", "LeadershipStyleService", "Notification", "leadershipStyle", "$location", "$modal", "$modalInstance", "$rootScope", "$scope"];
LeadershipStyleService.$inject = ["$http", "$log", "LeadershipStyleResource"];
LeadershipStyleResource.$inject = ["$resource"];
LeadershipStyleController.$inject = ["LeadershipStyleService", "LeadershipStyleRequestService", "analytics", "$location", "$modal", "$rootScope", "$scope", "$timeout"];
LeadershipStyleRequestService.$inject = ["$log", "LeadershipStyleRequestResource"];
LeadershipStyleRequestResource.$inject = ["$resource"];
    LeadershipStyleRequestController.$inject = ["panel", "LeadershipStyleRequestService", "Users", "$timeout", "$modalInstance", "$rootScope"];
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

function LeadershipStyleController(LeadershipStyleService, LeadershipStyleRequestService, analytics, $location, $modal, $rootScope, $scope, $timeout) {
    /* Since this page can be the root for some users let's make sure we capture the correct page */
    var location_url = $location.url().indexOf('/id') < 0 ? '/id' : $location.url();
    analytics.trackPage($scope, $location.absUrl(), location_url);

    var vm = this;
    vm.busy = true;
    vm.showEmptyScreen = false;
    vm.myLeadershipStyle = null;
    vm.takeQuiz = takeQuiz;
    vm.requestLeadershipStyle = requestLeadershipStyle;
    $rootScope.successRequestMessage = false;
    $rootScope.hideMessage = false;
    $rootScope.hideRequestMessage = false;
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

    function getMyRecentlySentRequests() {
        LeadershipStyleService.getMyRecentlySentRequests()
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
}

angular
    .module('leadership-style')
    .factory('LeadershipStyleRequestService', LeadershipStyleRequestService);

function LeadershipStyleRequestService($log, LeadershipStyleRequestResource) {
    return {
        sendLeadershipStyleRequests: sendLeadershipStyleRequests,
        getMyRecentlySentRequests: getMyRecentlySentRequests,
        getRequest: getRequest
    };

    function sendLeadershipStyleRequests(reviewers, message) {
        var requests = [];

        for(var i=0; i < reviewers.length; i++) {
            var reviewer_id = reviewers[i].pk ? reviewers[i].pk : reviewers[i].id
            requests.push({reviewer: reviewer_id, message: message});
        }

        return LeadershipStyleRequestResource.sendLeadershipStyleRequests(requests, success, fail).$promise;

        function success(sentLeadershipStyleRequests) {
            return sentLeadershipStyleRequests;
        }

        function fail(response) {
            $log.error('sendLeadershipStyleRequests failed');
        }
    }

    function getMyRecentlySentRequests() {
        return LeadershipStyleRequestResource.getMyRecentlySentRequests(null, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getMyRecentlySentRequests failed');
        }
    }

    function getRequest(id) {
        return LeadershipStyleRequestResource.getRequest({id: id}, null, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getRequest failed');
        }
    }
}
angular
    .module('leadership-style')
    .factory('LeadershipStyleRequestResource', LeadershipStyleRequestResource);

function LeadershipStyleRequestResource($resource) {
    var actions = {
        'getMyRecentlySentRequests': {
            url: '/api/v1/leadership-style/requests/recently-sent/',
            method: 'GET',
            isArray: true
        },
        'getLeadershipStyleRequests': {
            url: '/api/v1/leadership-style/requests/todo/',
            method: 'GET',
            isArray: true
        },
        'getRequest': {
            method: 'GET',
        },
        'sendLeadershipStyleRequests': {
            method: 'POST',
            isArray: true
        },
    };
    return $resource('/api/v1/leadership-style/requests/:id/', null, actions);
}

    angular
        .module('leadership-style')
        .controller('LeadershipStyleRequestController', LeadershipStyleRequestController);

    function LeadershipStyleRequestController(panel, LeadershipStyleRequestService, Users, $timeout, $modalInstance, $rootScope) {
        var vm = this;
        vm.potentialReviewers = [];
        vm.subject = $rootScope.currentUser.employee;
        vm.message = '';
        vm.sendLeadershipStyleRequests = sendLeadershipStyleRequests;
        vm.stepNext = stepNext;
        vm.stepBack = stepBack;
        vm.cancel = cancel;
        vm.panel_index = panel;
        vm.enableSend = true;

        activate();

        function activate() {
            getPotentialReviewers();
        }

        function getPotentialReviewers() {
            return Users.query().$promise
                .then(function(data) {
                    vm.potentialReviewers = data;
                    return vm.potentialReviewers;
                });
        }

        function sendLeadershipStyleRequests() {
            vm.enableSend = false;
            LeadershipStyleRequestService.sendLeadershipStyleRequests(vm.selectedReviewers, vm.message)
                .then(function(sentPerceptioRequests) {

                    /* Big success message */
                    $rootScope.successRequestMessage = true;
                    $rootScope.successRequestMessageRecipient = vm.selectedReviewers;

                    /* Hide success message after a few seconds */
                    $timeout(function() {
                        $rootScope.hideRequestMessage = true;
                    }, 10000);

                    $modalInstance.close(sentPerceptioRequests)
                });
        }

        function stepNext() {
            vm.panel_index++;
        }

        function stepBack() {
            vm.panel_index--;
        }

        function cancel() {
            $modalInstance.dismiss();
        }
    }
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxlYWRlcnNoaXAtc3R5bGUubW9kdWxlLmpzIiwicXVpei5jb250cm9sbGVyLmpzIiwibGVhZGVyc2hpcC1zdHlsZS5zZXJ2aWNlLmpzIiwibGVhZGVyc2hpcC1zdHlsZS5yZXNvdXJjZS5qcyIsImxlYWRlcnNoaXAtc3R5bGUuY29udHJvbGxlci5qcyIsImxlYWRlcnNoaXAtc3R5bGUtcmVxdWVzdC5zZXJ2aWNlLmpzIiwibGVhZGVyc2hpcC1zdHlsZS1yZXF1ZXN0LnJlc291cmNlLmpzIiwibGVhZGVyc2hpcC1zdHlsZS1yZXF1ZXN0LmNvbnRyb2xsZXIuanMiLCJsZWFkZXJzaGlwLXN0eWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLENBQUEsQ0FBQSxXQUFBO0FBQ0E7Ozs7Ozs7OztBQ0RBO0tBQ0EsT0FBQSxvQkFBQSxDQUFBLFdBQUE7O0FBRUE7S0FDQSxPQUFBO0tBQ0EsV0FBQSxrQkFBQTs7QUFFQSxTQUFBLGVBQUEsV0FBQSx3QkFBQSxjQUFBLGlCQUFBLFdBQUEsUUFBQSxnQkFBQSxZQUFBLFFBQUE7SUFDQSxJQUFBLGVBQUEsV0FBQSxnQkFBQTtJQUNBLFVBQUEsVUFBQSxRQUFBLFVBQUEsVUFBQTtJQUNBLElBQUEsS0FBQTs7SUFFQSxHQUFBLGtCQUFBO0lBQ0EsR0FBQSxjQUFBO0lBQ0EsR0FBQSxPQUFBO0lBQ0EsR0FBQSxTQUFBO0lBQ0EsR0FBQSxRQUFBO0lBQ0EsR0FBQSxpQkFBQTtJQUNBLEdBQUEsbUJBQUE7SUFDQSxHQUFBLFlBQUE7SUFDQSxHQUFBLG9CQUFBO0lBQ0EsR0FBQSxTQUFBO0lBQ0EsR0FBQSxXQUFBLFdBQUEsWUFBQTtJQUNBLEdBQUEsaUJBQUE7SUFDQSxHQUFBLFNBQUE7O0lBRUE7O0lBRUEsU0FBQSxXQUFBO1FBQ0EsSUFBQSxnQkFBQSxlQUFBO1lBQ0EsR0FBQSxpQkFBQSxnQkFBQSxjQUFBOztRQUVBOzs7SUFHQSxTQUFBLGFBQUE7UUFDQSxJQUFBLEdBQUEsZ0JBQUEsYUFBQSxDQUFBLEdBQUEsZ0JBQUEsZUFBQTtZQUNBLElBQUEsQ0FBQSxHQUFBLGdCQUFBLFdBQUE7Z0JBQ0EsR0FBQSxnQkFBQSxXQUFBLEdBQUEsZ0JBQUEsU0FBQTtnQkFDQSxHQUFBLGdCQUFBLFlBQUE7Z0JBQ0EsdUJBQUEsc0JBQUEsR0FBQTs2QkFDQSxLQUFBLFNBQUEsT0FBQTtnQ0FDQSxHQUFBLGtCQUFBO2dDQUNBLEdBQUEsT0FBQTs7OztZQUlBLEdBQUEsT0FBQSxLQUFBLENBQUEsVUFBQSxhQUFBLFNBQUEsR0FBQSxnQkFBQTtZQUNBLEdBQUEsT0FBQSxLQUFBLENBQUEsVUFBQSxZQUFBLFNBQUEsR0FBQSxnQkFBQTtZQUNBLEdBQUEsT0FBQSxLQUFBLENBQUEsVUFBQSxhQUFBLFNBQUEsR0FBQSxnQkFBQTtZQUNBLEdBQUEsT0FBQSxLQUFBLENBQUEsVUFBQSxhQUFBLFNBQUEsR0FBQSxnQkFBQTs7OztJQUlBLFNBQUEsU0FBQTtRQUNBLGVBQUE7OztJQUdBLFNBQUEsUUFBQTtRQUNBLGVBQUEsTUFBQSxHQUFBO1FBQ0EsSUFBQSxDQUFBLEdBQUEsZ0JBQUEsV0FBQTtZQUNBLGFBQUEsUUFBQTs7OztJQUlBLFNBQUEsZUFBQSxRQUFBO1FBQ0EsR0FBQSxPQUFBO1FBQ0EsR0FBQSxnQkFBQSx5QkFBQSxHQUFBLGdCQUFBLGNBQUE7UUFDQSxJQUFBLEdBQUEsZ0JBQUEsY0FBQSxRQUFBO1lBQ0EsSUFBQSxHQUFBLGdCQUFBLGNBQUEsT0FBQSxNQUFBLE9BQUEsSUFBQTtnQkFDQSxJQUFBLFVBQUEsQ0FBQSxPQUFBO2dCQUNBLFFBQUEsUUFBQSxHQUFBLGdCQUFBLFNBQUEsVUFBQSxPQUFBO29CQUNBLElBQUEsR0FBQSxnQkFBQSxjQUFBLE9BQUEsTUFBQSxPQUFBO3dCQUNBLFFBQUEsS0FBQTs7O2dCQUdBLEdBQUEsZ0JBQUEsVUFBQTs7ZUFFQTtZQUNBLEdBQUEsZ0JBQUEsUUFBQSxLQUFBLE9BQUE7O1FBRUEsR0FBQSxnQkFBQSxXQUFBLEdBQUEsZ0JBQUEsU0FBQTtRQUNBLHVCQUFBLHNCQUFBLEdBQUE7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LFlBQUE7UUFDQSxHQUFBLFVBQUE7UUFDQSxHQUFBLDhCQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxTQUFBO1FBQ0EsR0FBQSxjQUFBO1FBQ0EsR0FBQSxhQUFBOztRQUVBOztRQUVBLFNBQUEsV0FBQTtZQUNBOzs7UUFHQSxTQUFBLHdCQUFBO1lBQ0EsT0FBQSxNQUFBLFFBQUE7aUJBQ0EsS0FBQSxTQUFBLE1BQUE7b0JBQ0EsR0FBQSxxQkFBQTtvQkFDQSxPQUFBLEdBQUE7Ozs7UUFJQSxTQUFBLDhCQUFBO1lBQ0EsR0FBQSxhQUFBO1lBQ0EsOEJBQUEsNEJBQUEsR0FBQSxtQkFBQSxHQUFBO2lCQUNBLEtBQUEsU0FBQSx1QkFBQTs7O29CQUdBLFdBQUEsd0JBQUE7b0JBQ0EsV0FBQSxpQ0FBQSxHQUFBOzs7b0JBR0EsU0FBQSxXQUFBO3dCQUNBLFdBQUEscUJBQUE7dUJBQ0E7O29CQUVBLGVBQUEsTUFBQTs7OztRQUlBLFNBQUEsV0FBQTtZQUNBLEdBQUE7OztRQUdBLFNBQUEsV0FBQTtZQUNBLEdBQUE7OztRQUdBLFNBQUEsU0FBQTtZQUNBLGVBQUE7Ozs7QUNtZUEiLCJmaWxlIjoibGVhZGVyc2hpcC1zdHlsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXJcbiAgICAubW9kdWxlKCdsZWFkZXJzaGlwLXN0eWxlJywgWyduZ1JvdXRlJywgJ3VpLW5vdGlmaWNhdGlvbiddKTtcbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdsZWFkZXJzaGlwLXN0eWxlJylcbiAgICAuY29udHJvbGxlcignUXVpekNvbnRyb2xsZXInLCBRdWl6Q29udHJvbGxlcik7XG5cbmZ1bmN0aW9uIFF1aXpDb250cm9sbGVyKGFuYWx5dGljcywgTGVhZGVyc2hpcFN0eWxlU2VydmljZSwgTm90aWZpY2F0aW9uLCBsZWFkZXJzaGlwU3R5bGUsICRsb2NhdGlvbiwgJG1vZGFsLCAkbW9kYWxJbnN0YW5jZSwgJHJvb3RTY29wZSwgJHNjb3BlKSB7XG4gICAgdmFyIGxvY2F0aW9uX3VybCA9ICcvcXVpei8nICsgbGVhZGVyc2hpcFN0eWxlLmlkO1xuICAgIGFuYWx5dGljcy50cmFja1BhZ2UoJHNjb3BlLCAkbG9jYXRpb24uYWJzVXJsKCksIGxvY2F0aW9uX3VybCk7XG4gICAgdmFyIHZtID0gdGhpcztcblxuICAgIHZtLmxlYWRlcnNoaXBTdHlsZSA9IGxlYWRlcnNoaXBTdHlsZTtcbiAgICB2bS5wYW5lbF9pbmRleCA9IDA7XG4gICAgdm0uYnVzeSA9IGZhbHNlO1xuICAgIHZtLmNhbmNlbCA9IGNhbmNlbDtcbiAgICB2bS5jbG9zZSA9IGNsb3NlO1xuICAgIHZtLmFuc3dlclF1ZXN0aW9uID0gYW5zd2VyUXVlc3Rpb247XG4gICAgdm0ucHJldmlvdXNRdWVzdGlvbiA9IHByZXZpb3VzUXVlc3Rpb247XG4gICAgdm0uc3RhcnRPdmVyID0gc3RhcnRPdmVyO1xuICAgIHZtLnNob3dXaG9DYW5TZWVUaGlzID0gc2hvd1dob0NhblNlZVRoaXM7XG4gICAgdm0uZmluaXNoID0gZmluaXNoO1xuICAgIHZtLmVtcGxveWVlID0gJHJvb3RTY29wZS5jdXJyZW50VXNlci5lbXBsb3llZTtcbiAgICB2bS5zZWxlY3RlZEFuc3dlciA9IG51bGw7XG4gICAgdm0uc2NvcmVzID0gW107XG5cbiAgICBhY3RpdmF0ZSgpXG5cbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgaWYgKGxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uKSB7XG4gICAgICAgICAgICB2bS5zZWxlY3RlZEFuc3dlciA9IGxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uLmFuc3dlcjtcbiAgICAgICAgfVxuICAgICAgICBpc0NvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNDb21wbGV0ZSgpIHtcbiAgICAgICAgaWYgKHZtLmxlYWRlcnNoaXBTdHlsZS5jb21wbGV0ZWQgfHwgIXZtLmxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uKSB7XG4gICAgICAgICAgICBpZiAoIXZtLmxlYWRlcnNoaXBTdHlsZS5jb21wbGV0ZWQpIHtcbiAgICAgICAgICAgICAgICB2bS5sZWFkZXJzaGlwU3R5bGUuYXNzZXNzb3IgPSB2bS5sZWFkZXJzaGlwU3R5bGUuYXNzZXNzb3IuaWQ7XG4gICAgICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlLmNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgTGVhZGVyc2hpcFN0eWxlU2VydmljZS51cGRhdGVMZWFkZXJzaGlwU3R5bGUodm0ubGVhZGVyc2hpcFN0eWxlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmxlYWRlcnNoaXBTdHlsZSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uYnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2bS5zY29yZXMucHVzaCh7J3N0eWxlJyA6ICdWaXNpb25hcnknLCAnc2NvcmUnOiB2bS5sZWFkZXJzaGlwU3R5bGUudmlzaW9uYXJ5X3Njb3JlfSk7XG4gICAgICAgICAgICB2bS5zY29yZXMucHVzaCh7J3N0eWxlJyA6ICdPcGVyYXRvcicsICdzY29yZSc6IHZtLmxlYWRlcnNoaXBTdHlsZS5vcGVyYXRvcl9zY29yZX0pO1xuICAgICAgICAgICAgdm0uc2NvcmVzLnB1c2goeydzdHlsZScgOiAnUHJvY2Vzc29yJywgJ3Njb3JlJzogdm0ubGVhZGVyc2hpcFN0eWxlLnByb2Nlc3Nvcl9zY29yZX0pO1xuICAgICAgICAgICAgdm0uc2NvcmVzLnB1c2goeydzdHlsZScgOiAnU3luZXJnaXN0JywgJ3Njb3JlJzogdm0ubGVhZGVyc2hpcFN0eWxlLnN5bmVyZ2lzdF9zY29yZX0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKHZtLmxlYWRlcnNoaXBTdHlsZSlcbiAgICAgICAgaWYgKCF2bS5sZWFkZXJzaGlwU3R5bGUuY29tcGxldGVkKSB7XG4gICAgICAgICAgICBOb3RpZmljYXRpb24uc3VjY2VzcygnWW91ciBwcm9ncmVzcyBoYXMgYmVlbiBzYXZlZC4nKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYW5zd2VyUXVlc3Rpb24oYW5zd2VyKSB7XG4gICAgICAgIHZtLmJ1c3kgPSB0cnVlO1xuICAgICAgICB2bS5sZWFkZXJzaGlwU3R5bGUubGFzdF9xdWVzdGlvbl9hbnN3ZXJlZCA9IHZtLmxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uLmlkO1xuICAgICAgICBpZiAodm0ubGVhZGVyc2hpcFN0eWxlLm5leHRfcXVlc3Rpb24uYW5zd2VyKSB7XG4gICAgICAgICAgICBpZiAodm0ubGVhZGVyc2hpcFN0eWxlLm5leHRfcXVlc3Rpb24uYW5zd2VyLmlkICE9IGFuc3dlci5pZCkge1xuICAgICAgICAgICAgICAgIHZhciBhbnN3ZXJzID0gW2Fuc3dlci5pZF07XG4gICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLmxlYWRlcnNoaXBTdHlsZS5hbnN3ZXJzLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZtLmxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uLmFuc3dlci5pZCAhPSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2Vycy5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlLmFuc3dlcnMgPSBhbnN3ZXJzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlLmFuc3dlcnMucHVzaChhbnN3ZXIuaWQpO1xuICAgICAgICB9XG4gICAgICAgIHZtLmxlYWRlcnNoaXBTdHlsZS5hc3Nlc3NvciA9IHZtLmxlYWRlcnNoaXBTdHlsZS5hc3Nlc3Nvci5pZDtcbiAgICAgICAgTGVhZGVyc2hpcFN0eWxlU2VydmljZS51cGRhdGVMZWFkZXJzaGlwU3R5bGUodm0ubGVhZGVyc2hpcFN0eWxlKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgICAgICAgICB2bS5sZWFkZXJzaGlwU3R5bGUgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgaXNDb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIGlmICh2bS5sZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZEFuc3dlciA9IHZtLmxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uLmFuc3dlcjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZEFuc3dlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmV2aW91c1F1ZXN0aW9uKCl7XG4gICAgICAgIHZtLmJ1c3kgPSB0cnVlO1xuICAgICAgICBMZWFkZXJzaGlwU3R5bGVTZXJ2aWNlLmdvVG9QcmV2aW91c1F1ZXN0aW9uKHZtLmxlYWRlcnNoaXBTdHlsZSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIGlmICh2bS5sZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZEFuc3dlciA9IHZtLmxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uLmFuc3dlcjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZEFuc3dlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdGFydE92ZXIoKSB7XG4gICAgICAgIHZtLmJ1c3kgPSB0cnVlO1xuICAgICAgICBMZWFkZXJzaGlwU3R5bGVTZXJ2aWNlLnJldGFrZUxlYWRlcnNoaXBTdHlsZSh2bS5sZWFkZXJzaGlwU3R5bGUpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgICAgIHZtLnBhbmVsX2luZGV4PTA7XG4gICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRBbnN3ZXI9bnVsbDtcbiAgICAgICAgICAgICAgICB2bS5sZWFkZXJzaGlwU3R5bGUgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgdm0uYnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbmlzaCgpIHtcbiAgICAgICAgdm0uYnVzeSA9IHRydWU7XG4gICAgICAgIExlYWRlcnNoaXBTdHlsZVNlcnZpY2UudXBkYXRlRW1wbG95ZWVab25lKHtpZDogdm0ubGVhZGVyc2hpcFN0eWxlLmlkLCB6b25lOiB2bS5sZWFkZXJzaGlwU3R5bGUuem9uZS5pZCwgbm90ZXM6IHZtLmxlYWRlcnNoaXBTdHlsZS5ub3RlcywgY29tcGxldGVkOiB0cnVlfSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIE5vdGlmaWNhdGlvbi5zdWNjZXNzKCdZb3VyIHF1aXogcmVzdWx0cyBoYXMgYmVlbiBzaGFyZWQuJylcbiAgICAgICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZShyZXN1bHQpO1xuICAgICAgICAgICAgICAgIGlmIChsZWFkZXJzaGlwU3R5bGUuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9pZC8nICsgcmVzdWx0LmlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdm0uYnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNob3dXaG9DYW5TZWVUaGlzKGVtcGxveWVlX2lkLCBlbXBsb3llZV92aWV3KSB7XG4gICAgICAgICRtb2RhbC5vcGVuKHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIGJhY2tkcm9wOiAnc3RhdGljJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3N0YXRpYy9hbmd1bGFyL3BhcnRpYWxzL19tb2RhbHMvd2hvLWNhbi1zZWUtdGhpcy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdTdXBwb3J0VGVhbUN0cmwnLFxuICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgIGVtcGxveWVlX3ZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVtcGxveWVlX3ZpZXdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVtcGxveWVlX2lkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbXBsb3llZV9pZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnbGVhZGVyc2hpcC1zdHlsZScpXG4gICAgLmZhY3RvcnkoJ0xlYWRlcnNoaXBTdHlsZVNlcnZpY2UnLCBMZWFkZXJzaGlwU3R5bGVTZXJ2aWNlKTtcblxuZnVuY3Rpb24gTGVhZGVyc2hpcFN0eWxlU2VydmljZSgkaHR0cCwgJGxvZywgTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBjcmVhdGVMZWFkZXJzaGlwU3R5bGU6IGNyZWF0ZUxlYWRlcnNoaXBTdHlsZSxcbiAgICAgICAgZ2V0TGVhZGVyc2hpcFN0eWxlOiBnZXRMZWFkZXJzaGlwU3R5bGUsXG4gICAgICAgIGdldE15TGVhZGVyc2hpcFN0eWxlOiBnZXRNeUxlYWRlcnNoaXBTdHlsZSxcbiAgICAgICAgZ2V0TXlVbmZpbmlzaGVkTGVhZGVyc2hpcFN0eWxlOiBnZXRNeVVuZmluaXNoZWRMZWFkZXJzaGlwU3R5bGUsXG4gICAgICAgIHJldGFrZUxlYWRlcnNoaXBTdHlsZTogcmV0YWtlTGVhZGVyc2hpcFN0eWxlLFxuICAgICAgICBzaGFyZUxlYWRlcnNoaXBTdHlsZTogc2hhcmVMZWFkZXJzaGlwU3R5bGUsXG4gICAgICAgIHVwZGF0ZUxlYWRlcnNoaXBTdHlsZTogdXBkYXRlTGVhZGVyc2hpcFN0eWxlLFxuICAgICAgICBnb1RvUHJldmlvdXNRdWVzdGlvbjogZ29Ub1ByZXZpb3VzUXVlc3Rpb25cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlTGVhZGVyc2hpcFN0eWxlKGxlYWRlcnNoaXBTdHlsZSkge1xuICAgICAgICByZXR1cm4gTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2UuY3JlYXRlKGxlYWRlcnNoaXBTdHlsZSwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignY3JlYXRlTGVhZGVyc2hpcFN0eWxlIGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0TGVhZGVyc2hpcFN0eWxlKGxlYWRlcnNoaXBTdHlsZUlkKSB7XG4gICAgICAgIHJldHVybiBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZS5nZXQoe2lkOiBsZWFkZXJzaGlwU3R5bGVJZH0sIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ2dldExlYWRlcnNoaXBTdHlsZSBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE15TGVhZGVyc2hpcFN0eWxlKCkge1xuICAgICAgICByZXR1cm4gTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2UuZ2V0TXkoe2lkOiAnbXknfSwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignZ2V0TXlMZWFkZXJzaGlwU3R5bGUgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRNeVVuZmluaXNoZWRMZWFkZXJzaGlwU3R5bGUoKSB7XG4gICAgICAgIHJldHVybiBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZS5nZXRVbmZpbmlzaGVkKG51bGwsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ2dldFVuZmluaXNoZWQgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXRha2VMZWFkZXJzaGlwU3R5bGUobGVhZGVyc2hpcFN0eWxlKSB7XG4gICAgICAgIHJldHVybiBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZS5yZXRha2Uoe2lkOiBsZWFkZXJzaGlwU3R5bGUuaWR9LCBsZWFkZXJzaGlwU3R5bGUsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ3JldGFrZUxlYWRlcnNoaXBTdHlsZSBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNoYXJlTGVhZGVyc2hpcFN0eWxlKGxlYWRlcnNoaXBTdHlsZSkge1xuICAgICAgICByZXR1cm4gTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2Uuc2hhcmUoe2lkOiBsZWFkZXJzaGlwU3R5bGUuaWR9LCBsZWFkZXJzaGlwU3R5bGUsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ3NoYXJlTGVhZGVyc2hpcFN0eWxlIGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlTGVhZGVyc2hpcFN0eWxlKGxlYWRlcnNoaXBTdHlsZSkge1xuICAgICAgICByZXR1cm4gTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2UudXBkYXRlKHtpZDogbGVhZGVyc2hpcFN0eWxlLmlkfSwgbGVhZGVyc2hpcFN0eWxlLCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCd1cGRhdGVMZWFkZXJzaGlwU3R5bGUgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnb1RvUHJldmlvdXNRdWVzdGlvbihsZWFkZXJzaGlwU3R5bGUpIHtcbiAgICAgICAgcmV0dXJuIExlYWRlcnNoaXBTdHlsZVJlc291cmNlLmdvVG9QcmV2aW91c1F1ZXN0aW9uKHtpZDogbGVhZGVyc2hpcFN0eWxlLmlkfSwgbnVsbCwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignZ29Ub1ByZXZpb3VzUXVlc3Rpb24gZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2xlYWRlcnNoaXAtc3R5bGUnKVxuICAgIC5mYWN0b3J5KCdMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZScsIExlYWRlcnNoaXBTdHlsZVJlc291cmNlKTtcblxuZnVuY3Rpb24gTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2UoJHJlc291cmNlKSB7XG4gICAgdmFyIGFjdGlvbnMgPSB7XG4gICAgICAgICdjcmVhdGUnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvbGVhZGVyc2hpcC1zdHlsZS9jcmVhdGUvJ1xuICAgICAgICB9LFxuICAgICAgICAnZ2V0Jzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvbGVhZGVyc2hpcC1zdHlsZS86aWQvJ1xuICAgICAgICB9LFxuICAgICAgICAnZ2V0TXknOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlLzppZC8nXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRVbmZpbmlzaGVkJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvbGVhZGVyc2hpcC1zdHlsZS91bmZpbmlzaGVkLydcbiAgICAgICAgfSxcbiAgICAgICAgJ3JldGFrZSc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL2xlYWRlcnNoaXAtc3R5bGUvOmlkL3JldGFrZS8nXG4gICAgICAgIH0sXG4gICAgICAgICdzaGFyZSc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL2xlYWRlcnNoaXAtc3R5bGUvOmlkL3NoYXJlLydcbiAgICAgICAgfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL2xlYWRlcnNoaXAtc3R5bGUvOmlkL3VwZGF0ZS8nXG4gICAgICAgIH0sXG4gICAgICAgICdnb1RvUHJldmlvdXNRdWVzdGlvbic6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL2xlYWRlcnNoaXAtc3R5bGUvOmlkL3ByZXZpb3VzLXF1ZXN0aW9uLydcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuICRyZXNvdXJjZSgnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlLzppZC8nLCBudWxsLCBhY3Rpb25zKTtcbn1cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdsZWFkZXJzaGlwLXN0eWxlJylcbiAgICAuY29udHJvbGxlcignTGVhZGVyc2hpcFN0eWxlQ29udHJvbGxlcicsIExlYWRlcnNoaXBTdHlsZUNvbnRyb2xsZXIpO1xuXG5mdW5jdGlvbiBMZWFkZXJzaGlwU3R5bGVDb250cm9sbGVyKExlYWRlcnNoaXBTdHlsZVNlcnZpY2UsIExlYWRlcnNoaXBTdHlsZVJlcXVlc3RTZXJ2aWNlLCBhbmFseXRpY3MsICRsb2NhdGlvbiwgJG1vZGFsLCAkcm9vdFNjb3BlLCAkc2NvcGUsICR0aW1lb3V0KSB7XG4gICAgLyogU2luY2UgdGhpcyBwYWdlIGNhbiBiZSB0aGUgcm9vdCBmb3Igc29tZSB1c2VycyBsZXQncyBtYWtlIHN1cmUgd2UgY2FwdHVyZSB0aGUgY29ycmVjdCBwYWdlICovXG4gICAgdmFyIGxvY2F0aW9uX3VybCA9ICRsb2NhdGlvbi51cmwoKS5pbmRleE9mKCcvaWQnKSA8IDAgPyAnL2lkJyA6ICRsb2NhdGlvbi51cmwoKTtcbiAgICBhbmFseXRpY3MudHJhY2tQYWdlKCRzY29wZSwgJGxvY2F0aW9uLmFic1VybCgpLCBsb2NhdGlvbl91cmwpO1xuXG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5idXN5ID0gdHJ1ZTtcbiAgICB2bS5zaG93RW1wdHlTY3JlZW4gPSBmYWxzZTtcbiAgICB2bS5teUxlYWRlcnNoaXBTdHlsZSA9IG51bGw7XG4gICAgdm0udGFrZVF1aXogPSB0YWtlUXVpejtcbiAgICB2bS5yZXF1ZXN0TGVhZGVyc2hpcFN0eWxlID0gcmVxdWVzdExlYWRlcnNoaXBTdHlsZTtcbiAgICAkcm9vdFNjb3BlLnN1Y2Nlc3NSZXF1ZXN0TWVzc2FnZSA9IGZhbHNlO1xuICAgICRyb290U2NvcGUuaGlkZU1lc3NhZ2UgPSBmYWxzZTtcbiAgICAkcm9vdFNjb3BlLmhpZGVSZXF1ZXN0TWVzc2FnZSA9IGZhbHNlO1xuICAgIGFjdGl2YXRlKCk7XG5cbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgZ2V0TXlMZWFkZXJzaGlwU3R5bGUoKTtcblxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRNeUxlYWRlcnNoaXBTdHlsZSgpIHtcbiAgICAgICAgdm0uYnVzeSA9IHRydWU7XG4gICAgICAgIExlYWRlcnNoaXBTdHlsZVNlcnZpY2UuZ2V0TXlMZWFkZXJzaGlwU3R5bGUoKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24obGVhZGVyc2hpcFN0eWxlKXtcbiAgICAgICAgICAgICAgICB2bS5teUxlYWRlcnNoaXBTdHlsZSA9IGxlYWRlcnNoaXBTdHlsZTtcbiAgICAgICAgICAgICAgICB2bS5idXN5ID0gZmFsc2U7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRha2VRdWl6KCkge1xuICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIHdpbmRvd0NsYXNzOiAneHgtZGlhbG9nIGZhZGUgem9vbScsXG4gICAgICAgICAgICBiYWNrZHJvcDogJ3N0YXRpYycsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9zdGF0aWMvYW5ndWxhci9sZWFkZXJzaGlwLXN0eWxlL3BhcnRpYWxzL19tb2RhbHMvcXVpei5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdRdWl6Q29udHJvbGxlciBhcyBxdWl6JyxcbiAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgbGVhZGVyc2hpcFN0eWxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm0ubXlMZWFkZXJzaGlwU3R5bGVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIChsZWFkZXJzaGlwU3R5bGUpIHtcbiAgICAgICAgICAgICAgICB2bS5teUxlYWRlcnNoaXBTdHlsZSA9IGxlYWRlcnNoaXBTdHlsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0TXlSZWNlbnRseVNlbnRSZXF1ZXN0cygpIHtcbiAgICAgICAgTGVhZGVyc2hpcFN0eWxlU2VydmljZS5nZXRNeVJlY2VudGx5U2VudFJlcXVlc3RzKClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdm0ubXlSZWNlbnRseVNlbnRSZXF1ZXN0cyA9IGRhdGE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZtLm15UmVjZW50bHlTZW50UmVxdWVzdHM7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIHJlcXVlc3RMZWFkZXJzaGlwU3R5bGUocGFuZWwpIHtcbiAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3aW5kb3dDbGFzczogJ3h4LWRpYWxvZyBmYWRlIHpvb20nLFxuICAgICAgICAgICAgICAgIGJhY2tkcm9wOiAnc3RhdGljJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9zdGF0aWMvYW5ndWxhci9sZWFkZXJzaGlwLXN0eWxlL3BhcnRpYWxzL19tb2RhbHMvcmVxdWVzdC1sZWFkZXJzaGlwLXN0eWxlLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0Q29udHJvbGxlciBhcyByZXF1ZXN0JyxcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgIHBhbmVsOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFuZWxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoc2VudExlYWRlcnNoaXBTdHlsZVJlcXVlc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIGdldE15UmVjZW50bHlTZW50UmVxdWVzdHMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG59XG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnbGVhZGVyc2hpcC1zdHlsZScpXG4gICAgLmZhY3RvcnkoJ0xlYWRlcnNoaXBTdHlsZVJlcXVlc3RTZXJ2aWNlJywgTGVhZGVyc2hpcFN0eWxlUmVxdWVzdFNlcnZpY2UpO1xuXG5mdW5jdGlvbiBMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0U2VydmljZSgkbG9nLCBMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0UmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBzZW5kTGVhZGVyc2hpcFN0eWxlUmVxdWVzdHM6IHNlbmRMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0cyxcbiAgICAgICAgZ2V0TXlSZWNlbnRseVNlbnRSZXF1ZXN0czogZ2V0TXlSZWNlbnRseVNlbnRSZXF1ZXN0cyxcbiAgICAgICAgZ2V0UmVxdWVzdDogZ2V0UmVxdWVzdFxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBzZW5kTGVhZGVyc2hpcFN0eWxlUmVxdWVzdHMocmV2aWV3ZXJzLCBtZXNzYWdlKSB7XG4gICAgICAgIHZhciByZXF1ZXN0cyA9IFtdO1xuXG4gICAgICAgIGZvcih2YXIgaT0wOyBpIDwgcmV2aWV3ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcmV2aWV3ZXJfaWQgPSByZXZpZXdlcnNbaV0ucGsgPyByZXZpZXdlcnNbaV0ucGsgOiByZXZpZXdlcnNbaV0uaWRcbiAgICAgICAgICAgIHJlcXVlc3RzLnB1c2goe3Jldmlld2VyOiByZXZpZXdlcl9pZCwgbWVzc2FnZTogbWVzc2FnZX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIExlYWRlcnNoaXBTdHlsZVJlcXVlc3RSZXNvdXJjZS5zZW5kTGVhZGVyc2hpcFN0eWxlUmVxdWVzdHMocmVxdWVzdHMsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3Moc2VudExlYWRlcnNoaXBTdHlsZVJlcXVlc3RzKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VudExlYWRlcnNoaXBTdHlsZVJlcXVlc3RzO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignc2VuZExlYWRlcnNoaXBTdHlsZVJlcXVlc3RzIGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0TXlSZWNlbnRseVNlbnRSZXF1ZXN0cygpIHtcbiAgICAgICAgcmV0dXJuIExlYWRlcnNoaXBTdHlsZVJlcXVlc3RSZXNvdXJjZS5nZXRNeVJlY2VudGx5U2VudFJlcXVlc3RzKG51bGwsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ2dldE15UmVjZW50bHlTZW50UmVxdWVzdHMgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRSZXF1ZXN0KGlkKSB7XG4gICAgICAgIHJldHVybiBMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0UmVzb3VyY2UuZ2V0UmVxdWVzdCh7aWQ6IGlkfSwgbnVsbCwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignZ2V0UmVxdWVzdCBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnbGVhZGVyc2hpcC1zdHlsZScpXG4gICAgLmZhY3RvcnkoJ0xlYWRlcnNoaXBTdHlsZVJlcXVlc3RSZXNvdXJjZScsIExlYWRlcnNoaXBTdHlsZVJlcXVlc3RSZXNvdXJjZSk7XG5cbmZ1bmN0aW9uIExlYWRlcnNoaXBTdHlsZVJlcXVlc3RSZXNvdXJjZSgkcmVzb3VyY2UpIHtcbiAgICB2YXIgYWN0aW9ucyA9IHtcbiAgICAgICAgJ2dldE15UmVjZW50bHlTZW50UmVxdWVzdHMnOiB7XG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL2xlYWRlcnNoaXAtc3R5bGUvcmVxdWVzdHMvcmVjZW50bHktc2VudC8nLFxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldExlYWRlcnNoaXBTdHlsZVJlcXVlc3RzJzoge1xuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlL3JlcXVlc3RzL3RvZG8vJyxcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRSZXF1ZXN0Jzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgfSxcbiAgICAgICAgJ3NlbmRMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0cyc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgaXNBcnJheTogdHJ1ZVxuICAgICAgICB9LFxuICAgIH07XG4gICAgcmV0dXJuICRyZXNvdXJjZSgnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlL3JlcXVlc3RzLzppZC8nLCBudWxsLCBhY3Rpb25zKTtcbn1cbiIsIiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2xlYWRlcnNoaXAtc3R5bGUnKVxuICAgICAgICAuY29udHJvbGxlcignTGVhZGVyc2hpcFN0eWxlUmVxdWVzdENvbnRyb2xsZXInLCBMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0Q29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0Q29udHJvbGxlcihwYW5lbCwgTGVhZGVyc2hpcFN0eWxlUmVxdWVzdFNlcnZpY2UsIFVzZXJzLCAkdGltZW91dCwgJG1vZGFsSW5zdGFuY2UsICRyb290U2NvcGUpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0ucG90ZW50aWFsUmV2aWV3ZXJzID0gW107XG4gICAgICAgIHZtLnN1YmplY3QgPSAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLmVtcGxveWVlO1xuICAgICAgICB2bS5tZXNzYWdlID0gJyc7XG4gICAgICAgIHZtLnNlbmRMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0cyA9IHNlbmRMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0cztcbiAgICAgICAgdm0uc3RlcE5leHQgPSBzdGVwTmV4dDtcbiAgICAgICAgdm0uc3RlcEJhY2sgPSBzdGVwQmFjaztcbiAgICAgICAgdm0uY2FuY2VsID0gY2FuY2VsO1xuICAgICAgICB2bS5wYW5lbF9pbmRleCA9IHBhbmVsO1xuICAgICAgICB2bS5lbmFibGVTZW5kID0gdHJ1ZTtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAgICAgZ2V0UG90ZW50aWFsUmV2aWV3ZXJzKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRQb3RlbnRpYWxSZXZpZXdlcnMoKSB7XG4gICAgICAgICAgICByZXR1cm4gVXNlcnMucXVlcnkoKS4kcHJvbWlzZVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0ucG90ZW50aWFsUmV2aWV3ZXJzID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZtLnBvdGVudGlhbFJldmlld2VycztcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNlbmRMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0cygpIHtcbiAgICAgICAgICAgIHZtLmVuYWJsZVNlbmQgPSBmYWxzZTtcbiAgICAgICAgICAgIExlYWRlcnNoaXBTdHlsZVJlcXVlc3RTZXJ2aWNlLnNlbmRMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0cyh2bS5zZWxlY3RlZFJldmlld2Vycywgdm0ubWVzc2FnZSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihzZW50UGVyY2VwdGlvUmVxdWVzdHMpIHtcblxuICAgICAgICAgICAgICAgICAgICAvKiBCaWcgc3VjY2VzcyBtZXNzYWdlICovXG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuc3VjY2Vzc1JlcXVlc3RNZXNzYWdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS5zdWNjZXNzUmVxdWVzdE1lc3NhZ2VSZWNpcGllbnQgPSB2bS5zZWxlY3RlZFJldmlld2VycztcblxuICAgICAgICAgICAgICAgICAgICAvKiBIaWRlIHN1Y2Nlc3MgbWVzc2FnZSBhZnRlciBhIGZldyBzZWNvbmRzICovXG4gICAgICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS5oaWRlUmVxdWVzdE1lc3NhZ2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9LCAxMDAwMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2Uoc2VudFBlcmNlcHRpb1JlcXVlc3RzKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc3RlcE5leHQoKSB7XG4gICAgICAgICAgICB2bS5wYW5lbF9pbmRleCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc3RlcEJhY2soKSB7XG4gICAgICAgICAgICB2bS5wYW5lbF9pbmRleC0tO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygpO1xuICAgICAgICB9XG4gICAgfVxuIiwiOyhmdW5jdGlvbigpIHtcblwidXNlIHN0cmljdFwiO1xuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnbGVhZGVyc2hpcC1zdHlsZScsIFsnbmdSb3V0ZScsICd1aS1ub3RpZmljYXRpb24nXSk7XG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdsZWFkZXJzaGlwLXN0eWxlJylcbiAgICAuY29udHJvbGxlcignUXVpekNvbnRyb2xsZXInLCBRdWl6Q29udHJvbGxlcik7XG5cbmZ1bmN0aW9uIFF1aXpDb250cm9sbGVyKGFuYWx5dGljcywgTGVhZGVyc2hpcFN0eWxlU2VydmljZSwgTm90aWZpY2F0aW9uLCBsZWFkZXJzaGlwU3R5bGUsICRsb2NhdGlvbiwgJG1vZGFsLCAkbW9kYWxJbnN0YW5jZSwgJHJvb3RTY29wZSwgJHNjb3BlKSB7XG4gICAgdmFyIGxvY2F0aW9uX3VybCA9ICcvcXVpei8nICsgbGVhZGVyc2hpcFN0eWxlLmlkO1xuICAgIGFuYWx5dGljcy50cmFja1BhZ2UoJHNjb3BlLCAkbG9jYXRpb24uYWJzVXJsKCksIGxvY2F0aW9uX3VybCk7XG4gICAgdmFyIHZtID0gdGhpcztcblxuICAgIHZtLmxlYWRlcnNoaXBTdHlsZSA9IGxlYWRlcnNoaXBTdHlsZTtcbiAgICB2bS5wYW5lbF9pbmRleCA9IDA7XG4gICAgdm0uYnVzeSA9IGZhbHNlO1xuICAgIHZtLmNhbmNlbCA9IGNhbmNlbDtcbiAgICB2bS5jbG9zZSA9IGNsb3NlO1xuICAgIHZtLmFuc3dlclF1ZXN0aW9uID0gYW5zd2VyUXVlc3Rpb247XG4gICAgdm0ucHJldmlvdXNRdWVzdGlvbiA9IHByZXZpb3VzUXVlc3Rpb247XG4gICAgdm0uc3RhcnRPdmVyID0gc3RhcnRPdmVyO1xuICAgIHZtLnNob3dXaG9DYW5TZWVUaGlzID0gc2hvd1dob0NhblNlZVRoaXM7XG4gICAgdm0uZmluaXNoID0gZmluaXNoO1xuICAgIHZtLmVtcGxveWVlID0gJHJvb3RTY29wZS5jdXJyZW50VXNlci5lbXBsb3llZTtcbiAgICB2bS5zZWxlY3RlZEFuc3dlciA9IG51bGw7XG4gICAgdm0uc2NvcmVzID0gW107XG5cbiAgICBhY3RpdmF0ZSgpXG5cbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgaWYgKGxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uKSB7XG4gICAgICAgICAgICB2bS5zZWxlY3RlZEFuc3dlciA9IGxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uLmFuc3dlcjtcbiAgICAgICAgfVxuICAgICAgICBpc0NvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNDb21wbGV0ZSgpIHtcbiAgICAgICAgaWYgKHZtLmxlYWRlcnNoaXBTdHlsZS5jb21wbGV0ZWQgfHwgIXZtLmxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uKSB7XG4gICAgICAgICAgICBpZiAoIXZtLmxlYWRlcnNoaXBTdHlsZS5jb21wbGV0ZWQpIHtcbiAgICAgICAgICAgICAgICB2bS5sZWFkZXJzaGlwU3R5bGUuYXNzZXNzb3IgPSB2bS5sZWFkZXJzaGlwU3R5bGUuYXNzZXNzb3IuaWQ7XG4gICAgICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlLmNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgTGVhZGVyc2hpcFN0eWxlU2VydmljZS51cGRhdGVMZWFkZXJzaGlwU3R5bGUodm0ubGVhZGVyc2hpcFN0eWxlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmxlYWRlcnNoaXBTdHlsZSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uYnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2bS5zY29yZXMucHVzaCh7J3N0eWxlJyA6ICdWaXNpb25hcnknLCAnc2NvcmUnOiB2bS5sZWFkZXJzaGlwU3R5bGUudmlzaW9uYXJ5X3Njb3JlfSk7XG4gICAgICAgICAgICB2bS5zY29yZXMucHVzaCh7J3N0eWxlJyA6ICdPcGVyYXRvcicsICdzY29yZSc6IHZtLmxlYWRlcnNoaXBTdHlsZS5vcGVyYXRvcl9zY29yZX0pO1xuICAgICAgICAgICAgdm0uc2NvcmVzLnB1c2goeydzdHlsZScgOiAnUHJvY2Vzc29yJywgJ3Njb3JlJzogdm0ubGVhZGVyc2hpcFN0eWxlLnByb2Nlc3Nvcl9zY29yZX0pO1xuICAgICAgICAgICAgdm0uc2NvcmVzLnB1c2goeydzdHlsZScgOiAnU3luZXJnaXN0JywgJ3Njb3JlJzogdm0ubGVhZGVyc2hpcFN0eWxlLnN5bmVyZ2lzdF9zY29yZX0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKHZtLmxlYWRlcnNoaXBTdHlsZSlcbiAgICAgICAgaWYgKCF2bS5sZWFkZXJzaGlwU3R5bGUuY29tcGxldGVkKSB7XG4gICAgICAgICAgICBOb3RpZmljYXRpb24uc3VjY2VzcygnWW91ciBwcm9ncmVzcyBoYXMgYmVlbiBzYXZlZC4nKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYW5zd2VyUXVlc3Rpb24oYW5zd2VyKSB7XG4gICAgICAgIHZtLmJ1c3kgPSB0cnVlO1xuICAgICAgICB2bS5sZWFkZXJzaGlwU3R5bGUubGFzdF9xdWVzdGlvbl9hbnN3ZXJlZCA9IHZtLmxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uLmlkO1xuICAgICAgICBpZiAodm0ubGVhZGVyc2hpcFN0eWxlLm5leHRfcXVlc3Rpb24uYW5zd2VyKSB7XG4gICAgICAgICAgICBpZiAodm0ubGVhZGVyc2hpcFN0eWxlLm5leHRfcXVlc3Rpb24uYW5zd2VyLmlkICE9IGFuc3dlci5pZCkge1xuICAgICAgICAgICAgICAgIHZhciBhbnN3ZXJzID0gW2Fuc3dlci5pZF07XG4gICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLmxlYWRlcnNoaXBTdHlsZS5hbnN3ZXJzLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZtLmxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uLmFuc3dlci5pZCAhPSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2Vycy5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlLmFuc3dlcnMgPSBhbnN3ZXJzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlLmFuc3dlcnMucHVzaChhbnN3ZXIuaWQpO1xuICAgICAgICB9XG4gICAgICAgIHZtLmxlYWRlcnNoaXBTdHlsZS5hc3Nlc3NvciA9IHZtLmxlYWRlcnNoaXBTdHlsZS5hc3Nlc3Nvci5pZDtcbiAgICAgICAgTGVhZGVyc2hpcFN0eWxlU2VydmljZS51cGRhdGVMZWFkZXJzaGlwU3R5bGUodm0ubGVhZGVyc2hpcFN0eWxlKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgICAgICAgICB2bS5sZWFkZXJzaGlwU3R5bGUgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgaXNDb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIGlmICh2bS5sZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZEFuc3dlciA9IHZtLmxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uLmFuc3dlcjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZEFuc3dlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmV2aW91c1F1ZXN0aW9uKCl7XG4gICAgICAgIHZtLmJ1c3kgPSB0cnVlO1xuICAgICAgICBMZWFkZXJzaGlwU3R5bGVTZXJ2aWNlLmdvVG9QcmV2aW91c1F1ZXN0aW9uKHZtLmxlYWRlcnNoaXBTdHlsZSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIGlmICh2bS5sZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZEFuc3dlciA9IHZtLmxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uLmFuc3dlcjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZEFuc3dlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdGFydE92ZXIoKSB7XG4gICAgICAgIHZtLmJ1c3kgPSB0cnVlO1xuICAgICAgICBMZWFkZXJzaGlwU3R5bGVTZXJ2aWNlLnJldGFrZUxlYWRlcnNoaXBTdHlsZSh2bS5sZWFkZXJzaGlwU3R5bGUpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgICAgIHZtLnBhbmVsX2luZGV4PTA7XG4gICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRBbnN3ZXI9bnVsbDtcbiAgICAgICAgICAgICAgICB2bS5sZWFkZXJzaGlwU3R5bGUgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgdm0uYnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbmlzaCgpIHtcbiAgICAgICAgdm0uYnVzeSA9IHRydWU7XG4gICAgICAgIExlYWRlcnNoaXBTdHlsZVNlcnZpY2UudXBkYXRlRW1wbG95ZWVab25lKHtpZDogdm0ubGVhZGVyc2hpcFN0eWxlLmlkLCB6b25lOiB2bS5sZWFkZXJzaGlwU3R5bGUuem9uZS5pZCwgbm90ZXM6IHZtLmxlYWRlcnNoaXBTdHlsZS5ub3RlcywgY29tcGxldGVkOiB0cnVlfSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIE5vdGlmaWNhdGlvbi5zdWNjZXNzKCdZb3VyIHF1aXogcmVzdWx0cyBoYXMgYmVlbiBzaGFyZWQuJylcbiAgICAgICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZShyZXN1bHQpO1xuICAgICAgICAgICAgICAgIGlmIChsZWFkZXJzaGlwU3R5bGUuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9pZC8nICsgcmVzdWx0LmlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdm0uYnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNob3dXaG9DYW5TZWVUaGlzKGVtcGxveWVlX2lkLCBlbXBsb3llZV92aWV3KSB7XG4gICAgICAgICRtb2RhbC5vcGVuKHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIGJhY2tkcm9wOiAnc3RhdGljJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3N0YXRpYy9hbmd1bGFyL3BhcnRpYWxzL19tb2RhbHMvd2hvLWNhbi1zZWUtdGhpcy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdTdXBwb3J0VGVhbUN0cmwnLFxuICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgIGVtcGxveWVlX3ZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVtcGxveWVlX3ZpZXdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVtcGxveWVlX2lkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbXBsb3llZV9pZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdsZWFkZXJzaGlwLXN0eWxlJylcbiAgICAuZmFjdG9yeSgnTGVhZGVyc2hpcFN0eWxlU2VydmljZScsIExlYWRlcnNoaXBTdHlsZVNlcnZpY2UpO1xuXG5mdW5jdGlvbiBMZWFkZXJzaGlwU3R5bGVTZXJ2aWNlKCRodHRwLCAkbG9nLCBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNyZWF0ZUxlYWRlcnNoaXBTdHlsZTogY3JlYXRlTGVhZGVyc2hpcFN0eWxlLFxuICAgICAgICBnZXRMZWFkZXJzaGlwU3R5bGU6IGdldExlYWRlcnNoaXBTdHlsZSxcbiAgICAgICAgZ2V0TXlMZWFkZXJzaGlwU3R5bGU6IGdldE15TGVhZGVyc2hpcFN0eWxlLFxuICAgICAgICBnZXRNeVVuZmluaXNoZWRMZWFkZXJzaGlwU3R5bGU6IGdldE15VW5maW5pc2hlZExlYWRlcnNoaXBTdHlsZSxcbiAgICAgICAgcmV0YWtlTGVhZGVyc2hpcFN0eWxlOiByZXRha2VMZWFkZXJzaGlwU3R5bGUsXG4gICAgICAgIHNoYXJlTGVhZGVyc2hpcFN0eWxlOiBzaGFyZUxlYWRlcnNoaXBTdHlsZSxcbiAgICAgICAgdXBkYXRlTGVhZGVyc2hpcFN0eWxlOiB1cGRhdGVMZWFkZXJzaGlwU3R5bGUsXG4gICAgICAgIGdvVG9QcmV2aW91c1F1ZXN0aW9uOiBnb1RvUHJldmlvdXNRdWVzdGlvblxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVMZWFkZXJzaGlwU3R5bGUobGVhZGVyc2hpcFN0eWxlKSB7XG4gICAgICAgIHJldHVybiBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZS5jcmVhdGUobGVhZGVyc2hpcFN0eWxlLCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdjcmVhdGVMZWFkZXJzaGlwU3R5bGUgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRMZWFkZXJzaGlwU3R5bGUobGVhZGVyc2hpcFN0eWxlSWQpIHtcbiAgICAgICAgcmV0dXJuIExlYWRlcnNoaXBTdHlsZVJlc291cmNlLmdldCh7aWQ6IGxlYWRlcnNoaXBTdHlsZUlkfSwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignZ2V0TGVhZGVyc2hpcFN0eWxlIGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0TXlMZWFkZXJzaGlwU3R5bGUoKSB7XG4gICAgICAgIHJldHVybiBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZS5nZXRNeSh7aWQ6ICdteSd9LCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdnZXRNeUxlYWRlcnNoaXBTdHlsZSBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE15VW5maW5pc2hlZExlYWRlcnNoaXBTdHlsZSgpIHtcbiAgICAgICAgcmV0dXJuIExlYWRlcnNoaXBTdHlsZVJlc291cmNlLmdldFVuZmluaXNoZWQobnVsbCwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignZ2V0VW5maW5pc2hlZCBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJldGFrZUxlYWRlcnNoaXBTdHlsZShsZWFkZXJzaGlwU3R5bGUpIHtcbiAgICAgICAgcmV0dXJuIExlYWRlcnNoaXBTdHlsZVJlc291cmNlLnJldGFrZSh7aWQ6IGxlYWRlcnNoaXBTdHlsZS5pZH0sIGxlYWRlcnNoaXBTdHlsZSwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcigncmV0YWtlTGVhZGVyc2hpcFN0eWxlIGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2hhcmVMZWFkZXJzaGlwU3R5bGUobGVhZGVyc2hpcFN0eWxlKSB7XG4gICAgICAgIHJldHVybiBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZS5zaGFyZSh7aWQ6IGxlYWRlcnNoaXBTdHlsZS5pZH0sIGxlYWRlcnNoaXBTdHlsZSwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignc2hhcmVMZWFkZXJzaGlwU3R5bGUgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVMZWFkZXJzaGlwU3R5bGUobGVhZGVyc2hpcFN0eWxlKSB7XG4gICAgICAgIHJldHVybiBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZS51cGRhdGUoe2lkOiBsZWFkZXJzaGlwU3R5bGUuaWR9LCBsZWFkZXJzaGlwU3R5bGUsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ3VwZGF0ZUxlYWRlcnNoaXBTdHlsZSBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdvVG9QcmV2aW91c1F1ZXN0aW9uKGxlYWRlcnNoaXBTdHlsZSkge1xuICAgICAgICByZXR1cm4gTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2UuZ29Ub1ByZXZpb3VzUXVlc3Rpb24oe2lkOiBsZWFkZXJzaGlwU3R5bGUuaWR9LCBudWxsLCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdnb1RvUHJldmlvdXNRdWVzdGlvbiBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdsZWFkZXJzaGlwLXN0eWxlJylcbiAgICAuZmFjdG9yeSgnTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2UnLCBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZSk7XG5cbmZ1bmN0aW9uIExlYWRlcnNoaXBTdHlsZVJlc291cmNlKCRyZXNvdXJjZSkge1xuICAgIHZhciBhY3Rpb25zID0ge1xuICAgICAgICAnY3JlYXRlJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL2xlYWRlcnNoaXAtc3R5bGUvY3JlYXRlLydcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldCc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL2xlYWRlcnNoaXAtc3R5bGUvOmlkLydcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldE15Jzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvbGVhZGVyc2hpcC1zdHlsZS86aWQvJ1xuICAgICAgICB9LFxuICAgICAgICAnZ2V0VW5maW5pc2hlZCc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL2xlYWRlcnNoaXAtc3R5bGUvdW5maW5pc2hlZC8nXG4gICAgICAgIH0sXG4gICAgICAgICdyZXRha2UnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlLzppZC9yZXRha2UvJ1xuICAgICAgICB9LFxuICAgICAgICAnc2hhcmUnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlLzppZC9zaGFyZS8nXG4gICAgICAgIH0sXG4gICAgICAgICd1cGRhdGUnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlLzppZC91cGRhdGUvJ1xuICAgICAgICB9LFxuICAgICAgICAnZ29Ub1ByZXZpb3VzUXVlc3Rpb24nOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlLzppZC9wcmV2aW91cy1xdWVzdGlvbi8nXG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiAkcmVzb3VyY2UoJy9hcGkvdjEvbGVhZGVyc2hpcC1zdHlsZS86aWQvJywgbnVsbCwgYWN0aW9ucyk7XG59XG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdsZWFkZXJzaGlwLXN0eWxlJylcbiAgICAuY29udHJvbGxlcignTGVhZGVyc2hpcFN0eWxlQ29udHJvbGxlcicsIExlYWRlcnNoaXBTdHlsZUNvbnRyb2xsZXIpO1xuXG5mdW5jdGlvbiBMZWFkZXJzaGlwU3R5bGVDb250cm9sbGVyKExlYWRlcnNoaXBTdHlsZVNlcnZpY2UsIExlYWRlcnNoaXBTdHlsZVJlcXVlc3RTZXJ2aWNlLCBhbmFseXRpY3MsICRsb2NhdGlvbiwgJG1vZGFsLCAkcm9vdFNjb3BlLCAkc2NvcGUsICR0aW1lb3V0KSB7XG4gICAgLyogU2luY2UgdGhpcyBwYWdlIGNhbiBiZSB0aGUgcm9vdCBmb3Igc29tZSB1c2VycyBsZXQncyBtYWtlIHN1cmUgd2UgY2FwdHVyZSB0aGUgY29ycmVjdCBwYWdlICovXG4gICAgdmFyIGxvY2F0aW9uX3VybCA9ICRsb2NhdGlvbi51cmwoKS5pbmRleE9mKCcvaWQnKSA8IDAgPyAnL2lkJyA6ICRsb2NhdGlvbi51cmwoKTtcbiAgICBhbmFseXRpY3MudHJhY2tQYWdlKCRzY29wZSwgJGxvY2F0aW9uLmFic1VybCgpLCBsb2NhdGlvbl91cmwpO1xuXG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5idXN5ID0gdHJ1ZTtcbiAgICB2bS5zaG93RW1wdHlTY3JlZW4gPSBmYWxzZTtcbiAgICB2bS5teUxlYWRlcnNoaXBTdHlsZSA9IG51bGw7XG4gICAgdm0udGFrZVF1aXogPSB0YWtlUXVpejtcbiAgICB2bS5yZXF1ZXN0TGVhZGVyc2hpcFN0eWxlID0gcmVxdWVzdExlYWRlcnNoaXBTdHlsZTtcbiAgICAkcm9vdFNjb3BlLnN1Y2Nlc3NSZXF1ZXN0TWVzc2FnZSA9IGZhbHNlO1xuICAgICRyb290U2NvcGUuaGlkZU1lc3NhZ2UgPSBmYWxzZTtcbiAgICAkcm9vdFNjb3BlLmhpZGVSZXF1ZXN0TWVzc2FnZSA9IGZhbHNlO1xuICAgIGFjdGl2YXRlKCk7XG5cbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgZ2V0TXlMZWFkZXJzaGlwU3R5bGUoKTtcblxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRNeUxlYWRlcnNoaXBTdHlsZSgpIHtcbiAgICAgICAgdm0uYnVzeSA9IHRydWU7XG4gICAgICAgIExlYWRlcnNoaXBTdHlsZVNlcnZpY2UuZ2V0TXlMZWFkZXJzaGlwU3R5bGUoKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24obGVhZGVyc2hpcFN0eWxlKXtcbiAgICAgICAgICAgICAgICB2bS5teUxlYWRlcnNoaXBTdHlsZSA9IGxlYWRlcnNoaXBTdHlsZTtcbiAgICAgICAgICAgICAgICB2bS5idXN5ID0gZmFsc2U7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRha2VRdWl6KCkge1xuICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIHdpbmRvd0NsYXNzOiAneHgtZGlhbG9nIGZhZGUgem9vbScsXG4gICAgICAgICAgICBiYWNrZHJvcDogJ3N0YXRpYycsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9zdGF0aWMvYW5ndWxhci9sZWFkZXJzaGlwLXN0eWxlL3BhcnRpYWxzL19tb2RhbHMvcXVpei5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdRdWl6Q29udHJvbGxlciBhcyBxdWl6JyxcbiAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgbGVhZGVyc2hpcFN0eWxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm0ubXlMZWFkZXJzaGlwU3R5bGVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIChsZWFkZXJzaGlwU3R5bGUpIHtcbiAgICAgICAgICAgICAgICB2bS5teUxlYWRlcnNoaXBTdHlsZSA9IGxlYWRlcnNoaXBTdHlsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0TXlSZWNlbnRseVNlbnRSZXF1ZXN0cygpIHtcbiAgICAgICAgTGVhZGVyc2hpcFN0eWxlU2VydmljZS5nZXRNeVJlY2VudGx5U2VudFJlcXVlc3RzKClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdm0ubXlSZWNlbnRseVNlbnRSZXF1ZXN0cyA9IGRhdGE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZtLm15UmVjZW50bHlTZW50UmVxdWVzdHM7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIHJlcXVlc3RMZWFkZXJzaGlwU3R5bGUocGFuZWwpIHtcbiAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3aW5kb3dDbGFzczogJ3h4LWRpYWxvZyBmYWRlIHpvb20nLFxuICAgICAgICAgICAgICAgIGJhY2tkcm9wOiAnc3RhdGljJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9zdGF0aWMvYW5ndWxhci9sZWFkZXJzaGlwLXN0eWxlL3BhcnRpYWxzL19tb2RhbHMvcmVxdWVzdC1sZWFkZXJzaGlwLXN0eWxlLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0Q29udHJvbGxlciBhcyByZXF1ZXN0JyxcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgIHBhbmVsOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFuZWxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoc2VudExlYWRlcnNoaXBTdHlsZVJlcXVlc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIGdldE15UmVjZW50bHlTZW50UmVxdWVzdHMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG59XG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdsZWFkZXJzaGlwLXN0eWxlJylcbiAgICAuZmFjdG9yeSgnTGVhZGVyc2hpcFN0eWxlUmVxdWVzdFNlcnZpY2UnLCBMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0U2VydmljZSk7XG5cbmZ1bmN0aW9uIExlYWRlcnNoaXBTdHlsZVJlcXVlc3RTZXJ2aWNlKCRsb2csIExlYWRlcnNoaXBTdHlsZVJlcXVlc3RSZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHNlbmRMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0czogc2VuZExlYWRlcnNoaXBTdHlsZVJlcXVlc3RzLFxuICAgICAgICBnZXRNeVJlY2VudGx5U2VudFJlcXVlc3RzOiBnZXRNeVJlY2VudGx5U2VudFJlcXVlc3RzLFxuICAgICAgICBnZXRSZXF1ZXN0OiBnZXRSZXF1ZXN0XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHNlbmRMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0cyhyZXZpZXdlcnMsIG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIHJlcXVlc3RzID0gW107XG5cbiAgICAgICAgZm9yKHZhciBpPTA7IGkgPCByZXZpZXdlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciByZXZpZXdlcl9pZCA9IHJldmlld2Vyc1tpXS5wayA/IHJldmlld2Vyc1tpXS5wayA6IHJldmlld2Vyc1tpXS5pZFxuICAgICAgICAgICAgcmVxdWVzdHMucHVzaCh7cmV2aWV3ZXI6IHJldmlld2VyX2lkLCBtZXNzYWdlOiBtZXNzYWdlfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gTGVhZGVyc2hpcFN0eWxlUmVxdWVzdFJlc291cmNlLnNlbmRMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0cyhyZXF1ZXN0cywgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhzZW50TGVhZGVyc2hpcFN0eWxlUmVxdWVzdHMpIHtcbiAgICAgICAgICAgIHJldHVybiBzZW50TGVhZGVyc2hpcFN0eWxlUmVxdWVzdHM7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdzZW5kTGVhZGVyc2hpcFN0eWxlUmVxdWVzdHMgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRNeVJlY2VudGx5U2VudFJlcXVlc3RzKCkge1xuICAgICAgICByZXR1cm4gTGVhZGVyc2hpcFN0eWxlUmVxdWVzdFJlc291cmNlLmdldE15UmVjZW50bHlTZW50UmVxdWVzdHMobnVsbCwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignZ2V0TXlSZWNlbnRseVNlbnRSZXF1ZXN0cyBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFJlcXVlc3QoaWQpIHtcbiAgICAgICAgcmV0dXJuIExlYWRlcnNoaXBTdHlsZVJlcXVlc3RSZXNvdXJjZS5nZXRSZXF1ZXN0KHtpZDogaWR9LCBudWxsLCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdnZXRSZXF1ZXN0IGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxufVxuYW5ndWxhclxuICAgIC5tb2R1bGUoJ2xlYWRlcnNoaXAtc3R5bGUnKVxuICAgIC5mYWN0b3J5KCdMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0UmVzb3VyY2UnLCBMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0UmVzb3VyY2UpO1xuXG5mdW5jdGlvbiBMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0UmVzb3VyY2UoJHJlc291cmNlKSB7XG4gICAgdmFyIGFjdGlvbnMgPSB7XG4gICAgICAgICdnZXRNeVJlY2VudGx5U2VudFJlcXVlc3RzJzoge1xuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlL3JlcXVlc3RzL3JlY2VudGx5LXNlbnQvJyxcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0cyc6IHtcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvbGVhZGVyc2hpcC1zdHlsZS9yZXF1ZXN0cy90b2RvLycsXG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgaXNBcnJheTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICAnZ2V0UmVxdWVzdCc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIH0sXG4gICAgICAgICdzZW5kTGVhZGVyc2hpcFN0eWxlUmVxdWVzdHMnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICB9O1xuICAgIHJldHVybiAkcmVzb3VyY2UoJy9hcGkvdjEvbGVhZGVyc2hpcC1zdHlsZS9yZXF1ZXN0cy86aWQvJywgbnVsbCwgYWN0aW9ucyk7XG59XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2xlYWRlcnNoaXAtc3R5bGUnKVxuICAgICAgICAuY29udHJvbGxlcignTGVhZGVyc2hpcFN0eWxlUmVxdWVzdENvbnRyb2xsZXInLCBMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0Q29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0Q29udHJvbGxlcihwYW5lbCwgTGVhZGVyc2hpcFN0eWxlUmVxdWVzdFNlcnZpY2UsIFVzZXJzLCAkdGltZW91dCwgJG1vZGFsSW5zdGFuY2UsICRyb290U2NvcGUpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0ucG90ZW50aWFsUmV2aWV3ZXJzID0gW107XG4gICAgICAgIHZtLnN1YmplY3QgPSAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLmVtcGxveWVlO1xuICAgICAgICB2bS5tZXNzYWdlID0gJyc7XG4gICAgICAgIHZtLnNlbmRMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0cyA9IHNlbmRMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0cztcbiAgICAgICAgdm0uc3RlcE5leHQgPSBzdGVwTmV4dDtcbiAgICAgICAgdm0uc3RlcEJhY2sgPSBzdGVwQmFjaztcbiAgICAgICAgdm0uY2FuY2VsID0gY2FuY2VsO1xuICAgICAgICB2bS5wYW5lbF9pbmRleCA9IHBhbmVsO1xuICAgICAgICB2bS5lbmFibGVTZW5kID0gdHJ1ZTtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAgICAgZ2V0UG90ZW50aWFsUmV2aWV3ZXJzKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRQb3RlbnRpYWxSZXZpZXdlcnMoKSB7XG4gICAgICAgICAgICByZXR1cm4gVXNlcnMucXVlcnkoKS4kcHJvbWlzZVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0ucG90ZW50aWFsUmV2aWV3ZXJzID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZtLnBvdGVudGlhbFJldmlld2VycztcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNlbmRMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0cygpIHtcbiAgICAgICAgICAgIHZtLmVuYWJsZVNlbmQgPSBmYWxzZTtcbiAgICAgICAgICAgIExlYWRlcnNoaXBTdHlsZVJlcXVlc3RTZXJ2aWNlLnNlbmRMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0cyh2bS5zZWxlY3RlZFJldmlld2Vycywgdm0ubWVzc2FnZSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihzZW50UGVyY2VwdGlvUmVxdWVzdHMpIHtcblxuICAgICAgICAgICAgICAgICAgICAvKiBCaWcgc3VjY2VzcyBtZXNzYWdlICovXG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuc3VjY2Vzc1JlcXVlc3RNZXNzYWdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS5zdWNjZXNzUmVxdWVzdE1lc3NhZ2VSZWNpcGllbnQgPSB2bS5zZWxlY3RlZFJldmlld2VycztcblxuICAgICAgICAgICAgICAgICAgICAvKiBIaWRlIHN1Y2Nlc3MgbWVzc2FnZSBhZnRlciBhIGZldyBzZWNvbmRzICovXG4gICAgICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS5oaWRlUmVxdWVzdE1lc3NhZ2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9LCAxMDAwMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2Uoc2VudFBlcmNlcHRpb1JlcXVlc3RzKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc3RlcE5leHQoKSB7XG4gICAgICAgICAgICB2bS5wYW5lbF9pbmRleCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc3RlcEJhY2soKSB7XG4gICAgICAgICAgICB2bS5wYW5lbF9pbmRleC0tO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygpO1xuICAgICAgICB9XG4gICAgfVxufSgpKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
