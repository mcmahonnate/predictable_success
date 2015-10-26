    angular
        .module('feedback')
        .controller('FeedbackWorksheetController', FeedbackWorksheetController);

    function FeedbackWorksheetController($routeParams, Notification, FeedbackRequestService, FeedbackDigestService) {
        var vm = this;
        vm.employeeId = $routeParams.id;
        vm.progressReport = null;
        vm.digest = null;
        vm.getFeedbackProgressReport = getFeedbackProgressReport;
        vm.getCurrentDigest = getCurrentDigest;
        vm.save = save;
        vm.deliverDigest = deliverDigest;
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
                    return vm.progressReport;
                });
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
                });
        }
    }
