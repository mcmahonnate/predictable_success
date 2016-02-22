    angular
        .module('devzones')
        .controller('SelfieController', SelfieController);

    function SelfieController(ConversationService, DevZoneService, Notification, $location, $routeParams, $parse) {
        var vm = this;

        vm.selfie = null;
        vm.busy = false;
        vm.gotoDevZones = gotoDevZones;
        vm.employee = null;
        vm.development_lead = null;
        vm.collapseLeadershipAdvice = true;
        vm.collapseEmployeeAdvice = true;
        vm.collapseSelfieAnswers = true;
        vm.collapseLeadershipPerception = true;
        vm.replaceTemplateTags = replaceTemplateTags;
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
                    } else {
                        getConversation()
                    }
                },
                function() {
                    Notification.error("You don't have access to this selfie.")
                }
            )

        }

        function getConversation() {
            ConversationService.get(vm.selfie.development_conversation)
                .then(function(conversation){
                    vm.conversation = conversation;
                    vm.employee = vm.conversation.employee;
                    vm.development_lead = vm.conversation.development_lead;
                })
        }

        function gotoDevZones() {
            $location.path('/devzones/');
        }

        function replaceTemplateTags(html) {
            var template = $parse(html);
            return template(vm);
        }
    }
