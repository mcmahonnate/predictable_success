    angular
        .module('feedback')
        .controller('BaseSubmitFeedbackController', BaseSubmitFeedbackController);

    function BaseSubmitFeedbackController($location, $modal) {
        var vm = this;
        vm.feedback = {
            excelsAt: null,
            couldImproveOn: null,
            anonymous: false
        };
        vm.cancel = cancel;
        vm.submitFeedback = submitFeedback;
        vm.toggleAnonymous = toggleAnonymous;

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
                windowClass: 'xx-dialog',
                backdrop: 'static',
                templateUrl: '/static/angular/partials/feedback/_modals/anonymous-warning.html',
                controller: ['$scope', '$modalInstance', 'subject', function($scope, $modalInstance, subject) {
                    $scope.subject = subject;
                    $scope.cancel = function() {
                        $modalInstance.dismiss();
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
