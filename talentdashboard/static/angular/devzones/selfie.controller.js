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
            getConversation();
        }

        function getConversation() {
            ConversationService.get($routeParams.selfieId)
                .then(function(conversation){
                    vm.conversation = conversation;
                    vm.selfie = vm.conversation.employee_assessment;
                    if (!vm.selfie.zone) {
                        gotoDevZones();
                        Notification.error(vm.selfie.employee.first_name +  " has not finished their selfie.")
                    }
                    vm.employee = vm.conversation.employee;
                    vm.development_lead = vm.conversation.development_lead;


                },
                function() {
                    Notification.error("You don't have access to this selfie.")
                }
            )
        }

        function gotoDevZones() {
            $location.path('/devzones/');
        }

        function replaceTemplateTags(html) {
            var template = $parse(html);
            return template(vm);
        }
    }
