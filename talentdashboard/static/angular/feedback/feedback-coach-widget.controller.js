    angular
        .module('feedback')
        .controller('FeedbackCoachWidgetController', FeedbackCoachWidgetController);

    FeedbackCoachWidgetController.$inject = ['FeedbackRequestService', 'FeedbackDigestService'];

    function FeedbackCoachWidgetController(FeedbackRequestService, FeedbackDigestService) {
        var vm = this;
        vm.show = false;
        vm.progressReports = [];
        vm.digests = [];
        vm.getFeedbackProgressReport = getFeedbackProgressReport;

        activate();

        function activate() {
            getFeedbackProgressReport();
            getDigestsIveDelivered()
        }

        function getFeedbackProgressReport() {
            return FeedbackRequestService.getFeedbackProgressReportForEmployees()
                .then(function (data) {
                    vm.progressReports = data;
                    if (vm.progressReports.length > 0) {
                        vm.show = true;
                    }
                    return vm.progressReport;
                });
        }

        function getDigestsIveDelivered() {
            return FeedbackDigestService.getDigestsIveDelivered()
                .then(function (data) {
                    vm.digests = data;
                    if (vm.digests.length > 0) {
                        vm.show = true;
                    }
                    return vm.digests;
                });
        }
    }