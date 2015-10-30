    angular
        .module('feedback')
        .directive('smFeedbackSubmissionForm', feedbackSubmissionForm);

    function feedbackSubmissionForm() {
        return {
            templateUrl: '/static/angular/partials/feedback/_feedback_submission_form.html',
            restrict: 'E',
            scope: {
                feedback: '=',
                subject: '=',
                submit: '&',
                toggle: '&',
                cancel: '&'
            },
            controller: function($scope) {
                $scope.submitForm = function(form) {
                    $scope.submit({form: form});
                };
                $scope.cancelForm = function() {
                    $scope.cancel();
                }
                $scope.toggleValue = function(anonymous, subject) {
                    $scope.toggle(anonymous, subject);
                }
            }
        };
    }
