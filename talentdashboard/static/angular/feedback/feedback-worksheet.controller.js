    angular
        .module('feedback')
        .controller('FeedbackWorksheetController', FeedbackWorksheetController);

    function FeedbackWorksheetController($routeParams, $location, $window, $scope, $rootScope, analytics, Notification, FeedbackRequestService, FeedbackDigestService) {
        analytics.trackPage($scope, $location.absUrl(), $location.url());
        var vm = this;
        vm.employeeId = $routeParams.id;
        vm.progressReport = null;
        vm.digest = null;
        vm.getFeedbackProgressReport = getFeedbackProgressReport;
        vm.getCurrentDigest = getCurrentDigest;
        vm.save = save;
        vm.deliverDigest = deliverDigest;
        vm.printDigest = printDigest;
        vm.showProgressReport = true;
        vm.coach = $rootScope.currentUser.employee;
        vm.questions = {
            excelsAtQuestion: $rootScope.customer.feedback_excels_at_question,
            couldImproveOnQuestion: $rootScope.customer.feedback_could_improve_on_question
        };
        activate();

        function activate() {
            getFeedbackProgressReport();
            getCurrentDigest();
        }

        function getCurrentDigest() {
            return FeedbackDigestService.getCurrentDigestForEmployee(vm.employeeId)
                .then(function (data) {
                    vm.digest = data;
                    vm.coach= vm.digest.delivered_by ? vm.digest.delivered_by : $rootScope.currentUser.employee;
                    return vm.digest;
                });
        }

        function getFeedbackProgressReport() {
            return FeedbackRequestService.getFeedbackProgressReportForEmployee(vm.employeeId)
                .then(function (data) {
                    vm.progressReport = data;
                    if (vm.progressReport.all_submissions_not_delivered.length>0 ||
                        vm.progressReport.unanswered_requests.length>0) {
                        vm.showProgressReport = true;
                    }
                    return vm.progressReport;
                })
                .catch(function() {
                    Notification.error("You don't have access to this digest.");
                    $location.path('/feedback/');
                });;
        }

        function save() {
            return FeedbackDigestService.save(vm.digest)
                .then(function (data) {
                    Notification.success("Your changes were saved.")
                });
        }

        function deliverDigest() {
            if($window.confirm("Are you sure you want to deliver this to " + vm.digest.subject.full_name + " now?")) {
                return FeedbackDigestService.deliverDigest(vm.digest)
                    .then(function (data) {
                        Notification.success("The digest will be delivered to " + vm.digest.subject.full_name + ".");
                        $location.path('/my-coachees/');
                    });
            }
        }

        function printDigest() {
            $window.print();
        }
    }
