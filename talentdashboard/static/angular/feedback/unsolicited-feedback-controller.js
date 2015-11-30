    angular
        .module('feedback')
        .controller('UnsolicitedFeedbackController', UnsolicitedFeedbackController);

    function UnsolicitedFeedbackController($location, $modal, $scope, $rootScope, $timeout, analytics, Notification, FeedbackSubmissionService) {
        analytics.trackPage($scope, $location.absUrl(), $location.url());
        BaseSubmitFeedbackController.call(this, $location, $modal, $rootScope);
        
        var vm = this;
        vm.employees = [];
        vm.subject = null;
        vm.goTo = goTo;
        activate();
 

        function goTo(path) {
            var cancel = confirm("Are you sure you want to lose all the great feedback you've already written?");
            if (cancel == true) {
                $location.path(path);

                /* Cancel out and remove modal */
                $('.modal').modal('hide');
                $('.modal-backdrop').remove();
                $('body').removeClass('modal-open');
            } 
        };

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

                    $rootScope.successMessage = true;
                    $rootScope.successMessageRecipient = vm.subject;
                    
                    /* Hide success message after a few seconds */
                    $timeout(function() {
                        $rootScope.successMessage = false;
                    }, 15000); 
                })
                .catch(function(response) {
                    Notification.error('An error occurred when saving your feedback. Please try again.');
                });
        }
    }

    UnsolicitedFeedbackController.prototype = Object.create(BaseSubmitFeedbackController.prototype);
