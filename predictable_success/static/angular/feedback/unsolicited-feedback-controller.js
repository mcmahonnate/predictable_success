    angular
        .module('feedback')
        .controller('UnsolicitedFeedbackController', UnsolicitedFeedbackController);

    function UnsolicitedFeedbackController($location, $modal, $scope, $rootScope, $routeParams, $timeout, analytics, Employee, FeedbackSubmissionService, Notification) {
        analytics.trackPage($scope, $location.absUrl(), $location.url());
        BaseSubmitFeedbackController.call(this, $location, $modal, $rootScope);
        
        var vm = this;
        vm.employeeId = $routeParams.employeeId;
        vm.mySubmissions = [];
        vm.employees = [];
        vm.subject = null;
        vm.goTo = goTo;
        activate();
 
        function activate() {
            if (vm.employeeId) {
                getEmployee();
            }
            else
            {
                getEmployees();
            }
            getMySubmissions();
        }

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

        function getEmployee() {
            Employee.get(
                {id: vm.employeeId},
                function (data) {
                    vm.subject = data;
                }
            );
        }

        function getEmployees() {
            return FeedbackSubmissionService.getEmployees()
                .then(function (employees) {
                    vm.employees = employees;
                    return vm.employees;
                });
        }

        function getMySubmissions() {
            FeedbackSubmissionService.getFeedbackIveSubmitted()
                .then(function (data) {
                    vm.mySubmissions = data;
                    vm.mySubmissionsLoaded = true;
                    return vm.mySubmissions;
                });
        }


        this._submitFeedback = function() {
            return FeedbackSubmissionService.giveUnsolicitedFeedback(vm.subject, vm.feedback)
                .then(function(response) {

                    /* Big succes message */
                    $rootScope.successMessage = true;
                    $rootScope.successMessageRecipient = vm.subject;
                    
                    /* Hide success message after a few seconds */
                    $timeout(function() {
                        $rootScope.hideMessage = true;
                        $rootScope.successMessage = false;
                    }, 10000); 
                })
                .catch(function(response) {
                    Notification.error('An error occurred when saving your feedback. Please try again.');
                });
        }
    }

    UnsolicitedFeedbackController.prototype = Object.create(BaseSubmitFeedbackController.prototype);
