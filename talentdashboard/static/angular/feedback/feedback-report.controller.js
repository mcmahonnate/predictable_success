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
    vm.showResults = false;
    vm.predicate = 'employee.full_name';
    vm.reverse = false;
    vm.buildCSV = buildCSV;
    vm.csv = [];

    vm.order = function (predicate) {
        vm.reverse = (vm.predicate === predicate) ? !vm.reverse : false;
        vm.predicate = predicate;
    };

    function getFeedbackReport() {
        return FeedbackReportService.getFeedbackReport(vm.startDate, vm.endDate)
            .then(function (data) {
                vm.report = data.employee_report;
                vm.startDate = data.start_date;
                vm.endDate = data.end_date;
                vm.showResults = true;
                vm.csv = [];
                buildCSV();
                return vm.report;
            })
            .catch(function () {
                Notification.error("We had an error processing your report.");
            });
    }

    function buildCSV() {
        vm.csv = [];
        angular.forEach(vm.report, function (report) {

            var row = {};
            row.id = report.employee.id;
            row.name = report.employee.full_name;
            row.total_i_requested = report.total_i_requested;
            row.total_responded_to_me = report.total_responded_to_me;
            row.total_requested_of_me = report.total_requested_of_me;
            row.total_i_responded_to = report.total_i_responded_to;
            row.total_unrequested_i_gave = report.total_unrequested_i_gave;
            row.total_unrequested_given_to_me = report.total_unrequested_given_to_me;
            row.total_digests_i_delivered = report.total_digests_i_delivered;
            row.total_digests_i_received = report.total_digests_i_received;
            vm.csv.push(row);
        });
    }
}