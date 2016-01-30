angular
    .module('devzones')
    .controller('DevZonesController', DevZonesController);

function DevZonesController(DevZoneService, Notification, analytics, $location, $modal, $scope, $sce, $rootScope) {
    /* Since this page can be the root for some users let's make sure we capture the correct page */
    var location_url = $location.url().indexOf('/devzones') < 0 ? '/devzones' : $location.url();
    analytics.trackPage($scope, $location.absUrl(), location_url);

    var vm = this;
    vm.showEmptyScreen = false;
    vm.welcome = $sce.trustAsHtml($rootScope.customer.devzones_welcome);
    vm.submitDevZone = submitDevZone;

    activate();

    function activate() {

    };

    function submitDevZone() {
        var modalInstance = $modal.open({
            animation: true,
            windowClass: 'xx-dialog fade zoom',
            backdrop: 'static',
            templateUrl: '/static/angular/devzones/partials/_modals/add-selfie.html',
            controller: 'SelfieController as selfie',
            resolve: {
                    selfie: function () {
                        return null
                    }
            }
        });
        modalInstance.result.then(
            function (selfie) {
                //getActiveProjects();
            }
        );
    }

}
