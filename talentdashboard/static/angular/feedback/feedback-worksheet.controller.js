(function() {
    angular
        .module('feedback')
        .controller('FeedbackWorksheetController', FeedbackWorksheetController);

    FeedbackWorksheetController.$inject = ['FeedbackAPI'];

    function FeedbackWorksheetController($routeParams, FeedbackAPI) {
        var vm = this;
        vm.progressReport = null;
        vm.digest = null;
        vm.getFeedbackProgressReport = getFeedbackProgressReport;

        activate();

        function activate() {
            getFeedbackProgressReport()
        }

        function getFeedbackProgressReport() {
            return FeedbackAPI.getFeedbackProgressReportForEmployee($routeParams.id)
                .then(function (data) {
                    vm.progressReport = data;
                    return vm.progressReport;
                });
        }
    }
})();