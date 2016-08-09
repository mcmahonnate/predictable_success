angular
    .module('feedback')
    .controller('FeedbackReportController', FeedbackReportController);

function FeedbackReportController(FeedbackReportService, $scope, $location, $routeParams, analytics) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());

    var vm = this;
    vm.startDate = $routeParams.startDate ? $routeParams.startDate : null;
    vm.endDate = $routeParams.endDate ? $routeParams.endDate : null;
    vm.getFeedbackReport = getFeedbackReport;
    vm.showResults = false;
    vm.reportType = 'totals';
    vm.reportTotals = [];
    vm.predicateTotals = 'employee.full_name';
    vm.reverseTotals = false;
    vm.buildTotalsCSV = buildTotalsCSV;
    vm.csvTotals = [];
    vm.reportTimestamps = [];
    vm.predicateTimestamps = 'requester.full_name';
    vm.reverseTimestamps = false;
    vm.buildTimestampsCSV = buildTimestampsCSV;
    vm.csvTimestamps = [];

    vm.orderTotals = function (predicate) {
        vm.reverseTotals = (vm.predicateTotals === predicate) ? !vm.reverseTotals : true;
        vm.predicateTotals = predicate;
    };

    vm.orderTimestamps = function (predicate) {
        vm.reverseTimestamps = (vm.predicateTimestamps === predicate) ? !vm.reverseTimestamps : true;
        vm.predicateTimestamps = predicate;
    };

    activate()

    function activate() {
        if (vm.startDate && vm.endDate) {
            getFeedbackReport();
        }
    }

    function getFeedbackReport() {
        return FeedbackReportService.getFeedbackReport(vm.startDate, vm.endDate, vm.reportType)
            .then(function (data) {
                if (vm.reportType == 'timestamps') {
                    loadTimestampsReport(data);
                } else {
                    loadTotalsReport(data);
                }
            })
            .catch(function () {
                Notification.error("We had an error processing your report.");
            });
    }

    function loadTimestampsReport(data) {
        vm.reportTimestamps = data.requests;
        angular.forEach(data.unsolicited_submissions, function (submission) {
            var row = {requester: submission.subject, request_date: null, expiration_date: null, reviewer: submission.reviewer, submission: submission};
            vm.reportTimestamps.push(row);
        })
        vm.showResults = true;
        vm.csvTimestamps = [];
        buildTimestampsCSV();
    }

    function loadTotalsReport(data) {
        vm.reportTotals = data.employee_report;
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
        vm.csvTotals = [];
        buildTotalsCSV();
    }

    function buildTotalsCSV() {
        vm.csvTotals = [];
        angular.forEach(vm.reportTotals, function (report) {

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
            vm.csvTotals.push(row);
        });
    }

    function buildTimestampsCSV() {
        vm.csvTimestamps = [];
        angular.forEach(vm.reportTimestamps, function (request) {
            var row = {};
            row.employee_id = request.requester.id;
            row.employee = request.requester.full_name;
            row.request_date = request.request_date;
            row.expiration_date = request.expiration_date;
            row.reviewer_id = request.reviewer.id;
            row.reviewer = request.reviewer.full_name;
            row.feedback_date = request.submission ? request.submission.feedback_date : null;
            vm.csvTimestamps.push(row);
        });
    }
}