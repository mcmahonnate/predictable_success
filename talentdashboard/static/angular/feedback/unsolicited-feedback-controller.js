    angular
        .module('feedback')
        .controller('UnsolicitedFeedbackController', UnsolicitedFeedbackController);

    function UnsolicitedFeedbackController($location, $modal, $scope, $rootScope, analytics, Notification, FeedbackSubmissionService) {
        analytics.trackPage($scope, $location.absUrl(), $location.url());
        BaseSubmitFeedbackController.call(this, $location, $modal, $rootScope);
        
        var vm = this;
        var successMessageGreetings = [{greeting: "Nice job!"},{greeting: "Excellent!"},{greeting: "Alright, alright!"}];
        vm.employees = [];
        vm.subject = null;
        vm.goTo = goTo;
        activate();
 
        function randomGreeting(){
            $rootScope.greeting = successMessageGreetings[Math.floor(Math.random()*successMessageGreetings.length)];
        };

   
        function goTo(path) {
            var cancel = confirm("Are you sure you want to lose all the great feedback you've already written?");
            if (cancel == true) {
                $location.path(path);
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

                    //Notification.success('Your feedback was saved.');
                    $rootScope.successMessage = true;
                    $rootScope.successMessageRecipient = vm.subject;
                })
                .catch(function(response) {
                    Notification.error('An error occurred when saving your feedback. Please try again.');
                });
        }
    }

    UnsolicitedFeedbackController.prototype = Object.create(BaseSubmitFeedbackController.prototype);
