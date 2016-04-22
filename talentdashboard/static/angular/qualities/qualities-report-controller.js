    angular
        .module('qualities')
        .controller('QualitiesReportController', QualitiesReportController);

    function QualitiesReportController(analytics, $location, $scope, $rootScope, Notification, PerceivedQualityService) {
        analytics.trackPage($scope, $location.absUrl(), $location.url());
        var vm = this;
        vm.qualities = [];
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
                    vm.qualities = data.qualities;
                    return null;
                });
        }
    }