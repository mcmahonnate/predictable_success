    angular
        .module('qualities')
        .controller('QualitiesReportController', QualitiesReportController);

    function QualitiesReportController(analytics, $location, $scope, Notification, PerceivedQualityService) {
        analytics.trackPage($scope, $location.absUrl(), $location.url());
        var vm = this;
        vm.shared_qualities = [];
        vm.blind_qualities = [];
        vm.hidden_qualities = [];
        vm.giveUnsolicited = giveUnsolicited;
        activate();

        function activate() {
            getPerceivedQualities();
        }

        function giveUnsolicited() {
            $location.path('/qualities/perception/submission');
        }

        function getPerceivedQualities() {
            return PerceivedQualityService.getMyQualities()
                .then(function (data) {
                    vm.shared_qualities = data.shared_qualities;
                    vm.blind_qualities = data.blind_qualities;
                    vm.hidden_qualities = data.hidden_qualities;
                    return null;
                });
        }
    }