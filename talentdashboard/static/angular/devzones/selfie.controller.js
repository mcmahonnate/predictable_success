    angular
        .module('devzones')
        .controller('SelfieController', SelfieController);

    function SelfieController(DevZoneService, Notification, $location, $routeParams) {
        var vm = this;

        vm.selfie = null;
        vm.busy = false;
        vm.gotoDevZones = gotoDevZones;

        activate();

        function activate() {
            getSelfie();
        }

        function getSelfie() {
            DevZoneService.getEmployeeZone($routeParams.selfieId)
                .then(function(selfie){
                    vm.selfie = selfie;
                },
                function() {
                    Notification.error("You don't have access to this selfie.")
                }
            )

        }

        function gotoDevZones() {
            $location.path('/devzones/');
        }


    }
