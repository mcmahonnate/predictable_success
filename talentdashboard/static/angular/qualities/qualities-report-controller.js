    angular
        .module('qualities')
        .controller('QualitiesReportController', QualitiesReportController);

    function QualitiesReportController(analytics, $location, $scope, $rootScope, Notification, PerceivedQualityService) {
        analytics.trackPage($scope, $location.absUrl(), $location.url());
        var vm = this;
        vm.qualities = [];
        vm.giveUnsolicited = giveUnsolicited;
        vm.resizeLayout = resizeLayout;
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

        function resizeLayout(event, collapse) {
            console.log(collapse);
            if (collapse) {
                console.log('shiftLayout');
                $rootScope.packery.shiftLayout();
            } else {
                $rootScope.packery.fit(event.currentTarget);
            }
        }
    }