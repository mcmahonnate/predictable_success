    angular
        .module('feedback')
        .controller('FeedbackWorksheetController', FeedbackWorksheetController);

    function FeedbackWorksheetController($routeParams, FeedbackRequestService) {
        var vm = this;
        vm.progressReport = null;
        vm.digest = null;
        vm.getFeedbackProgressReport = getFeedbackProgressReport;

        activate();

        function activate() {
            getFeedbackProgressReport()
        }

        function getFeedbackProgressReport() {
            return FeedbackRequestService.getFeedbackProgressReportForEmployee($routeParams.id)
                .then(function (data) {
                    vm.progressReport = data;
                    return vm.progressReport;
                });
        }
    }
