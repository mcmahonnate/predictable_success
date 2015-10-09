(function() {
    angular
        .module('feedback')
        .directive('feedbackSubmissionForm', feedbackSubmissionForm);

    function feedbackSubmissionForm() {
        return {
            templateUrl: '/static/angular/partials/feedback/_feedback_submission_form.html',
            restrict: 'E',
            scope: {
                feedback: '=',
                subject: '=',
                submit: '&',
                cancel: '&'
            },
            controller: function($scope) {
                $scope.submitForm = function(form) {
                    $scope.submit({form: form});
                };
                $scope.cancelForm = function() {
                    $scope.cancel();
                }
            }
        };
    }
})();