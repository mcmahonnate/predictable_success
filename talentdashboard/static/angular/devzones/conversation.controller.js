    angular
        .module('devzones')
        .controller('ConversationController', ConversationController);

    function ConversationController(analytics, ConversationService, DevZoneService, Notification, $location, $parse, $rootScope, $routeParams, $scope) {
        analytics.trackPage($scope, $location.absUrl(), $location.url());

        var vm = this;
        vm.is_employee = false;
        vm.is_org_dev = false;
        vm.is_development_lead = false;
        vm.selfie = null;
        vm.busy = false;
        vm.gotoID = gotoID;
        vm.employee = null;
        vm.development_lead = null;
        vm.development_lead_assessment = null;
        vm.collapseLeadershipAdvice = true;
        vm.collapseEmployeeAdvice = true;
        vm.collapseSelfie = true;
        vm.collapseLeadershipPerception = true;
        vm.replaceTemplateTags = replaceTemplateTags;
        activate();

        function activate() {
            getConversation();
        }

        function getConversation() {
            ConversationService.get($routeParams.conversationId)
                .then(function(conversation){
                    vm.development_lead_assessment = conversation.development_lead_assessment
                    vm.selfie = conversation.employee_assessment;
                    if (!vm.selfie.zone) {
                        gotoID();
                        Notification.error(vm.selfie.employee.first_name +  " has not finished their selfie.")
                    }
                    vm.employee = conversation.employee;
                    vm.development_lead = conversation.development_lead;
                    if (vm.employee.id == $rootScope.currentUser.employee.id) {
                        vm.is_employee = true;
                    } else if (vm.development_lead.id == $rootScope.currentUser.employee.id) {
                        vm.is_development_lead = true;
                    }
                    if ($rootScope.currentUser.permissions.indexOf("org.view_employees") > -1) {
                        vm.is_org_dev = true;
                    }
                },
                function() {
                    Notification.error("You don't have access to this selfie.")
                }
            )
        }

        function gotoID() {
            $location.path('/id/');
        }

        function replaceTemplateTags(html) {
            var template = $parse(html);
            return template(vm);
        }
    }
