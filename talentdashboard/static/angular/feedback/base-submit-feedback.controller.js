    angular
        .module('feedback')
        .controller('BaseSubmitFeedbackController', BaseSubmitFeedbackController);

    function BaseSubmitFeedbackController($location, $modal, $rootScope) {
        var vm = this;
        vm.feedback = {
            excelsAt: '',
            couldImproveOn: '',
            anonymous: false
        };
        vm.cancel = cancel;
        vm.submitFeedback = submitFeedback;
        vm.toggleAnonymous = toggleAnonymous;
        vm.questions = {
            excelsAtQuestion: $rootScope.customer.feedback_excels_at_question,
            couldImproveOnQuestion: $rootScope.customer.feedback_could_improve_on_question
        };
        function cancel() {
            returnToDashboard();
        }

        function submitFeedback(form) {
            if(form.$invalid) return;
            return this._submitFeedback()
                .then(returnToDashboard);
        }

        function returnToDashboard() {
            $location.path('/feedback');
        }

        function toggleAnonymous(anonymous, subject) {
            if (anonymous) {
                showAnonymousWarning(subject);
            }

        }
        function showAnonymousWarning(subject) {
            var modalInstance = $modal.open({
                animation: true,
                windowClass: 'xx-dialog fade zoom',
                backdrop: 'static',
                templateUrl: '/static/angular/partials/feedback/_modals/anonymous-warning.html',
                controller: ['$scope', '$modalInstance', 'subject', function($scope, $modalInstance, subject) {
                    $scope.subject = subject;
                    $scope.cancel = function() {
                        $modalInstance.close();
                    }
                }],
                resolve: {
                    subject: function () {
                        return subject
                    }
                }
            });
        }
    }
