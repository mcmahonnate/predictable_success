angular
    .module('feedback')
    .controller('FeedbackReportController', FeedbackReportController);

function FeedbackReportController(FeedbackReportService, $scope, $location, analytics) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());

    var vm = this;
    vm.startDate = null;
    vm.endDate = null;
    vm.report = [];
    vm.getFeedbackReport = getFeedbackReport;

    function getFeedbackReport() {
        return FeedbackReportService.getFeedbackReport(vm.startDate, vm.endDate)
            .then(function (data) {
                vm.report = data.employee_report;
                console.log(vm.report);
                vm.startDate = data.start_date
                vm.endDate = data.end_date
                return vm.report;
            })
            .catch(function() {
                Notification.error("We had an error processing your report.");
            });
    }

}