;(function() {
"use strict";

QuizController.$inject = ["analytics", "LeadershipStyleService", "Notification", "leadershipStyle", "$location", "$modal", "$modalInstance", "$rootScope", "$scope"];
LeadershipStyleService.$inject = ["$http", "$log", "LeadershipStyleResource"];
LeadershipStyleResource.$inject = ["$resource"];
LeadershipStyleController.$inject = ["LeadershipStyleService", "LeadershipStyleRequestService", "analytics", "$location", "$modal", "$rootScope", "$routeParams", "$scope", "$timeout"];
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

    function createLeadershipStyle(request) {
        return LeadershipStyleResource.create({employee: request.requester.id, assessor: request.reviewer.id, request: request.id, assessment_type: 1}, success, fail).$promise;

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

function LeadershipStyleController(LeadershipStyleService, LeadershipStyleRequestService, analytics, $location, $modal, $rootScope, $routeParams, $scope, $timeout) {
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
        if ($routeParams.requestId) {
            vm.busy = true;
            respondToRequest();
        } else {
            getMyLeadershipStyle();
        }

    };

    function respondToRequest() {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxlYWRlcnNoaXAtc3R5bGUubW9kdWxlLmpzIiwicXVpei5jb250cm9sbGVyLmpzIiwibGVhZGVyc2hpcC1zdHlsZS5zZXJ2aWNlLmpzIiwibGVhZGVyc2hpcC1zdHlsZS5yZXNvdXJjZS5qcyIsImxlYWRlcnNoaXAtc3R5bGUuY29udHJvbGxlci5qcyIsImxlYWRlcnNoaXAtc3R5bGUtcmVxdWVzdC5zZXJ2aWNlLmpzIiwibGVhZGVyc2hpcC1zdHlsZS1yZXF1ZXN0LnJlc291cmNlLmpzIiwibGVhZGVyc2hpcC1zdHlsZS1yZXF1ZXN0LmNvbnRyb2xsZXIuanMiLCJsZWFkZXJzaGlwLXN0eWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLENBQUEsQ0FBQSxXQUFBO0FBQ0E7Ozs7Ozs7OztBQ0RBO0tBQ0EsT0FBQSxvQkFBQSxDQUFBLFdBQUE7O0FBRUE7S0FDQSxPQUFBO0tBQ0EsV0FBQSxrQkFBQTs7QUFFQSxTQUFBLGVBQUEsV0FBQSx3QkFBQSxjQUFBLGlCQUFBLFdBQUEsUUFBQSxnQkFBQSxZQUFBLFFBQUE7SUFDQSxJQUFBLGVBQUEsV0FBQSxnQkFBQTtJQUNBLFVBQUEsVUFBQSxRQUFBLFVBQUEsVUFBQTtJQUNBLElBQUEsS0FBQTs7SUFFQSxHQUFBLGtCQUFBO0lBQ0EsR0FBQSxjQUFBO0lBQ0EsR0FBQSxPQUFBO0lBQ0EsR0FBQSxTQUFBO0lBQ0EsR0FBQSxRQUFBO0lBQ0EsR0FBQSxpQkFBQTtJQUNBLEdBQUEsbUJBQUE7SUFDQSxHQUFBLFlBQUE7SUFDQSxHQUFBLG9CQUFBO0lBQ0EsR0FBQSxTQUFBO0lBQ0EsR0FBQSxXQUFBLFdBQUEsWUFBQTtJQUNBLEdBQUEsaUJBQUE7SUFDQSxHQUFBLFNBQUE7O0lBRUE7O0lBRUEsU0FBQSxXQUFBO1FBQ0EsSUFBQSxnQkFBQSxlQUFBO1lBQ0EsR0FBQSxpQkFBQSxnQkFBQSxjQUFBOztRQUVBOzs7SUFHQSxTQUFBLGFBQUE7UUFDQSxJQUFBLEdBQUEsZ0JBQUEsYUFBQSxDQUFBLEdBQUEsZ0JBQUEsZUFBQTtZQUNBLElBQUEsQ0FBQSxHQUFBLGdCQUFBLFdBQUE7Z0JBQ0EsR0FBQSxnQkFBQSxXQUFBLEdBQUEsZ0JBQUEsU0FBQTtnQkFDQSxHQUFBLGdCQUFBLFlBQUE7Z0JBQ0EsdUJBQUEsc0JBQUEsR0FBQTs2QkFDQSxLQUFBLFNBQUEsT0FBQTtnQ0FDQSxHQUFBLGtCQUFBO2dDQUNBLEdBQUEsT0FBQTs7OztZQUlBLEdBQUEsT0FBQSxLQUFBLENBQUEsVUFBQSxhQUFBLFNBQUEsR0FBQSxnQkFBQTtZQUNBLEdBQUEsT0FBQSxLQUFBLENBQUEsVUFBQSxZQUFBLFNBQUEsR0FBQSxnQkFBQTtZQUNBLEdBQUEsT0FBQSxLQUFBLENBQUEsVUFBQSxhQUFBLFNBQUEsR0FBQSxnQkFBQTtZQUNBLEdBQUEsT0FBQSxLQUFBLENBQUEsVUFBQSxhQUFBLFNBQUEsR0FBQSxnQkFBQTs7OztJQUlBLFNBQUEsU0FBQTtRQUNBLGVBQUE7OztJQUdBLFNBQUEsUUFBQTtRQUNBLGVBQUEsTUFBQSxHQUFBO1FBQ0EsSUFBQSxDQUFBLEdBQUEsZ0JBQUEsV0FBQTtZQUNBLGFBQUEsUUFBQTs7OztJQUlBLFNBQUEsZUFBQSxRQUFBO1FBQ0EsR0FBQSxPQUFBO1FBQ0EsR0FBQSxnQkFBQSx5QkFBQSxHQUFBLGdCQUFBLGNBQUE7UUFDQSxJQUFBLEdBQUEsZ0JBQUEsY0FBQSxRQUFBO1lBQ0EsSUFBQSxHQUFBLGdCQUFBLGNBQUEsT0FBQSxNQUFBLE9BQUEsSUFBQTtnQkFDQSxJQUFBLFVBQUEsQ0FBQSxPQUFBO2dCQUNBLFFBQUEsUUFBQSxHQUFBLGdCQUFBLFNBQUEsVUFBQSxPQUFBO29CQUNBLElBQUEsR0FBQSxnQkFBQSxjQUFBLE9BQUEsTUFBQSxPQUFBO3dCQUNBLFFBQUEsS0FBQTs7O2dCQUdBLEdBQUEsZ0JBQUEsVUFBQTs7ZUFFQTtZQUNBLEdBQUEsZ0JBQUEsUUFBQSxLQUFBLE9BQUE7O1FBRUEsR0FBQSxnQkFBQSxXQUFBLEdBQUEsZ0JBQUEsU0FBQTtRQUNBLHVCQUFBLHNCQUFBLEdBQUE7YUFDQSxLQUFBLFNBQUEsT0FBQTtnQkFDQSxHQUFBLGtCQUFBO2dCQUNBO2dCQUNBLElBQUEsR0FBQSxnQkFBQSxlQUFBO29CQUNBLEdBQUEsaUJBQUEsR0FBQSxnQkFBQSxjQUFBO3VCQUNBO29CQUNBLEdBQUEsaUJBQUE7O2dCQUVBLEdBQUEsT0FBQTs7Ozs7SUFLQSxTQUFBLGtCQUFBO1FBQ0EsR0FBQSxPQUFBO1FBQ0EsdUJBQUEscUJBQUEsR0FBQTthQUNBLEtBQUEsU0FBQSxPQUFBO2dCQUNBLEdBQUEsa0JBQUE7Z0JBQ0EsSUFBQSxHQUFBLGdCQUFBLGVBQUE7b0JBQ0EsR0FBQSxpQkFBQSxHQUFBLGdCQUFBLGNBQUE7dUJBQ0E7b0JBQ0EsR0FBQSxpQkFBQTs7Z0JBRUEsR0FBQSxPQUFBOzs7OztJQUtBLFNBQUEsWUFBQTtRQUNBLEdBQUEsT0FBQTtRQUNBLHVCQUFBLHNCQUFBLEdBQUE7YUFDQSxLQUFBLFNBQUEsT0FBQTtnQkFDQSxHQUFBLFlBQUE7Z0JBQ0EsR0FBQSxlQUFBO2dCQUNBLEdBQUEsa0JBQUE7Z0JBQ0EsR0FBQSxPQUFBOzs7OztJQUtBLFNBQUEsU0FBQTtRQUNBLEdBQUEsT0FBQTtRQUNBLHVCQUFBLG1CQUFBLENBQUEsSUFBQSxHQUFBLGdCQUFBLElBQUEsTUFBQSxHQUFBLGdCQUFBLEtBQUEsSUFBQSxPQUFBLEdBQUEsZ0JBQUEsT0FBQSxXQUFBO2FBQ0EsS0FBQSxTQUFBLE9BQUE7Z0JBQ0EsR0FBQSxrQkFBQTtnQkFDQSxhQUFBLFFBQUE7Z0JBQ0EsZUFBQSxNQUFBO2dCQUNBLElBQUEsZ0JBQUEsSUFBQTtvQkFDQSxVQUFBLEtBQUEsU0FBQSxPQUFBOztnQkFFQSxHQUFBLE9BQUE7Ozs7O0lBS0EsU0FBQSxrQkFBQSxhQUFBLGVBQUE7UUFDQSxPQUFBLEtBQUE7WUFDQSxXQUFBO1lBQ0EsVUFBQTtZQUNBLGFBQUE7WUFDQSxZQUFBO1lBQ0EsU0FBQTtnQkFDQSxlQUFBLFlBQUE7b0JBQ0EsT0FBQTs7Z0JBRUEsYUFBQSxZQUFBO29CQUNBLE9BQUE7Ozs7Ozs7O0FDbEpBO0tBQ0EsT0FBQTtLQUNBLFFBQUEsMEJBQUE7O0FBRUEsU0FBQSx1QkFBQSxPQUFBLE1BQUEseUJBQUE7SUFDQSxPQUFBO1FBQ0EsdUJBQUE7UUFDQSxvQkFBQTtRQUNBLHNCQUFBO1FBQ0EsZ0NBQUE7UUFDQSx1QkFBQTtRQUNBLHNCQUFBO1FBQ0EsdUJBQUE7UUFDQSxzQkFBQTs7O0lBR0EsU0FBQSxzQkFBQSxTQUFBO1FBQ0EsT0FBQSx3QkFBQSxPQUFBLENBQUEsVUFBQSxRQUFBLFVBQUEsSUFBQSxVQUFBLFFBQUEsU0FBQSxJQUFBLFNBQUEsUUFBQSxJQUFBLGlCQUFBLElBQUEsU0FBQSxNQUFBOztRQUVBLFNBQUEsUUFBQSxVQUFBO1lBQ0EsT0FBQTs7O1FBR0EsU0FBQSxLQUFBLFVBQUE7WUFDQSxLQUFBLE1BQUE7Ozs7SUFJQSxTQUFBLG1CQUFBLG1CQUFBO1FBQ0EsT0FBQSx3QkFBQSxJQUFBLENBQUEsSUFBQSxvQkFBQSxTQUFBLE1BQUE7O1FBRUEsU0FBQSxRQUFBLFVBQUE7WUFDQSxPQUFBOzs7UUFHQSxTQUFBLEtBQUEsVUFBQTtZQUNBLEtBQUEsTUFBQTs7OztJQUlBLFNBQUEsdUJBQUE7UUFDQSxPQUFBLHdCQUFBLE1BQUEsQ0FBQSxJQUFBLE9BQUEsU0FBQSxNQUFBOztRQUVBLFNBQUEsUUFBQSxVQUFBO1lBQ0EsT0FBQTs7O1FBR0EsU0FBQSxLQUFBLFVBQUE7WUFDQSxLQUFBLE1BQUE7Ozs7SUFJQSxTQUFBLGlDQUFBO1FBQ0EsT0FBQSx3QkFBQSxjQUFBLE1BQUEsU0FBQSxNQUFBOztRQUVBLFNBQUEsUUFBQSxVQUFBO1lBQ0EsT0FBQTs7O1FBR0EsU0FBQSxLQUFBLFVBQUE7WUFDQSxLQUFBLE1BQUE7Ozs7SUFJQSxTQUFBLHNCQUFBLGlCQUFBO1FBQ0EsT0FBQSx3QkFBQSxPQUFBLENBQUEsSUFBQSxnQkFBQSxLQUFBLGlCQUFBLFNBQUEsTUFBQTs7UUFFQSxTQUFBLFFBQUEsVUFBQTtZQUNBLE9BQUE7OztRQUdBLFNBQUEsS0FBQSxVQUFBO1lBQ0EsS0FBQSxNQUFB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Ozs7QUNnZ0JBIiwiZmlsZSI6ImxlYWRlcnNoaXAtc3R5bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyXG4gICAgLm1vZHVsZSgnbGVhZGVyc2hpcC1zdHlsZScsIFsnbmdSb3V0ZScsICd1aS1ub3RpZmljYXRpb24nXSk7XG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnbGVhZGVyc2hpcC1zdHlsZScpXG4gICAgLmNvbnRyb2xsZXIoJ1F1aXpDb250cm9sbGVyJywgUXVpekNvbnRyb2xsZXIpO1xuXG5mdW5jdGlvbiBRdWl6Q29udHJvbGxlcihhbmFseXRpY3MsIExlYWRlcnNoaXBTdHlsZVNlcnZpY2UsIE5vdGlmaWNhdGlvbiwgbGVhZGVyc2hpcFN0eWxlLCAkbG9jYXRpb24sICRtb2RhbCwgJG1vZGFsSW5zdGFuY2UsICRyb290U2NvcGUsICRzY29wZSkge1xuICAgIHZhciBsb2NhdGlvbl91cmwgPSAnL3F1aXovJyArIGxlYWRlcnNoaXBTdHlsZS5pZDtcbiAgICBhbmFseXRpY3MudHJhY2tQYWdlKCRzY29wZSwgJGxvY2F0aW9uLmFic1VybCgpLCBsb2NhdGlvbl91cmwpO1xuICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICB2bS5sZWFkZXJzaGlwU3R5bGUgPSBsZWFkZXJzaGlwU3R5bGU7XG4gICAgdm0ucGFuZWxfaW5kZXggPSAwO1xuICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICB2bS5jYW5jZWwgPSBjYW5jZWw7XG4gICAgdm0uY2xvc2UgPSBjbG9zZTtcbiAgICB2bS5hbnN3ZXJRdWVzdGlvbiA9IGFuc3dlclF1ZXN0aW9uO1xuICAgIHZtLnByZXZpb3VzUXVlc3Rpb24gPSBwcmV2aW91c1F1ZXN0aW9uO1xuICAgIHZtLnN0YXJ0T3ZlciA9IHN0YXJ0T3ZlcjtcbiAgICB2bS5zaG93V2hvQ2FuU2VlVGhpcyA9IHNob3dXaG9DYW5TZWVUaGlzO1xuICAgIHZtLmZpbmlzaCA9IGZpbmlzaDtcbiAgICB2bS5lbXBsb3llZSA9ICRyb290U2NvcGUuY3VycmVudFVzZXIuZW1wbG95ZWU7XG4gICAgdm0uc2VsZWN0ZWRBbnN3ZXIgPSBudWxsO1xuICAgIHZtLnNjb3JlcyA9IFtdO1xuXG4gICAgYWN0aXZhdGUoKVxuXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgIGlmIChsZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbikge1xuICAgICAgICAgICAgdm0uc2VsZWN0ZWRBbnN3ZXIgPSBsZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbi5hbnN3ZXI7XG4gICAgICAgIH1cbiAgICAgICAgaXNDb21wbGV0ZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQ29tcGxldGUoKSB7XG4gICAgICAgIGlmICh2bS5sZWFkZXJzaGlwU3R5bGUuY29tcGxldGVkIHx8ICF2bS5sZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbikge1xuICAgICAgICAgICAgaWYgKCF2bS5sZWFkZXJzaGlwU3R5bGUuY29tcGxldGVkKSB7XG4gICAgICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlLmFzc2Vzc29yID0gdm0ubGVhZGVyc2hpcFN0eWxlLmFzc2Vzc29yLmlkO1xuICAgICAgICAgICAgICAgIHZtLmxlYWRlcnNoaXBTdHlsZS5jb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIExlYWRlcnNoaXBTdHlsZVNlcnZpY2UudXBkYXRlTGVhZGVyc2hpcFN0eWxlKHZtLmxlYWRlcnNoaXBTdHlsZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5sZWFkZXJzaGlwU3R5bGUgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdm0uc2NvcmVzLnB1c2goeydzdHlsZScgOiAnVmlzaW9uYXJ5JywgJ3Njb3JlJzogdm0ubGVhZGVyc2hpcFN0eWxlLnZpc2lvbmFyeV9zY29yZX0pO1xuICAgICAgICAgICAgdm0uc2NvcmVzLnB1c2goeydzdHlsZScgOiAnT3BlcmF0b3InLCAnc2NvcmUnOiB2bS5sZWFkZXJzaGlwU3R5bGUub3BlcmF0b3Jfc2NvcmV9KTtcbiAgICAgICAgICAgIHZtLnNjb3Jlcy5wdXNoKHsnc3R5bGUnIDogJ1Byb2Nlc3NvcicsICdzY29yZSc6IHZtLmxlYWRlcnNoaXBTdHlsZS5wcm9jZXNzb3Jfc2NvcmV9KTtcbiAgICAgICAgICAgIHZtLnNjb3Jlcy5wdXNoKHsnc3R5bGUnIDogJ1N5bmVyZ2lzdCcsICdzY29yZSc6IHZtLmxlYWRlcnNoaXBTdHlsZS5zeW5lcmdpc3Rfc2NvcmV9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSh2bS5sZWFkZXJzaGlwU3R5bGUpXG4gICAgICAgIGlmICghdm0ubGVhZGVyc2hpcFN0eWxlLmNvbXBsZXRlZCkge1xuICAgICAgICAgICAgTm90aWZpY2F0aW9uLnN1Y2Nlc3MoJ1lvdXIgcHJvZ3Jlc3MgaGFzIGJlZW4gc2F2ZWQuJylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFuc3dlclF1ZXN0aW9uKGFuc3dlcikge1xuICAgICAgICB2bS5idXN5ID0gdHJ1ZTtcbiAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlLmxhc3RfcXVlc3Rpb25fYW5zd2VyZWQgPSB2bS5sZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbi5pZDtcbiAgICAgICAgaWYgKHZtLmxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uLmFuc3dlcikge1xuICAgICAgICAgICAgaWYgKHZtLmxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uLmFuc3dlci5pZCAhPSBhbnN3ZXIuaWQpIHtcbiAgICAgICAgICAgICAgICB2YXIgYW5zd2VycyA9IFthbnN3ZXIuaWRdO1xuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5sZWFkZXJzaGlwU3R5bGUuYW5zd2VycywgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2bS5sZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbi5hbnN3ZXIuaWQgIT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuc3dlcnMucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHZtLmxlYWRlcnNoaXBTdHlsZS5hbnN3ZXJzID0gYW5zd2VycztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZtLmxlYWRlcnNoaXBTdHlsZS5hbnN3ZXJzLnB1c2goYW5zd2VyLmlkKTtcbiAgICAgICAgfVxuICAgICAgICB2bS5sZWFkZXJzaGlwU3R5bGUuYXNzZXNzb3IgPSB2bS5sZWFkZXJzaGlwU3R5bGUuYXNzZXNzb3IuaWQ7XG4gICAgICAgIExlYWRlcnNoaXBTdHlsZVNlcnZpY2UudXBkYXRlTGVhZGVyc2hpcFN0eWxlKHZtLmxlYWRlcnNoaXBTdHlsZSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIGlzQ29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICBpZiAodm0ubGVhZGVyc2hpcFN0eWxlLm5leHRfcXVlc3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRBbnN3ZXIgPSB2bS5sZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbi5hbnN3ZXI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRBbnN3ZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2bS5idXN5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJldmlvdXNRdWVzdGlvbigpe1xuICAgICAgICB2bS5idXN5ID0gdHJ1ZTtcbiAgICAgICAgTGVhZGVyc2hpcFN0eWxlU2VydmljZS5nb1RvUHJldmlvdXNRdWVzdGlvbih2bS5sZWFkZXJzaGlwU3R5bGUpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgICAgIHZtLmxlYWRlcnNoaXBTdHlsZSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICBpZiAodm0ubGVhZGVyc2hpcFN0eWxlLm5leHRfcXVlc3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRBbnN3ZXIgPSB2bS5sZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbi5hbnN3ZXI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRBbnN3ZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2bS5idXN5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RhcnRPdmVyKCkge1xuICAgICAgICB2bS5idXN5ID0gdHJ1ZTtcbiAgICAgICAgTGVhZGVyc2hpcFN0eWxlU2VydmljZS5yZXRha2VMZWFkZXJzaGlwU3R5bGUodm0ubGVhZGVyc2hpcFN0eWxlKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgICAgICAgICB2bS5wYW5lbF9pbmRleD0wO1xuICAgICAgICAgICAgICAgIHZtLnNlbGVjdGVkQW5zd2VyPW51bGw7XG4gICAgICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaW5pc2goKSB7XG4gICAgICAgIHZtLmJ1c3kgPSB0cnVlO1xuICAgICAgICBMZWFkZXJzaGlwU3R5bGVTZXJ2aWNlLnVwZGF0ZUVtcGxveWVlWm9uZSh7aWQ6IHZtLmxlYWRlcnNoaXBTdHlsZS5pZCwgem9uZTogdm0ubGVhZGVyc2hpcFN0eWxlLnpvbmUuaWQsIG5vdGVzOiB2bS5sZWFkZXJzaGlwU3R5bGUubm90ZXMsIGNvbXBsZXRlZDogdHJ1ZX0pXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgICAgIHZtLmxlYWRlcnNoaXBTdHlsZSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICBOb3RpZmljYXRpb24uc3VjY2VzcygnWW91ciBxdWl6IHJlc3VsdHMgaGFzIGJlZW4gc2hhcmVkLicpXG4gICAgICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2UocmVzdWx0KTtcbiAgICAgICAgICAgICAgICBpZiAobGVhZGVyc2hpcFN0eWxlLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvaWQvJyArIHJlc3VsdC5pZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaG93V2hvQ2FuU2VlVGhpcyhlbXBsb3llZV9pZCwgZW1wbG95ZWVfdmlldykge1xuICAgICAgICAkbW9kYWwub3Blbih7XG4gICAgICAgICAgICBhbmltYXRpb246IHRydWUsXG4gICAgICAgICAgICBiYWNrZHJvcDogJ3N0YXRpYycsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9zdGF0aWMvYW5ndWxhci9wYXJ0aWFscy9fbW9kYWxzL3doby1jYW4tc2VlLXRoaXMuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnU3VwcG9ydFRlYW1DdHJsJyxcbiAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICBlbXBsb3llZV92aWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbXBsb3llZV92aWV3XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlbXBsb3llZV9pZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZW1wbG95ZWVfaWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2xlYWRlcnNoaXAtc3R5bGUnKVxuICAgIC5mYWN0b3J5KCdMZWFkZXJzaGlwU3R5bGVTZXJ2aWNlJywgTGVhZGVyc2hpcFN0eWxlU2VydmljZSk7XG5cbmZ1bmN0aW9uIExlYWRlcnNoaXBTdHlsZVNlcnZpY2UoJGh0dHAsICRsb2csIExlYWRlcnNoaXBTdHlsZVJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY3JlYXRlTGVhZGVyc2hpcFN0eWxlOiBjcmVhdGVMZWFkZXJzaGlwU3R5bGUsXG4gICAgICAgIGdldExlYWRlcnNoaXBTdHlsZTogZ2V0TGVhZGVyc2hpcFN0eWxlLFxuICAgICAgICBnZXRNeUxlYWRlcnNoaXBTdHlsZTogZ2V0TXlMZWFkZXJzaGlwU3R5bGUsXG4gICAgICAgIGdldE15VW5maW5pc2hlZExlYWRlcnNoaXBTdHlsZTogZ2V0TXlVbmZpbmlzaGVkTGVhZGVyc2hpcFN0eWxlLFxuICAgICAgICByZXRha2VMZWFkZXJzaGlwU3R5bGU6IHJldGFrZUxlYWRlcnNoaXBTdHlsZSxcbiAgICAgICAgc2hhcmVMZWFkZXJzaGlwU3R5bGU6IHNoYXJlTGVhZGVyc2hpcFN0eWxlLFxuICAgICAgICB1cGRhdGVMZWFkZXJzaGlwU3R5bGU6IHVwZGF0ZUxlYWRlcnNoaXBTdHlsZSxcbiAgICAgICAgZ29Ub1ByZXZpb3VzUXVlc3Rpb246IGdvVG9QcmV2aW91c1F1ZXN0aW9uXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUxlYWRlcnNoaXBTdHlsZShyZXF1ZXN0KSB7XG4gICAgICAgIHJldHVybiBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZS5jcmVhdGUoe2VtcGxveWVlOiByZXF1ZXN0LnJlcXVlc3Rlci5pZCwgYXNzZXNzb3I6IHJlcXVlc3QucmV2aWV3ZXIuaWQsIHJlcXVlc3Q6IHJlcXVlc3QuaWQsIGFzc2Vzc21lbnRfdHlwZTogMX0sIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ2NyZWF0ZUxlYWRlcnNoaXBTdHlsZSBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldExlYWRlcnNoaXBTdHlsZShsZWFkZXJzaGlwU3R5bGVJZCkge1xuICAgICAgICByZXR1cm4gTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2UuZ2V0KHtpZDogbGVhZGVyc2hpcFN0eWxlSWR9LCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdnZXRMZWFkZXJzaGlwU3R5bGUgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRNeUxlYWRlcnNoaXBTdHlsZSgpIHtcbiAgICAgICAgcmV0dXJuIExlYWRlcnNoaXBTdHlsZVJlc291cmNlLmdldE15KHtpZDogJ215J30sIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ2dldE15TGVhZGVyc2hpcFN0eWxlIGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0TXlVbmZpbmlzaGVkTGVhZGVyc2hpcFN0eWxlKCkge1xuICAgICAgICByZXR1cm4gTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2UuZ2V0VW5maW5pc2hlZChudWxsLCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdnZXRVbmZpbmlzaGVkIGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmV0YWtlTGVhZGVyc2hpcFN0eWxlKGxlYWRlcnNoaXBTdHlsZSkge1xuICAgICAgICByZXR1cm4gTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2UucmV0YWtlKHtpZDogbGVhZGVyc2hpcFN0eWxlLmlkfSwgbGVhZGVyc2hpcFN0eWxlLCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdyZXRha2VMZWFkZXJzaGlwU3R5bGUgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaGFyZUxlYWRlcnNoaXBTdHlsZShsZWFkZXJzaGlwU3R5bGUpIHtcbiAgICAgICAgcmV0dXJuIExlYWRlcnNoaXBTdHlsZVJlc291cmNlLnNoYXJlKHtpZDogbGVhZGVyc2hpcFN0eWxlLmlkfSwgbGVhZGVyc2hpcFN0eWxlLCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdzaGFyZUxlYWRlcnNoaXBTdHlsZSBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZUxlYWRlcnNoaXBTdHlsZShsZWFkZXJzaGlwU3R5bGUpIHtcbiAgICAgICAgcmV0dXJuIExlYWRlcnNoaXBTdHlsZVJlc291cmNlLnVwZGF0ZSh7aWQ6IGxlYWRlcnNoaXBTdHlsZS5pZH0sIGxlYWRlcnNoaXBTdHlsZSwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcigndXBkYXRlTGVhZGVyc2hpcFN0eWxlIGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ29Ub1ByZXZpb3VzUXVlc3Rpb24obGVhZGVyc2hpcFN0eWxlKSB7XG4gICAgICAgIHJldHVybiBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZS5nb1RvUHJldmlvdXNRdWVzdGlvbih7aWQ6IGxlYWRlcnNoaXBTdHlsZS5pZH0sIG51bGwsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ2dvVG9QcmV2aW91c1F1ZXN0aW9uIGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxufSIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdsZWFkZXJzaGlwLXN0eWxlJylcbiAgICAuZmFjdG9yeSgnTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2UnLCBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZSk7XG5cbmZ1bmN0aW9uIExlYWRlcnNoaXBTdHlsZVJlc291cmNlKCRyZXNvdXJjZSkge1xuICAgIHZhciBhY3Rpb25zID0ge1xuICAgICAgICAnY3JlYXRlJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL2xlYWRlcnNoaXAtc3R5bGUvY3JlYXRlLydcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldCc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL2xlYWRlcnNoaXAtc3R5bGUvOmlkLydcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldE15Jzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvbGVhZGVyc2hpcC1zdHlsZS86aWQvJ1xuICAgICAgICB9LFxuICAgICAgICAnZ2V0VW5maW5pc2hlZCc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL2xlYWRlcnNoaXAtc3R5bGUvdW5maW5pc2hlZC8nXG4gICAgICAgIH0sXG4gICAgICAgICdyZXRha2UnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlLzppZC9yZXRha2UvJ1xuICAgICAgICB9LFxuICAgICAgICAnc2hhcmUnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlLzppZC9zaGFyZS8nXG4gICAgICAgIH0sXG4gICAgICAgICd1cGRhdGUnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlLzppZC91cGRhdGUvJ1xuICAgICAgICB9LFxuICAgICAgICAnZ29Ub1ByZXZpb3VzUXVlc3Rpb24nOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlLzppZC9wcmV2aW91cy1xdWVzdGlvbi8nXG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiAkcmVzb3VyY2UoJy9hcGkvdjEvbGVhZGVyc2hpcC1zdHlsZS86aWQvJywgbnVsbCwgYWN0aW9ucyk7XG59XG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnbGVhZGVyc2hpcC1zdHlsZScpXG4gICAgLmNvbnRyb2xsZXIoJ0xlYWRlcnNoaXBTdHlsZUNvbnRyb2xsZXInLCBMZWFkZXJzaGlwU3R5bGVDb250cm9sbGVyKTtcblxuZnVuY3Rpb24gTGVhZGVyc2hpcFN0eWxlQ29udHJvbGxlcihMZWFkZXJzaGlwU3R5bGVTZXJ2aWNlLCBMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0U2VydmljZSwgYW5hbHl0aWNzLCAkbG9jYXRpb24sICRtb2RhbCwgJHJvb3RTY29wZSwgJHJvdXRlUGFyYW1zLCAkc2NvcGUsICR0aW1lb3V0KSB7XG4gICAgLyogU2luY2UgdGhpcyBwYWdlIGNhbiBiZSB0aGUgcm9vdCBmb3Igc29tZSB1c2VycyBsZXQncyBtYWtlIHN1cmUgd2UgY2FwdHVyZSB0aGUgY29ycmVjdCBwYWdlICovXG4gICAgdmFyIGxvY2F0aW9uX3VybCA9ICRsb2NhdGlvbi51cmwoKS5pbmRleE9mKCcvaWQnKSA8IDAgPyAnL2lkJyA6ICRsb2NhdGlvbi51cmwoKTtcbiAgICBhbmFseXRpY3MudHJhY2tQYWdlKCRzY29wZSwgJGxvY2F0aW9uLmFic1VybCgpLCBsb2NhdGlvbl91cmwpO1xuXG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5idXN5ID0gdHJ1ZTtcbiAgICB2bS5zaG93RW1wdHlTY3JlZW4gPSBmYWxzZTtcbiAgICB2bS5teUxlYWRlcnNoaXBTdHlsZSA9IG51bGw7XG4gICAgdm0udGFrZVF1aXogPSB0YWtlUXVpejtcbiAgICB2bS5yZXF1ZXN0TGVhZGVyc2hpcFN0eWxlID0gcmVxdWVzdExlYWRlcnNoaXBTdHlsZTtcbiAgICAkcm9vdFNjb3BlLnN1Y2Nlc3NSZXF1ZXN0TWVzc2FnZSA9IGZhbHNlO1xuICAgICRyb290U2NvcGUuaGlkZU1lc3NhZ2UgPSBmYWxzZTtcbiAgICAkcm9vdFNjb3BlLmhpZGVSZXF1ZXN0TWVzc2FnZSA9IGZhbHNlO1xuICAgIGFjdGl2YXRlKCk7XG5cbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgaWYgKCRyb3V0ZVBhcmFtcy5yZXF1ZXN0SWQpIHtcbiAgICAgICAgICAgIHZtLmJ1c3kgPSB0cnVlO1xuICAgICAgICAgICAgcmVzcG9uZFRvUmVxdWVzdCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ2V0TXlMZWFkZXJzaGlwU3R5bGUoKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHJlc3BvbmRUb1JlcXVlc3QoKSB7XG4gICAgICAgIExlYWRlcnNoaXBTdHlsZVJlcXVlc3RTZXJ2aWNlLmdldFJlcXVlc3QoJHJvdXRlUGFyYW1zLnJlcXVlc3RJZClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcXVlc3Qpe1xuICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0LnN1Ym1pc3Npb25faWQpIHtcbiAgICAgICAgICAgICAgICAgICAgTGVhZGVyc2hpcFN0eWxlU2VydmljZS5nZXRMZWFkZXJzaGlwU3R5bGUocmVxdWVzdC5zdWJtaXNzaW9uX2lkKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRha2VRdWl6KHJlc3BvbnNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgTGVhZGVyc2hpcFN0eWxlU2VydmljZS5jcmVhdGVMZWFkZXJzaGlwU3R5bGUocmVxdWVzdClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWtlUXVpeihyZXNwb25zZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2bS5idXN5ID0gZmFsc2U7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0TXlMZWFkZXJzaGlwU3R5bGUoKSB7XG4gICAgICAgIHZtLmJ1c3kgPSB0cnVlO1xuICAgICAgICBMZWFkZXJzaGlwU3R5bGVTZXJ2aWNlLmdldE15TGVhZGVyc2hpcFN0eWxlKClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGxlYWRlcnNoaXBTdHlsZSl7XG4gICAgICAgICAgICAgICAgdm0ubXlMZWFkZXJzaGlwU3R5bGUgPSBsZWFkZXJzaGlwU3R5bGU7XG4gICAgICAgICAgICAgICAgdm0uYnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2bS5idXN5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0YWtlUXVpeihsZWFkZXJzaGlwU3R5bGUpIHtcbiAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG4gICAgICAgICAgICBhbmltYXRpb246IHRydWUsXG4gICAgICAgICAgICB3aW5kb3dDbGFzczogJ3h4LWRpYWxvZyBmYWRlIHpvb20nLFxuICAgICAgICAgICAgYmFja2Ryb3A6ICdzdGF0aWMnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvc3RhdGljL2FuZ3VsYXIvbGVhZGVyc2hpcC1zdHlsZS9wYXJ0aWFscy9fbW9kYWxzL3F1aXouaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnUXVpekNvbnRyb2xsZXIgYXMgcXVpeicsXG4gICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgIGxlYWRlcnNoaXBTdHlsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlYWRlcnNoaXBTdHlsZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKFxuICAgICAgICAgICAgZnVuY3Rpb24gKGxlYWRlcnNoaXBTdHlsZSkge1xuICAgICAgICAgICAgICAgIGlmIChsZWFkZXJzaGlwU3R5bGUuZW1wbG95ZWUuaWQgPT0gbGVhZGVyc2hpcFN0eWxlLmFzc2Vzc29yLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLm15TGVhZGVyc2hpcFN0eWxlID0gbGVhZGVyc2hpcFN0eWxlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0TXlSZWNlbnRseVNlbnRSZXF1ZXN0cygpIHtcbiAgICAgICAgTGVhZGVyc2hpcFN0eWxlUmVxdWVzdFNlcnZpY2UuZ2V0TXlSZWNlbnRseVNlbnRSZXF1ZXN0cygpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHZtLm15UmVjZW50bHlTZW50UmVxdWVzdHMgPSBkYXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiB2bS5teVJlY2VudGx5U2VudFJlcXVlc3RzO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiByZXF1ZXN0TGVhZGVyc2hpcFN0eWxlKHBhbmVsKSB7XG4gICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IHRydWUsXG4gICAgICAgICAgICAgICAgd2luZG93Q2xhc3M6ICd4eC1kaWFsb2cgZmFkZSB6b29tJyxcbiAgICAgICAgICAgICAgICBiYWNrZHJvcDogJ3N0YXRpYycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvc3RhdGljL2FuZ3VsYXIvbGVhZGVyc2hpcC1zdHlsZS9wYXJ0aWFscy9fbW9kYWxzL3JlcXVlc3QtbGVhZGVyc2hpcC1zdHlsZS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTGVhZGVyc2hpcFN0eWxlUmVxdWVzdENvbnRyb2xsZXIgYXMgcmVxdWVzdCcsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICBwYW5lbDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhbmVsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG1vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4oXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKHNlbnRMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0cykge1xuICAgICAgICAgICAgICAgICAgICBnZXRNeVJlY2VudGx5U2VudFJlcXVlc3RzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxufVxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2xlYWRlcnNoaXAtc3R5bGUnKVxuICAgIC5mYWN0b3J5KCdMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0U2VydmljZScsIExlYWRlcnNoaXBTdHlsZVJlcXVlc3RTZXJ2aWNlKTtcblxuZnVuY3Rpb24gTGVhZGVyc2hpcFN0eWxlUmVxdWVzdFNlcnZpY2UoJGxvZywgTGVhZGVyc2hpcFN0eWxlUmVxdWVzdFJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2VuZExlYWRlcnNoaXBTdHlsZVJlcXVlc3RzOiBzZW5kTGVhZGVyc2hpcFN0eWxlUmVxdWVzdHMsXG4gICAgICAgIGdldE15UmVjZW50bHlTZW50UmVxdWVzdHM6IGdldE15UmVjZW50bHlTZW50UmVxdWVzdHMsXG4gICAgICAgIGdldFJlcXVlc3Q6IGdldFJlcXVlc3RcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gc2VuZExlYWRlcnNoaXBTdHlsZVJlcXVlc3RzKHJldmlld2VycywgbWVzc2FnZSkge1xuICAgICAgICB2YXIgcmVxdWVzdHMgPSBbXTtcblxuICAgICAgICBmb3IodmFyIGk9MDsgaSA8IHJldmlld2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHJldmlld2VyX2lkID0gcmV2aWV3ZXJzW2ldLnBrID8gcmV2aWV3ZXJzW2ldLnBrIDogcmV2aWV3ZXJzW2ldLmlkXG4gICAgICAgICAgICByZXF1ZXN0cy5wdXNoKHtyZXZpZXdlcjogcmV2aWV3ZXJfaWQsIG1lc3NhZ2U6IG1lc3NhZ2V9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0UmVzb3VyY2Uuc2VuZExlYWRlcnNoaXBTdHlsZVJlcXVlc3RzKHJlcXVlc3RzLCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHNlbnRMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0cykge1xuICAgICAgICAgICAgcmV0dXJuIHNlbnRMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0cztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ3NlbmRMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0cyBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE15UmVjZW50bHlTZW50UmVxdWVzdHMoKSB7XG4gICAgICAgIHJldHVybiBMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0UmVzb3VyY2UuZ2V0TXlSZWNlbnRseVNlbnRSZXF1ZXN0cyhudWxsLCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdnZXRNeVJlY2VudGx5U2VudFJlcXVlc3RzIGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UmVxdWVzdChpZCkge1xuICAgICAgICByZXR1cm4gTGVhZGVyc2hpcFN0eWxlUmVxdWVzdFJlc291cmNlLmdldFJlcXVlc3Qoe2lkOiBpZH0sIG51bGwsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ2dldFJlcXVlc3QgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2xlYWRlcnNoaXAtc3R5bGUnKVxuICAgIC5mYWN0b3J5KCdMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0UmVzb3VyY2UnLCBMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0UmVzb3VyY2UpO1xuXG5mdW5jdGlvbiBMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0UmVzb3VyY2UoJHJlc291cmNlKSB7XG4gICAgdmFyIGFjdGlvbnMgPSB7XG4gICAgICAgICdnZXRNeVJlY2VudGx5U2VudFJlcXVlc3RzJzoge1xuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlL3JlcXVlc3RzL3JlY2VudGx5LXNlbnQvJyxcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0cyc6IHtcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvbGVhZGVyc2hpcC1zdHlsZS9yZXF1ZXN0cy90b2RvLycsXG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgaXNBcnJheTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICAnZ2V0UmVxdWVzdCc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIH0sXG4gICAgICAgICdzZW5kTGVhZGVyc2hpcFN0eWxlUmVxdWVzdHMnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICB9O1xuICAgIHJldHVybiAkcmVzb3VyY2UoJy9hcGkvdjEvbGVhZGVyc2hpcC1zdHlsZS9yZXF1ZXN0cy86aWQvJywgbnVsbCwgYWN0aW9ucyk7XG59XG4iLCIgICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdsZWFkZXJzaGlwLXN0eWxlJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0xlYWRlcnNoaXBTdHlsZVJlcXVlc3RDb250cm9sbGVyJywgTGVhZGVyc2hpcFN0eWxlUmVxdWVzdENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gTGVhZGVyc2hpcFN0eWxlUmVxdWVzdENvbnRyb2xsZXIocGFuZWwsIExlYWRlcnNoaXBTdHlsZVJlcXVlc3RTZXJ2aWNlLCBVc2VycywgJHRpbWVvdXQsICRtb2RhbEluc3RhbmNlLCAkcm9vdFNjb3BlKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZtLnBvdGVudGlhbFJldmlld2VycyA9IFtdO1xuICAgICAgICB2bS5zdWJqZWN0ID0gJHJvb3RTY29wZS5jdXJyZW50VXNlci5lbXBsb3llZTtcbiAgICAgICAgdm0ubWVzc2FnZSA9ICcnO1xuICAgICAgICB2bS5zZW5kTGVhZGVyc2hpcFN0eWxlUmVxdWVzdHMgPSBzZW5kTGVhZGVyc2hpcFN0eWxlUmVxdWVzdHM7XG4gICAgICAgIHZtLnN0ZXBOZXh0ID0gc3RlcE5leHQ7XG4gICAgICAgIHZtLnN0ZXBCYWNrID0gc3RlcEJhY2s7XG4gICAgICAgIHZtLmNhbmNlbCA9IGNhbmNlbDtcbiAgICAgICAgdm0ucGFuZWxfaW5kZXggPSBwYW5lbDtcbiAgICAgICAgdm0uZW5hYmxlU2VuZCA9IHRydWU7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAgIGdldFBvdGVudGlhbFJldmlld2VycygpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0UG90ZW50aWFsUmV2aWV3ZXJzKCkge1xuICAgICAgICAgICAgcmV0dXJuIFVzZXJzLnF1ZXJ5KCkuJHByb21pc2VcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLnBvdGVudGlhbFJldmlld2VycyA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2bS5wb3RlbnRpYWxSZXZpZXdlcnM7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZW5kTGVhZGVyc2hpcFN0eWxlUmVxdWVzdHMoKSB7XG4gICAgICAgICAgICB2bS5lbmFibGVTZW5kID0gZmFsc2U7XG4gICAgICAgICAgICBMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0U2VydmljZS5zZW5kTGVhZGVyc2hpcFN0eWxlUmVxdWVzdHModm0uc2VsZWN0ZWRSZXZpZXdlcnMsIHZtLm1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oc2VudFBlcmNlcHRpb1JlcXVlc3RzKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLyogQmlnIHN1Y2Nlc3MgbWVzc2FnZSAqL1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnN1Y2Nlc3NSZXF1ZXN0TWVzc2FnZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuc3VjY2Vzc1JlcXVlc3RNZXNzYWdlUmVjaXBpZW50ID0gdm0uc2VsZWN0ZWRSZXZpZXdlcnM7XG5cbiAgICAgICAgICAgICAgICAgICAgLyogSGlkZSBzdWNjZXNzIG1lc3NhZ2UgYWZ0ZXIgYSBmZXcgc2Vjb25kcyAqL1xuICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuaGlkZVJlcXVlc3RNZXNzYWdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSwgMTAwMDApO1xuXG4gICAgICAgICAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKHNlbnRQZXJjZXB0aW9SZXF1ZXN0cylcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXBOZXh0KCkge1xuICAgICAgICAgICAgdm0ucGFuZWxfaW5kZXgrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXBCYWNrKCkge1xuICAgICAgICAgICAgdm0ucGFuZWxfaW5kZXgtLTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoKTtcbiAgICAgICAgfVxuICAgIH1cbiIsIjsoZnVuY3Rpb24oKSB7XG5cInVzZSBzdHJpY3RcIjtcblxuYW5ndWxhclxuICAgIC5tb2R1bGUoJ2xlYWRlcnNoaXAtc3R5bGUnLCBbJ25nUm91dGUnLCAndWktbm90aWZpY2F0aW9uJ10pO1xuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnbGVhZGVyc2hpcC1zdHlsZScpXG4gICAgLmNvbnRyb2xsZXIoJ1F1aXpDb250cm9sbGVyJywgUXVpekNvbnRyb2xsZXIpO1xuXG5mdW5jdGlvbiBRdWl6Q29udHJvbGxlcihhbmFseXRpY3MsIExlYWRlcnNoaXBTdHlsZVNlcnZpY2UsIE5vdGlmaWNhdGlvbiwgbGVhZGVyc2hpcFN0eWxlLCAkbG9jYXRpb24sICRtb2RhbCwgJG1vZGFsSW5zdGFuY2UsICRyb290U2NvcGUsICRzY29wZSkge1xuICAgIHZhciBsb2NhdGlvbl91cmwgPSAnL3F1aXovJyArIGxlYWRlcnNoaXBTdHlsZS5pZDtcbiAgICBhbmFseXRpY3MudHJhY2tQYWdlKCRzY29wZSwgJGxvY2F0aW9uLmFic1VybCgpLCBsb2NhdGlvbl91cmwpO1xuICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICB2bS5sZWFkZXJzaGlwU3R5bGUgPSBsZWFkZXJzaGlwU3R5bGU7XG4gICAgdm0ucGFuZWxfaW5kZXggPSAwO1xuICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICB2bS5jYW5jZWwgPSBjYW5jZWw7XG4gICAgdm0uY2xvc2UgPSBjbG9zZTtcbiAgICB2bS5hbnN3ZXJRdWVzdGlvbiA9IGFuc3dlclF1ZXN0aW9uO1xuICAgIHZtLnByZXZpb3VzUXVlc3Rpb24gPSBwcmV2aW91c1F1ZXN0aW9uO1xuICAgIHZtLnN0YXJ0T3ZlciA9IHN0YXJ0T3ZlcjtcbiAgICB2bS5zaG93V2hvQ2FuU2VlVGhpcyA9IHNob3dXaG9DYW5TZWVUaGlzO1xuICAgIHZtLmZpbmlzaCA9IGZpbmlzaDtcbiAgICB2bS5lbXBsb3llZSA9ICRyb290U2NvcGUuY3VycmVudFVzZXIuZW1wbG95ZWU7XG4gICAgdm0uc2VsZWN0ZWRBbnN3ZXIgPSBudWxsO1xuICAgIHZtLnNjb3JlcyA9IFtdO1xuXG4gICAgYWN0aXZhdGUoKVxuXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgIGlmIChsZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbikge1xuICAgICAgICAgICAgdm0uc2VsZWN0ZWRBbnN3ZXIgPSBsZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbi5hbnN3ZXI7XG4gICAgICAgIH1cbiAgICAgICAgaXNDb21wbGV0ZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQ29tcGxldGUoKSB7XG4gICAgICAgIGlmICh2bS5sZWFkZXJzaGlwU3R5bGUuY29tcGxldGVkIHx8ICF2bS5sZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbikge1xuICAgICAgICAgICAgaWYgKCF2bS5sZWFkZXJzaGlwU3R5bGUuY29tcGxldGVkKSB7XG4gICAgICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlLmFzc2Vzc29yID0gdm0ubGVhZGVyc2hpcFN0eWxlLmFzc2Vzc29yLmlkO1xuICAgICAgICAgICAgICAgIHZtLmxlYWRlcnNoaXBTdHlsZS5jb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIExlYWRlcnNoaXBTdHlsZVNlcnZpY2UudXBkYXRlTGVhZGVyc2hpcFN0eWxlKHZtLmxlYWRlcnNoaXBTdHlsZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5sZWFkZXJzaGlwU3R5bGUgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdm0uc2NvcmVzLnB1c2goeydzdHlsZScgOiAnVmlzaW9uYXJ5JywgJ3Njb3JlJzogdm0ubGVhZGVyc2hpcFN0eWxlLnZpc2lvbmFyeV9zY29yZX0pO1xuICAgICAgICAgICAgdm0uc2NvcmVzLnB1c2goeydzdHlsZScgOiAnT3BlcmF0b3InLCAnc2NvcmUnOiB2bS5sZWFkZXJzaGlwU3R5bGUub3BlcmF0b3Jfc2NvcmV9KTtcbiAgICAgICAgICAgIHZtLnNjb3Jlcy5wdXNoKHsnc3R5bGUnIDogJ1Byb2Nlc3NvcicsICdzY29yZSc6IHZtLmxlYWRlcnNoaXBTdHlsZS5wcm9jZXNzb3Jfc2NvcmV9KTtcbiAgICAgICAgICAgIHZtLnNjb3Jlcy5wdXNoKHsnc3R5bGUnIDogJ1N5bmVyZ2lzdCcsICdzY29yZSc6IHZtLmxlYWRlcnNoaXBTdHlsZS5zeW5lcmdpc3Rfc2NvcmV9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSh2bS5sZWFkZXJzaGlwU3R5bGUpXG4gICAgICAgIGlmICghdm0ubGVhZGVyc2hpcFN0eWxlLmNvbXBsZXRlZCkge1xuICAgICAgICAgICAgTm90aWZpY2F0aW9uLnN1Y2Nlc3MoJ1lvdXIgcHJvZ3Jlc3MgaGFzIGJlZW4gc2F2ZWQuJylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFuc3dlclF1ZXN0aW9uKGFuc3dlcikge1xuICAgICAgICB2bS5idXN5ID0gdHJ1ZTtcbiAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlLmxhc3RfcXVlc3Rpb25fYW5zd2VyZWQgPSB2bS5sZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbi5pZDtcbiAgICAgICAgaWYgKHZtLmxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uLmFuc3dlcikge1xuICAgICAgICAgICAgaWYgKHZtLmxlYWRlcnNoaXBTdHlsZS5uZXh0X3F1ZXN0aW9uLmFuc3dlci5pZCAhPSBhbnN3ZXIuaWQpIHtcbiAgICAgICAgICAgICAgICB2YXIgYW5zd2VycyA9IFthbnN3ZXIuaWRdO1xuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5sZWFkZXJzaGlwU3R5bGUuYW5zd2VycywgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2bS5sZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbi5hbnN3ZXIuaWQgIT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuc3dlcnMucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHZtLmxlYWRlcnNoaXBTdHlsZS5hbnN3ZXJzID0gYW5zd2VycztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZtLmxlYWRlcnNoaXBTdHlsZS5hbnN3ZXJzLnB1c2goYW5zd2VyLmlkKTtcbiAgICAgICAgfVxuICAgICAgICB2bS5sZWFkZXJzaGlwU3R5bGUuYXNzZXNzb3IgPSB2bS5sZWFkZXJzaGlwU3R5bGUuYXNzZXNzb3IuaWQ7XG4gICAgICAgIExlYWRlcnNoaXBTdHlsZVNlcnZpY2UudXBkYXRlTGVhZGVyc2hpcFN0eWxlKHZtLmxlYWRlcnNoaXBTdHlsZSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIGlzQ29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICBpZiAodm0ubGVhZGVyc2hpcFN0eWxlLm5leHRfcXVlc3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRBbnN3ZXIgPSB2bS5sZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbi5hbnN3ZXI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRBbnN3ZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2bS5idXN5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJldmlvdXNRdWVzdGlvbigpe1xuICAgICAgICB2bS5idXN5ID0gdHJ1ZTtcbiAgICAgICAgTGVhZGVyc2hpcFN0eWxlU2VydmljZS5nb1RvUHJldmlvdXNRdWVzdGlvbih2bS5sZWFkZXJzaGlwU3R5bGUpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgICAgIHZtLmxlYWRlcnNoaXBTdHlsZSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICBpZiAodm0ubGVhZGVyc2hpcFN0eWxlLm5leHRfcXVlc3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRBbnN3ZXIgPSB2bS5sZWFkZXJzaGlwU3R5bGUubmV4dF9xdWVzdGlvbi5hbnN3ZXI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRBbnN3ZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2bS5idXN5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RhcnRPdmVyKCkge1xuICAgICAgICB2bS5idXN5ID0gdHJ1ZTtcbiAgICAgICAgTGVhZGVyc2hpcFN0eWxlU2VydmljZS5yZXRha2VMZWFkZXJzaGlwU3R5bGUodm0ubGVhZGVyc2hpcFN0eWxlKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgICAgICAgICB2bS5wYW5lbF9pbmRleD0wO1xuICAgICAgICAgICAgICAgIHZtLnNlbGVjdGVkQW5zd2VyPW51bGw7XG4gICAgICAgICAgICAgICAgdm0ubGVhZGVyc2hpcFN0eWxlID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaW5pc2goKSB7XG4gICAgICAgIHZtLmJ1c3kgPSB0cnVlO1xuICAgICAgICBMZWFkZXJzaGlwU3R5bGVTZXJ2aWNlLnVwZGF0ZUVtcGxveWVlWm9uZSh7aWQ6IHZtLmxlYWRlcnNoaXBTdHlsZS5pZCwgem9uZTogdm0ubGVhZGVyc2hpcFN0eWxlLnpvbmUuaWQsIG5vdGVzOiB2bS5sZWFkZXJzaGlwU3R5bGUubm90ZXMsIGNvbXBsZXRlZDogdHJ1ZX0pXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgICAgIHZtLmxlYWRlcnNoaXBTdHlsZSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICBOb3RpZmljYXRpb24uc3VjY2VzcygnWW91ciBxdWl6IHJlc3VsdHMgaGFzIGJlZW4gc2hhcmVkLicpXG4gICAgICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2UocmVzdWx0KTtcbiAgICAgICAgICAgICAgICBpZiAobGVhZGVyc2hpcFN0eWxlLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvaWQvJyArIHJlc3VsdC5pZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaG93V2hvQ2FuU2VlVGhpcyhlbXBsb3llZV9pZCwgZW1wbG95ZWVfdmlldykge1xuICAgICAgICAkbW9kYWwub3Blbih7XG4gICAgICAgICAgICBhbmltYXRpb246IHRydWUsXG4gICAgICAgICAgICBiYWNrZHJvcDogJ3N0YXRpYycsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9zdGF0aWMvYW5ndWxhci9wYXJ0aWFscy9fbW9kYWxzL3doby1jYW4tc2VlLXRoaXMuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnU3VwcG9ydFRlYW1DdHJsJyxcbiAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICBlbXBsb3llZV92aWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbXBsb3llZV92aWV3XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlbXBsb3llZV9pZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZW1wbG95ZWVfaWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnbGVhZGVyc2hpcC1zdHlsZScpXG4gICAgLmZhY3RvcnkoJ0xlYWRlcnNoaXBTdHlsZVNlcnZpY2UnLCBMZWFkZXJzaGlwU3R5bGVTZXJ2aWNlKTtcblxuZnVuY3Rpb24gTGVhZGVyc2hpcFN0eWxlU2VydmljZSgkaHR0cCwgJGxvZywgTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBjcmVhdGVMZWFkZXJzaGlwU3R5bGU6IGNyZWF0ZUxlYWRlcnNoaXBTdHlsZSxcbiAgICAgICAgZ2V0TGVhZGVyc2hpcFN0eWxlOiBnZXRMZWFkZXJzaGlwU3R5bGUsXG4gICAgICAgIGdldE15TGVhZGVyc2hpcFN0eWxlOiBnZXRNeUxlYWRlcnNoaXBTdHlsZSxcbiAgICAgICAgZ2V0TXlVbmZpbmlzaGVkTGVhZGVyc2hpcFN0eWxlOiBnZXRNeVVuZmluaXNoZWRMZWFkZXJzaGlwU3R5bGUsXG4gICAgICAgIHJldGFrZUxlYWRlcnNoaXBTdHlsZTogcmV0YWtlTGVhZGVyc2hpcFN0eWxlLFxuICAgICAgICBzaGFyZUxlYWRlcnNoaXBTdHlsZTogc2hhcmVMZWFkZXJzaGlwU3R5bGUsXG4gICAgICAgIHVwZGF0ZUxlYWRlcnNoaXBTdHlsZTogdXBkYXRlTGVhZGVyc2hpcFN0eWxlLFxuICAgICAgICBnb1RvUHJldmlvdXNRdWVzdGlvbjogZ29Ub1ByZXZpb3VzUXVlc3Rpb25cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlTGVhZGVyc2hpcFN0eWxlKHJlcXVlc3QpIHtcbiAgICAgICAgcmV0dXJuIExlYWRlcnNoaXBTdHlsZVJlc291cmNlLmNyZWF0ZSh7ZW1wbG95ZWU6IHJlcXVlc3QucmVxdWVzdGVyLmlkLCBhc3Nlc3NvcjogcmVxdWVzdC5yZXZpZXdlci5pZCwgcmVxdWVzdDogcmVxdWVzdC5pZCwgYXNzZXNzbWVudF90eXBlOiAxfSwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignY3JlYXRlTGVhZGVyc2hpcFN0eWxlIGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0TGVhZGVyc2hpcFN0eWxlKGxlYWRlcnNoaXBTdHlsZUlkKSB7XG4gICAgICAgIHJldHVybiBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZS5nZXQoe2lkOiBsZWFkZXJzaGlwU3R5bGVJZH0sIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ2dldExlYWRlcnNoaXBTdHlsZSBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE15TGVhZGVyc2hpcFN0eWxlKCkge1xuICAgICAgICByZXR1cm4gTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2UuZ2V0TXkoe2lkOiAnbXknfSwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignZ2V0TXlMZWFkZXJzaGlwU3R5bGUgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRNeVVuZmluaXNoZWRMZWFkZXJzaGlwU3R5bGUoKSB7XG4gICAgICAgIHJldHVybiBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZS5nZXRVbmZpbmlzaGVkKG51bGwsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ2dldFVuZmluaXNoZWQgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXRha2VMZWFkZXJzaGlwU3R5bGUobGVhZGVyc2hpcFN0eWxlKSB7XG4gICAgICAgIHJldHVybiBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZS5yZXRha2Uoe2lkOiBsZWFkZXJzaGlwU3R5bGUuaWR9LCBsZWFkZXJzaGlwU3R5bGUsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ3JldGFrZUxlYWRlcnNoaXBTdHlsZSBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNoYXJlTGVhZGVyc2hpcFN0eWxlKGxlYWRlcnNoaXBTdHlsZSkge1xuICAgICAgICByZXR1cm4gTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2Uuc2hhcmUoe2lkOiBsZWFkZXJzaGlwU3R5bGUuaWR9LCBsZWFkZXJzaGlwU3R5bGUsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ3NoYXJlTGVhZGVyc2hpcFN0eWxlIGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlTGVhZGVyc2hpcFN0eWxlKGxlYWRlcnNoaXBTdHlsZSkge1xuICAgICAgICByZXR1cm4gTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2UudXBkYXRlKHtpZDogbGVhZGVyc2hpcFN0eWxlLmlkfSwgbGVhZGVyc2hpcFN0eWxlLCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCd1cGRhdGVMZWFkZXJzaGlwU3R5bGUgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnb1RvUHJldmlvdXNRdWVzdGlvbihsZWFkZXJzaGlwU3R5bGUpIHtcbiAgICAgICAgcmV0dXJuIExlYWRlcnNoaXBTdHlsZVJlc291cmNlLmdvVG9QcmV2aW91c1F1ZXN0aW9uKHtpZDogbGVhZGVyc2hpcFN0eWxlLmlkfSwgbnVsbCwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignZ29Ub1ByZXZpb3VzUXVlc3Rpb24gZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnbGVhZGVyc2hpcC1zdHlsZScpXG4gICAgLmZhY3RvcnkoJ0xlYWRlcnNoaXBTdHlsZVJlc291cmNlJywgTGVhZGVyc2hpcFN0eWxlUmVzb3VyY2UpO1xuXG5mdW5jdGlvbiBMZWFkZXJzaGlwU3R5bGVSZXNvdXJjZSgkcmVzb3VyY2UpIHtcbiAgICB2YXIgYWN0aW9ucyA9IHtcbiAgICAgICAgJ2NyZWF0ZSc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlL2NyZWF0ZS8nXG4gICAgICAgIH0sXG4gICAgICAgICdnZXQnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlLzppZC8nXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRNeSc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL2xlYWRlcnNoaXAtc3R5bGUvOmlkLydcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldFVuZmluaXNoZWQnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9sZWFkZXJzaGlwLXN0eWxlL3VuZmluaXNoZWQvJ1xuICAgICAgICB9LFxuICAgICAgICAncmV0YWtlJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvbGVhZGVyc2hpcC1zdHlsZS86aWQvcmV0YWtlLydcbiAgICAgICAgfSxcbiAgICAgICAgJ3NoYXJlJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvbGVhZGVyc2hpcC1zdHlsZS86aWQvc2hhcmUvJ1xuICAgICAgICB9LFxuICAgICAgICAndXBkYXRlJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvbGVhZGVyc2hpcC1zdHlsZS86aWQvdXBkYXRlLydcbiAgICAgICAgfSxcbiAgICAgICAgJ2dvVG9QcmV2aW91c1F1ZXN0aW9uJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvbGVhZGVyc2hpcC1zdHlsZS86aWQvcHJldmlvdXMtcXVlc3Rpb24vJ1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gJHJlc291cmNlKCcvYXBpL3YxL2xlYWRlcnNoaXAtc3R5bGUvOmlkLycsIG51bGwsIGFjdGlvbnMpO1xufVxuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnbGVhZGVyc2hpcC1zdHlsZScpXG4gICAgLmNvbnRyb2xsZXIoJ0xlYWRlcnNoaXBTdHlsZUNvbnRyb2xsZXInLCBMZWFkZXJzaGlwU3R5bGVDb250cm9sbGVyKTtcblxuZnVuY3Rpb24gTGVhZGVyc2hpcFN0eWxlQ29udHJvbGxlcihMZWFkZXJzaGlwU3R5bGVTZXJ2aWNlLCBMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0U2VydmljZSwgYW5hbHl0aWNzLCAkbG9jYXRpb24sICRtb2RhbCwgJHJvb3RTY29wZSwgJHJvdXRlUGFyYW1zLCAkc2NvcGUsICR0aW1lb3V0KSB7XG4gICAgLyogU2luY2UgdGhpcyBwYWdlIGNhbiBiZSB0aGUgcm9vdCBmb3Igc29tZSB1c2VycyBsZXQncyBtYWtlIHN1cmUgd2UgY2FwdHVyZSB0aGUgY29ycmVjdCBwYWdlICovXG4gICAgdmFyIGxvY2F0aW9uX3VybCA9ICRsb2NhdGlvbi51cmwoKS5pbmRleE9mKCcvaWQnKSA8IDAgPyAnL2lkJyA6ICRsb2NhdGlvbi51cmwoKTtcbiAgICBhbmFseXRpY3MudHJhY2tQYWdlKCRzY29wZSwgJGxvY2F0aW9uLmFic1VybCgpLCBsb2NhdGlvbl91cmwpO1xuXG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5idXN5ID0gdHJ1ZTtcbiAgICB2bS5zaG93RW1wdHlTY3JlZW4gPSBmYWxzZTtcbiAgICB2bS5teUxlYWRlcnNoaXBTdHlsZSA9IG51bGw7XG4gICAgdm0udGFrZVF1aXogPSB0YWtlUXVpejtcbiAgICB2bS5yZXF1ZXN0TGVhZGVyc2hpcFN0eWxlID0gcmVxdWVzdExlYWRlcnNoaXBTdHlsZTtcbiAgICAkcm9vdFNjb3BlLnN1Y2Nlc3NSZXF1ZXN0TWVzc2FnZSA9IGZhbHNlO1xuICAgICRyb290U2NvcGUuaGlkZU1lc3NhZ2UgPSBmYWxzZTtcbiAgICAkcm9vdFNjb3BlLmhpZGVSZXF1ZXN0TWVzc2FnZSA9IGZhbHNlO1xuICAgIGFjdGl2YXRlKCk7XG5cbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgaWYgKCRyb3V0ZVBhcmFtcy5yZXF1ZXN0SWQpIHtcbiAgICAgICAgICAgIHZtLmJ1c3kgPSB0cnVlO1xuICAgICAgICAgICAgcmVzcG9uZFRvUmVxdWVzdCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ2V0TXlMZWFkZXJzaGlwU3R5bGUoKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHJlc3BvbmRUb1JlcXVlc3QoKSB7XG4gICAgICAgIExlYWRlcnNoaXBTdHlsZVJlcXVlc3RTZXJ2aWNlLmdldFJlcXVlc3QoJHJvdXRlUGFyYW1zLnJlcXVlc3RJZClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcXVlc3Qpe1xuICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0LnN1Ym1pc3Npb25faWQpIHtcbiAgICAgICAgICAgICAgICAgICAgTGVhZGVyc2hpcFN0eWxlU2VydmljZS5nZXRMZWFkZXJzaGlwU3R5bGUocmVxdWVzdC5zdWJtaXNzaW9uX2lkKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRha2VRdWl6KHJlc3BvbnNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgTGVhZGVyc2hpcFN0eWxlU2VydmljZS5jcmVhdGVMZWFkZXJzaGlwU3R5bGUocmVxdWVzdClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWtlUXVpeihyZXNwb25zZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2bS5idXN5ID0gZmFsc2U7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZtLmJ1c3kgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0TXlMZWFkZXJzaGlwU3R5bGUoKSB7XG4gICAgICAgIHZtLmJ1c3kgPSB0cnVlO1xuICAgICAgICBMZWFkZXJzaGlwU3R5bGVTZXJ2aWNlLmdldE15TGVhZGVyc2hpcFN0eWxlKClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGxlYWRlcnNoaXBTdHlsZSl7XG4gICAgICAgICAgICAgICAgdm0ubXlMZWFkZXJzaGlwU3R5bGUgPSBsZWFkZXJzaGlwU3R5bGU7XG4gICAgICAgICAgICAgICAgdm0uYnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2bS5idXN5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0YWtlUXVpeihsZWFkZXJzaGlwU3R5bGUpIHtcbiAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG4gICAgICAgICAgICBhbmltYXRpb246IHRydWUsXG4gICAgICAgICAgICB3aW5kb3dDbGFzczogJ3h4LWRpYWxvZyBmYWRlIHpvb20nLFxuICAgICAgICAgICAgYmFja2Ryb3A6ICdzdGF0aWMnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvc3RhdGljL2FuZ3VsYXIvbGVhZGVyc2hpcC1zdHlsZS9wYXJ0aWFscy9fbW9kYWxzL3F1aXouaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnUXVpekNvbnRyb2xsZXIgYXMgcXVpeicsXG4gICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgIGxlYWRlcnNoaXBTdHlsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlYWRlcnNoaXBTdHlsZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKFxuICAgICAgICAgICAgZnVuY3Rpb24gKGxlYWRlcnNoaXBTdHlsZSkge1xuICAgICAgICAgICAgICAgIGlmIChsZWFkZXJzaGlwU3R5bGUuZW1wbG95ZWUuaWQgPT0gbGVhZGVyc2hpcFN0eWxlLmFzc2Vzc29yLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLm15TGVhZGVyc2hpcFN0eWxlID0gbGVhZGVyc2hpcFN0eWxlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0TXlSZWNlbnRseVNlbnRSZXF1ZXN0cygpIHtcbiAgICAgICAgTGVhZGVyc2hpcFN0eWxlUmVxdWVzdFNlcnZpY2UuZ2V0TXlSZWNlbnRseVNlbnRSZXF1ZXN0cygpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHZtLm15UmVjZW50bHlTZW50UmVxdWVzdHMgPSBkYXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiB2bS5teVJlY2VudGx5U2VudFJlcXVlc3RzO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiByZXF1ZXN0TGVhZGVyc2hpcFN0eWxlKHBhbmVsKSB7XG4gICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IHRydWUsXG4gICAgICAgICAgICAgICAgd2luZG93Q2xhc3M6ICd4eC1kaWFsb2cgZmFkZSB6b29tJyxcbiAgICAgICAgICAgICAgICBiYWNrZHJvcDogJ3N0YXRpYycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvc3RhdGljL2FuZ3VsYXIvbGVhZGVyc2hpcC1zdHlsZS9wYXJ0aWFscy9fbW9kYWxzL3JlcXVlc3QtbGVhZGVyc2hpcC1zdHlsZS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTGVhZGVyc2hpcFN0eWxlUmVxdWVzdENvbnRyb2xsZXIgYXMgcmVxdWVzdCcsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICBwYW5lbDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhbmVsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG1vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4oXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKHNlbnRMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0cykge1xuICAgICAgICAgICAgICAgICAgICBnZXRNeVJlY2VudGx5U2VudFJlcXVlc3RzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxufVxuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnbGVhZGVyc2hpcC1zdHlsZScpXG4gICAgLmZhY3RvcnkoJ0xlYWRlcnNoaXBTdHlsZVJlcXVlc3RTZXJ2aWNlJywgTGVhZGVyc2hpcFN0eWxlUmVxdWVzdFNlcnZpY2UpO1xuXG5mdW5jdGlvbiBMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0U2VydmljZSgkbG9nLCBMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0UmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBzZW5kTGVhZGVyc2hpcFN0eWxlUmVxdWVzdHM6IHNlbmRMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0cyxcbiAgICAgICAgZ2V0TXlSZWNlbnRseVNlbnRSZXF1ZXN0czogZ2V0TXlSZWNlbnRseVNlbnRSZXF1ZXN0cyxcbiAgICAgICAgZ2V0UmVxdWVzdDogZ2V0UmVxdWVzdFxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBzZW5kTGVhZGVyc2hpcFN0eWxlUmVxdWVzdHMocmV2aWV3ZXJzLCBtZXNzYWdlKSB7XG4gICAgICAgIHZhciByZXF1ZXN0cyA9IFtdO1xuXG4gICAgICAgIGZvcih2YXIgaT0wOyBpIDwgcmV2aWV3ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcmV2aWV3ZXJfaWQgPSByZXZpZXdlcnNbaV0ucGsgPyByZXZpZXdlcnNbaV0ucGsgOiByZXZpZXdlcnNbaV0uaWRcbiAgICAgICAgICAgIHJlcXVlc3RzLnB1c2goe3Jldmlld2VyOiByZXZpZXdlcl9pZCwgbWVzc2FnZTogbWVzc2FnZX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIExlYWRlcnNoaXBTdHlsZVJlcXVlc3RSZXNvdXJjZS5zZW5kTGVhZGVyc2hpcFN0eWxlUmVxdWVzdHMocmVxdWVzdHMsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3Moc2VudExlYWRlcnNoaXBTdHlsZVJlcXVlc3RzKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VudExlYWRlcnNoaXBTdHlsZVJlcXVlc3RzO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignc2VuZExlYWRlcnNoaXBTdHlsZVJlcXVlc3RzIGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0TXlSZWNlbnRseVNlbnRSZXF1ZXN0cygpIHtcbiAgICAgICAgcmV0dXJuIExlYWRlcnNoaXBTdHlsZVJlcXVlc3RSZXNvdXJjZS5nZXRNeVJlY2VudGx5U2VudFJlcXVlc3RzKG51bGwsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ2dldE15UmVjZW50bHlTZW50UmVxdWVzdHMgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRSZXF1ZXN0KGlkKSB7XG4gICAgICAgIHJldHVybiBMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0UmVzb3VyY2UuZ2V0UmVxdWVzdCh7aWQ6IGlkfSwgbnVsbCwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignZ2V0UmVxdWVzdCBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdsZWFkZXJzaGlwLXN0eWxlJylcbiAgICAuZmFjdG9yeSgnTGVhZGVyc2hpcFN0eWxlUmVxdWVzdFJlc291cmNlJywgTGVhZGVyc2hpcFN0eWxlUmVxdWVzdFJlc291cmNlKTtcblxuZnVuY3Rpb24gTGVhZGVyc2hpcFN0eWxlUmVxdWVzdFJlc291cmNlKCRyZXNvdXJjZSkge1xuICAgIHZhciBhY3Rpb25zID0ge1xuICAgICAgICAnZ2V0TXlSZWNlbnRseVNlbnRSZXF1ZXN0cyc6IHtcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvbGVhZGVyc2hpcC1zdHlsZS9yZXF1ZXN0cy9yZWNlbnRseS1zZW50LycsXG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgaXNBcnJheTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICAnZ2V0TGVhZGVyc2hpcFN0eWxlUmVxdWVzdHMnOiB7XG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL2xlYWRlcnNoaXAtc3R5bGUvcmVxdWVzdHMvdG9kby8nLFxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldFJlcXVlc3QnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICB9LFxuICAgICAgICAnc2VuZExlYWRlcnNoaXBTdHlsZVJlcXVlc3RzJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgfTtcbiAgICByZXR1cm4gJHJlc291cmNlKCcvYXBpL3YxL2xlYWRlcnNoaXAtc3R5bGUvcmVxdWVzdHMvOmlkLycsIG51bGwsIGFjdGlvbnMpO1xufVxuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdsZWFkZXJzaGlwLXN0eWxlJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0xlYWRlcnNoaXBTdHlsZVJlcXVlc3RDb250cm9sbGVyJywgTGVhZGVyc2hpcFN0eWxlUmVxdWVzdENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gTGVhZGVyc2hpcFN0eWxlUmVxdWVzdENvbnRyb2xsZXIocGFuZWwsIExlYWRlcnNoaXBTdHlsZVJlcXVlc3RTZXJ2aWNlLCBVc2VycywgJHRpbWVvdXQsICRtb2RhbEluc3RhbmNlLCAkcm9vdFNjb3BlKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZtLnBvdGVudGlhbFJldmlld2VycyA9IFtdO1xuICAgICAgICB2bS5zdWJqZWN0ID0gJHJvb3RTY29wZS5jdXJyZW50VXNlci5lbXBsb3llZTtcbiAgICAgICAgdm0ubWVzc2FnZSA9ICcnO1xuICAgICAgICB2bS5zZW5kTGVhZGVyc2hpcFN0eWxlUmVxdWVzdHMgPSBzZW5kTGVhZGVyc2hpcFN0eWxlUmVxdWVzdHM7XG4gICAgICAgIHZtLnN0ZXBOZXh0ID0gc3RlcE5leHQ7XG4gICAgICAgIHZtLnN0ZXBCYWNrID0gc3RlcEJhY2s7XG4gICAgICAgIHZtLmNhbmNlbCA9IGNhbmNlbDtcbiAgICAgICAgdm0ucGFuZWxfaW5kZXggPSBwYW5lbDtcbiAgICAgICAgdm0uZW5hYmxlU2VuZCA9IHRydWU7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAgIGdldFBvdGVudGlhbFJldmlld2VycygpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0UG90ZW50aWFsUmV2aWV3ZXJzKCkge1xuICAgICAgICAgICAgcmV0dXJuIFVzZXJzLnF1ZXJ5KCkuJHByb21pc2VcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLnBvdGVudGlhbFJldmlld2VycyA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2bS5wb3RlbnRpYWxSZXZpZXdlcnM7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZW5kTGVhZGVyc2hpcFN0eWxlUmVxdWVzdHMoKSB7XG4gICAgICAgICAgICB2bS5lbmFibGVTZW5kID0gZmFsc2U7XG4gICAgICAgICAgICBMZWFkZXJzaGlwU3R5bGVSZXF1ZXN0U2VydmljZS5zZW5kTGVhZGVyc2hpcFN0eWxlUmVxdWVzdHModm0uc2VsZWN0ZWRSZXZpZXdlcnMsIHZtLm1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oc2VudFBlcmNlcHRpb1JlcXVlc3RzKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLyogQmlnIHN1Y2Nlc3MgbWVzc2FnZSAqL1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnN1Y2Nlc3NSZXF1ZXN0TWVzc2FnZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuc3VjY2Vzc1JlcXVlc3RNZXNzYWdlUmVjaXBpZW50ID0gdm0uc2VsZWN0ZWRSZXZpZXdlcnM7XG5cbiAgICAgICAgICAgICAgICAgICAgLyogSGlkZSBzdWNjZXNzIG1lc3NhZ2UgYWZ0ZXIgYSBmZXcgc2Vjb25kcyAqL1xuICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuaGlkZVJlcXVlc3RNZXNzYWdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSwgMTAwMDApO1xuXG4gICAgICAgICAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKHNlbnRQZXJjZXB0aW9SZXF1ZXN0cylcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXBOZXh0KCkge1xuICAgICAgICAgICAgdm0ucGFuZWxfaW5kZXgrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXBCYWNrKCkge1xuICAgICAgICAgICAgdm0ucGFuZWxfaW5kZXgtLTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoKTtcbiAgICAgICAgfVxuICAgIH1cbn0oKSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
