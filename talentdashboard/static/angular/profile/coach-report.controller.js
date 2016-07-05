angular
    .module('profile')
    .controller('CoachReportController', CoachReportController);

function CoachReportController(analytics, CoachReportService, $location, $modal, $scope) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());
    var vm = this;
    vm.capacityReport = [];
    vm.blockedReport = [];
    vm.capacityReportPredicate = 'capacity';
    vm.capacityReportReverse = false;
    vm.blockedReportPredicate = 'blacklisted_by_count';
    vm.blockedReportReverse = true;
    vm.blockedReportBusy = true;
    vm.capacityReportOrder = function (predicate) {
        vm.capacityReportReverse = (vm.capacityReportPredicate === predicate) ? !vm.capacityReportReverse : true;
        vm.capacityReportPredicate = predicate;
    };
    vm.blockedReportOrder = function (predicate) {
        vm.blockedReportReverse = (vm.blockedReportPredicate === predicate) ? !vm.blockedReportReverse : true;
        vm.blockedReportPredicate = predicate;
    };
    vm.capacityCSV = [];
    vm.blockedCSV = [];

    activate()

    function activate() {
        getCoachCapacityReport();
        getCoachBlacklistReport();
    }

    function getCoachCapacityReport() {
        vm.capacityReportBusy = true;
        return CoachReportService.getCoachCapacityReport()
            .then(function (data) {
                vm.capacityReport = data;
                vm.capacityCSV = [];
                buildCapacityCSV();
                vm.capacityReportBusy = false;
                return vm.capacityReport;
            })
            .catch(function () {
                Notification.error("We had an error processing your report.");
            });
    }

    function getCoachBlacklistReport() {
        vm.blockedReportBusy = true;
        return CoachReportService.getCoachBlacklistReport()
            .then(function (data) {
                vm.blockedReport = data;
                vm.blockedCSV = [];
                buildBlockedCSV();
                vm.blockedReportBusy = false;
                return vm.capacityReport;
            })
            .catch(function () {
                Notification.error("We had an error processing your report.");
            });
    }

    function buildCapacityCSV() {
        vm.capacityCSV = [];
        angular.forEach(vm.capacityReport, function (report) {
            var row = {};
            row.id = report.id;
            row.name = report.full_name;
            row.capacity = report.capacity;
            row.max_allowed_coachees = report.max_allowed_coachees;
            row.number_of_coachees = report.number_of_coachees;
            row.number_blacklisted = report.number_blacklisted;
            row.filled_out_approach = report.filled_out_approach;
            vm.capacityCSV.push(row);
        });
    }

    function buildBlockedCSV() {
        vm.blockedCSV = [];
        angular.forEach(vm.blockedReport, function (report) {
            var row = {};
            row.id = report.id;
            row.name = report.full_name;
            row.blacklisted_by_count = report.blacklisted_by_count;
            vm.blockedCSV.push(row);
        });
    }
}