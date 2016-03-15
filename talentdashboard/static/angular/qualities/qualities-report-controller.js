    angular
        .module('qualities')
        .controller('QualitiesReportController', QualitiesReportController);

    function QualitiesReportController(analytics, $location, $scope, Notification, PerceivedQualityService) {
        analytics.trackPage($scope, $location.absUrl(), $location.url());
        var vm = this;
        vm.qualities = [];
        vm.giveUnsolicited = giveUnsolicited;
        vm.orderByGroupCount = orderByGroupCount;
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

        function orderByGroupCount(group) {
            console.log(group);
            console.log(group.length);
            return group.length;
        }
    }