    angular
        .module('feedback')
        .controller('FeedbackCoachWidgetController', FeedbackCoachWidgetController);

    FeedbackCoachWidgetController.$inject = ['FeedbackRequestService'];

    function FeedbackCoachWidgetController(FeedbackRequestService) {
        var vm = this;
        vm.busy = true;
        vm.progressReports = [];
        vm.getFeedbackProgressReport = getFeedbackProgressReport;

        activate();

        function activate() {
            getFeedbackProgressReport()
        }

        function getFeedbackProgressReport() {
            return FeedbackRequestService.getFeedbackProgressReportForEmployees()
                .then(function (data) {
                    vm.progressReports = data;
                    if (vm.progressReports.length > 0) {
                        vm.busy = false;
                    }
                    return vm.progressReport;
                });
        }
    }