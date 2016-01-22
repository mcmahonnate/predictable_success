angular
    .module('feedback')
    .controller('FeedbackReportController', FeedbackReportController);

function FeedbackReportController(FeedbackReportService, $scope, $location, $routeParams, analytics) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());

    var vm = this;
    vm.startDate = $routeParams.startDate ? $routeParams.startDate : null;
    vm.endDate = $routeParams.endDate ? $routeParams.endDate : null;
    vm.report = [];
    vm.getFeedbackReport = getFeedbackReport;
    vm.showResults = false;
    vm.predicate = 'employee.full_name';
    vm.reverse = false;
    vm.buildCSV = buildCSV;
    vm.csv = [];

    vm.order = function (predicate) {
        vm.reverse = (vm.predicate === predicate) ? !vm.reverse : true;
        vm.predicate = predicate;
    };

    activate()

    function activate() {
        if (vm.startDate && vm.endDate) {
            getFeedbackReport();
        }
    }

    function getFeedbackReport() {
        return FeedbackReportService.getFeedbackReport(vm.startDate, vm.endDate)
            .then(function (data) {
                vm.report = data.employee_report;
                vm.total_i_requested_total = data.total_i_requested_total;
                vm.total_responded_to_me_total = data.total_responded_to_me_total;
                vm.total_requested_of_me_total = data.total_requested_of_me_total;
                vm.total_i_responded_to_total = data.total_i_responded_to_total;
                vm.total_unrequested_i_gave_total = data.total_unrequested_i_gave_total;
                vm.total_unrequested_given_to_me_total = data.total_unrequested_given_to_me_total;
                vm.total_digests_i_delivered_total = data.total_digests_i_delivered_total;
                vm.total_digests_i_received_total = data.total_digests_i_received_total;
                vm.total_i_gave_that_was_helpful = data.total_i_gave_that_was_helpful;
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
            row.total_excels_at_i_gave_that_was_helpful = report.total_excels_at_i_gave_that_was_helpful;
            row.total_could_improve_i_gave_that_was_helpful = report.total_could_improve_i_gave_that_was_helpful;
            row.total_i_gave_that_was_helpful = report.total_i_gave_that_was_helpful;
            vm.csv.push(row);
        });
    }
}