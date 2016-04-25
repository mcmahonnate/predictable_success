    angular
        .module('qualities')
        .controller('QualitiesReportController', QualitiesReportController);

    function QualitiesReportController(analytics, $location, $scope, $modal, $rootScope, Notification, PerceivedQualityService, PerceptionRequestService) {
        analytics.trackPage($scope, $location.absUrl(), $location.url());
        var vm = this;
        vm.showEmptyScreen = false;
        vm.qualities = [];
        vm.prompts = [];
        vm.myRecentlySentRequests = [];
        vm.qualitiesLoaded = false;
        vm.myRecentlySentRequestsLoaded = false;
        vm.giveUnsolicited = giveUnsolicited;
        vm.requestPerception = requestPerception;
        $rootScope.successRequestMessage = false;
        $rootScope.hideMessage = false;
        $rootScope.hideRequestMessage = false;
        activate();

        function activate() {
            getPerceivedQualities();
            getMyRecentlySentRequests();
        }

        function checkIsEmpty() {
            if (vm.qualitiesLoaded & vm.myRecentlySentRequestsLoaded) {
                if (vm.qualities.length == 0) {
                    vm.showEmptyScreen = true;
                } else {
                    vm.showEmptyScreen = false;
                }
                if (vm.myRecentlySentRequests.length == 0) {
                    vm.requestPerception(-1);
                }
            }
        }

        function giveUnsolicited() {
            $location.path('/qualities/perception/submission');
        }

        function getPerceivedQualities() {
            return PerceivedQualityService.getMyQualities()
                .then(function (data) {
                    vm.qualities = data.qualities;
                    vm.prompts = data.prompts;
                    vm.qualitiesLoaded = true;
                    checkIsEmpty();
                    return null;
                });
        }

        function getMyRecentlySentRequests() {
            PerceptionRequestService.getMyRecentlySentRequests()
                .then(function (data) {
                    vm.myRecentlySentRequests = data;
                    vm.myRecentlySentRequestsLoaded = true;
                    checkIsEmpty();
                    return vm.myRecentlySentRequests;
                });
        }

        function requestPerception(panel) {
            var modalInstance = $modal.open({
                animation: true,
                windowClass: 'xx-dialog fade zoom',
                backdrop: 'static',
                templateUrl: '/static/angular/qualities/partials/_modals/request-perception.html',
                controller: 'RequestPerceptionController as request',
                resolve: {
                    panel: function () {
                        return panel
                    }
                }
            });
            modalInstance.result.then(
                function (sentPerceptionRequests) {
                    getMyRecentlySentRequests();
                }
            );
        }
    }