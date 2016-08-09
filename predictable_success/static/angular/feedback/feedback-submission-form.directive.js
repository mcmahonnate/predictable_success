    angular
        .module('feedback')
        .directive('smFeedbackSubmissionForm', feedbackSubmissionForm);

    function feedbackSubmissionForm() {
        return {
            templateUrl: '/static/angular/feedback/partials/_feedback_submission_form.html',
            restrict: 'E',
            scope: {
                feedback: '=',
                questions: '=',
                subject: '=',
                message: '=',
                submit: '&',
                toggle: '&',
                cancel: '&'
            },
            controller: function($scope) {
                $scope.submitForm = function(form) {
                    $scope.submit({form: form});
                };
                $scope.cancelForm = function() {
                    
                    var cancel = confirm("Are you sure you want to lose all the great feedback you've already written?");
                    if (cancel == true) {
                        $scope.cancel();
                    }    
                }
                $scope.toggleValue = function(anonymous, subject) {
                    $scope.toggle(anonymous, subject);
                }
            }
        };
    }
