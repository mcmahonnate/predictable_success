    angular
        .module('feedback')
        .controller('UnsolicitedFeedbackController', UnsolicitedFeedbackController);

    function UnsolicitedFeedbackController($location, $modal, $scope, $rootScope, analytics, Notification, FeedbackSubmissionService) {
        analytics.trackPage($scope, $location.absUrl(), $location.url());
        BaseSubmitFeedbackController.call(this, $location, $modal, $rootScope);
        var vm = this;
        vm.employees = [];
        vm.subject = null;

        $('.modal').modal('show');
        vm.go = function (path) {
            $location.path(path);
        };

        activate();

        function activate() {
            getEmployees();
        }

        function getEmployees() {
            return FeedbackSubmissionService.getEmployees()
                .then(function (employees) {
                    vm.employees = employees;
                    return vm.employees;
                });
        }

        this._submitFeedback = function() {
            return FeedbackSubmissionService.giveUnsolicitedFeedback(vm.subject, vm.feedback)
                .then(function(response) {
                    Notification.success('Your feedback was saved.');
                })
                .catch(function(response) {
                    Notification.error('An error occurred when saving your feedback. Please try again.');
                });
        }
    }

    UnsolicitedFeedbackController.prototype = Object.create(BaseSubmitFeedbackController.prototype);
