(function() {
    angular
        .module('feedback')
        .controller('FeedbackWorksheetController', FeedbackWorksheetController);

    FeedbackWorksheetController.$inject = ['$routeParams', 'FeedbackAPI'];

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
            console.log($routeParams.id);
            return FeedbackAPI.getFeedbackProgressReportForEmployee($routeParams.id)
                .then(function (data) {
                    vm.progressReport = data;
                    return vm.progressReport;
                });
        }
    }
})();