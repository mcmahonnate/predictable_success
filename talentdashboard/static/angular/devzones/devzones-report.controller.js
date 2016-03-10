angular
    .module('devzones')
    .controller('DevZonesReportController', DevZonesReportController);

function DevZonesReportController(DevZonesReportService, Notification, analytics, $location, $scope, $routeParams, $filter) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());

    var vm = this;
    vm.startDate = $routeParams.startDate ? $routeParams.startDate : null;
    vm.endDate = $routeParams.endDate ? $routeParams.endDate : null;
    vm.report = [];
    vm.getDevZonesReport = getDevZonesReport;
    vm.showResults = false;
    vm.busy = false;
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
            getDevZonesReport();
        }
    }

    function getDevZonesReport() {
        vm.busy = true;
        vm.showResults = true;
        return DevZonesReportService.getDevZonesReport(vm.startDate, vm.endDate)
            .then(function (data) {
                vm.report = data;
                vm.csv = [];
                buildCSV();
                vm.busy = false;
                return vm.report;
            })
            .catch(function () {
                vm.busy = false;
                Notification.error("We had an error processing your report.");
            });
    }

    function buildCSV() {
        vm.csv = [];
        angular.forEach(vm.report, function (report) {
            var row = {};
            row.id = report.employee.id;
            row.name = report.employee.full_name;
            row.email = report.employee.email;
            row.team = report.employee.team.name;
            row.hire_date = report.employee.hire_date;
            row.meeting = report.meeting_name;
            row.represented_by = report.assessor.full_name;
            row.finished_selfie = report.completed;
            row.finished_date = report.completed ? report.date : null;
            if (!report.completed) report.date = null;
            row.selfie_perception = report.zone ? report.zone.name : null;
            row.notes = report.notes;
            report.answers = $filter('orderBy')(report.answers, 'question_order', false)
            angular.forEach(report.answers, function (answer) {
                row['question_' + answer.id] = answer.question_text;
                row['answer_' + answer.id] = answer.text;
            });
            vm.csv.push(row);

        });
    }
}