    angular
        .module('feedback')
        .controller('FeedbackCoachWidgetController', FeedbackCoachWidgetController);

    FeedbackCoachWidgetController.$inject = ['FeedbackRequestService', 'FeedbackDigestService'];

    function FeedbackCoachWidgetController(FeedbackRequestService, FeedbackDigestService) {
        var vm = this;
        vm.show = false;
        vm.progressReports = [];
        vm.digests = [];
        vm.getFeedbackProgressReport = getFeedbackProgressReport;
        vm.showDigestsIveDelivered = showDigestsIveDelivered;
        vm.getDigestsIveDelivered = getDigestsIveDelivered;
        vm.digestsHasNext = true;
        vm.digestsPage = 0;
        vm.pageSize = 3;

        activate();

        function activate() {
            getFeedbackProgressReport();
        }

        function showDigestsIveDelivered() {
            if (vm.digests.length==0) {
                vm.getDigestsIveDelivered();
            }
        }

        function getFeedbackProgressReport() {
            return FeedbackRequestService.getFeedbackProgressReportForEmployees()
                .then(function (data) {
                    vm.progressReports = data;
                    if (vm.progressReports.length > 0) {
                        vm.show = true;
                    }
                    return vm.progressReports;
                });
        }

        function getDigestsIveDelivered() {
            vm.digestsPage += 1;
            return FeedbackDigestService.getDigestsIveDelivered({page: vm.digestsPage, page_size: vm.pageSize})
                .then(function (data) {
                    if (data) {
                        vm.digests = vm.digests.concat(data.results);
                        vm.digestsHasNext = data.has_next;
                        if (vm.digests.length > 0) {
                            vm.show = true;
                        }
                        return vm.digests;
                    }
                });
        }
    }