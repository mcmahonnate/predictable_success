angular
    .module('checkins')
    .controller('CheckInsReportController', CheckInsReportController);

function CheckInsReportController(CheckInsReportService, Notification, analytics, $location, $scope, $routeParams) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());

    var vm = this;
    vm.startDate = $routeParams.startDate ? $routeParams.startDate : null;
    vm.endDate = $routeParams.endDate ? $routeParams.endDate : null;
    vm.report = [];
    vm.getCheckInsReport = getCheckInsReport;
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
            getCheckInsReport();
        }
    }

    function getCheckInsReport() {
        return CheckInsReportService.getCheckInsReport(vm.startDate, vm.endDate)
            .then(function (data) {
                vm.report = data;
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
            row.email = report.employee.email;
            row.team = report.employee.team.name;
            row.type = report.type.name;
            row.other_type_description = report.other_type_description;
            row.host = report.host.full_name;
            row.happiness = report.happiness.assessment_verbose;
            row.checkin_date = report.date;
            row.sent_to_employee = report.visible_to_employee;
            row.sent_to_employee_date = report.visible_to_employee_date;
            row.published = report.published;
            row.published_date = report.published_date;
            row.total_comments = report.total_comments;
            row.total_tasks = report.total_tasks;
            vm.csv.push(row);
        });
    }
}