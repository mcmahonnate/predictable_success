    angular
        .module('devzones')
        .controller('SelfieController', SelfieController);

    function SelfieController(DevZoneService, Notification, $location, $routeParams) {
        var vm = this;

        vm.selfie = null;
        vm.busy = false;
        vm.gotoDevZones = gotoDevZones;
        vm.collapseLeadershipAdvice = true;
        vm.collapseEmployeeAdvice = true;
        vm.collapseSelfieAnswers = true;
        activate();

        function activate() {
            getSelfie();
        }

        function getSelfie() {
            DevZoneService.getEmployeeZone($routeParams.selfieId)
                .then(function(selfie){
                    vm.selfie = selfie;
                    if (!vm.selfie.zone) {
                        gotoDevZones();
                        Notification.error(vm.selfie.employee.first_name +  " has not finished their selfie.")
                    }
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
