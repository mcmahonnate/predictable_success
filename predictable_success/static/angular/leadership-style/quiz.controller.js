angular
    .module('leadership-style')
    .controller('QuizController', QuizController);

function QuizController(analytics, LeadershipStyleService, Notification, leadershipStyle, $location, $modal, $modalInstance, $rootScope, $scope, $window) {
    var vm = this;
    vm.trackEvent = analytics.trackEvent;
    vm.leadershipStyle = leadershipStyle;
    vm.panelIndex = 0;
    vm.busy = false;
    vm.cancel = cancel;
    vm.close = close;
    vm.answerQuestion = answerQuestion;
    vm.continueQuiz = continueQuiz;
    vm.previousQuestion = previousQuestion;
    vm.saveEmployee = saveEmployee;
    vm.startOver = startOver;
    vm.showWhoCanSeeThis = showWhoCanSeeThis;
    vm.finish = finish;
    vm.employee = $rootScope.currentUser.employee;
    vm.selectedAnswer = null;
    vm.scores = [];

    $scope.$watchGroup(['quiz.leadershipStyle.next_question', 'quiz.panelIndex'], function(newValues, oldValues) {
        if (!vm.leadershipStyle.next_question) {
            if (vm.panelIndex==2) {
                analytics.setPage('/quiz/whats-your-name/');
            } else {
                analytics.setPage('/quiz/finished');
            }
        } else {
            if (vm.panelIndex == 0 && vm.leadershipStyle.answers.length == 0) {
                analytics.setPage('/quiz/start/');
            } else if (vm.panelIndex == 0 && vm.leadershipStyle.answers.length > 0) {
                analytics.setPage('/quiz/continue/');
            } else {
                analytics.setPage('/quiz/question/' + (vm.leadershipStyle.next_question.order + 1));
            }
        }
        analytics.trackPage();
    });

    activate()

    function activate() {
        if (leadershipStyle.next_question) {
            vm.selectedAnswer = leadershipStyle.next_question.answer;
        }
    }

    function continueQuiz() {
        analytics.trackEvent('Continue button', 'click', null);
        if (vm.leadershipStyle.next_question) {
            vm.panelIndex = 2;
        } else {
            if (vm.leadershipStyle.employee.full_name.indexOf('@') > -1) {
                vm.panelIndex = 3;
            } else {
                vm.panelIndex = 4;
            }
        }
    }

    function saveEmployee(employee) {
        analytics.trackEvent('Save Name button', 'click', null);
        vm.busy = true;
        var data = {id: employee.id, full_name: employee.new_full_name};
        LeadershipStyleService.updateEmployee(data)
            .then(function(result){
                vm.leadershipStyle.employee = response;
                vm.panelIndex = 4;
                vm.busy = false;
            }, function () {
                vm.panelIndex = 4;
                vm.busy = false;
            }
        );
    }

    function cancel() {
        analytics.trackEvent('Cancel button', 'click', null);
        $modalInstance.close(vm.leadershipStyle)
    }

    function close() {
        analytics.trackEvent('Save and close button', 'click', null);
        $modalInstance.close(vm.leadershipStyle)
        if (!vm.leadershipStyle.completed) {
            Notification.success('Your progress has been saved.')
        }
    }

    function answerQuestion(answer) {
        analytics.trackEvent('Answer', 'click', null);
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
                if (vm.leadershipStyle.next_question) {
                    vm.selectedAnswer = vm.leadershipStyle.next_question.answer;
                } else {
                    if (vm.leadershipStyle.employee.full_name.indexOf('@') > -1) {
                        vm.panelIndex = 3;
                    } else {
                        vm.panelIndex = 4;
                    }
                }
                if (vm.leadershipStyle.completed) {
                    vm.selectedAnswer = null;
                    close();
                }
                vm.busy = false;
            }
        );
    }

    function previousQuestion(){
        vm.busy = true;
        vm.panelIndex = 2;
        analytics.trackEvent('Go back button', 'click', null);
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
                vm.panelIndex=0;
                vm.selectedAnswer=null;
                vm.leadershipStyle = result;
                vm.busy = false;
            }
        );
    }

    function finish() {
        vm.busy = true;
        analytics.trackEvent('See Results button', 'click', null);
        LeadershipStyleService.completeLeadershipStyle(vm.leadershipStyle)
            .then(function(result){
                vm.leadershipStyle = result;
                close();
                vm.busy = false;
            }, function(){
                close();
                $window.location.reload();
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

