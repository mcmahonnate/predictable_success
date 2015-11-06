    angular
        .module('feedback')
        .controller('FeedbackWorksheetController', FeedbackWorksheetController);

    function FeedbackWorksheetController($routeParams, $location, $window, $scope, analytics, Notification, FeedbackRequestService, FeedbackDigestService) {
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
        activate();

        function activate() {
            getFeedbackProgressReport();
            getCurrentDigest();
        }

        function getCurrentDigest() {
            return FeedbackDigestService.getCurrentDigestForEmployee(vm.employeeId)
                .then(function (data) {
                    vm.digest = data;
                    return vm.digest;
                });
        }

        function getFeedbackProgressReport() {
            return FeedbackRequestService.getFeedbackProgressReportForEmployee(vm.employeeId)
                .then(function (data) {
                    vm.progressReport = data;
                    if (vm.progressReport.solicited_submissions.length>0 ||
                        vm.progressReport.unsolicited_submissions.length>0 ||
                        vm.progressReport.unanswered_requests.length>0) {
                        vm.showProgressReport = true;
                    }
                    return vm.progressReport;
                })
                .catch(function() {
                    Notification.error("You don't have access to this digets.");
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
            return FeedbackDigestService.deliverDigest(vm.digest)
                .then(function (data) {
                    Notification.success("The digest will be delivered to " + vm.digest.subject.full_name + ".");
                    $location.path('/my-coachees/');
                });
        }

        function printDigest() {
            $window.print();
        }
    }
