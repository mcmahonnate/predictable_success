    angular
        .module('devzones')
        .controller('ConversationController', ConversationController);

    function ConversationController(analytics, ConversationService, DevZoneService, Notification, $location, $modal, $parse, $rootScope, $routeParams, $scope) {
        analytics.trackPage($scope, $location.absUrl(), $location.url());

        var vm = this;
        vm.is_employee = false;
        vm.is_org_dev = false;
        vm.is_development_lead = false;
        vm.selfie = null;
        vm.busy = false;
        vm.gotoID = gotoID;
        vm.employee = null;
        vm.conversation = null;
        vm.development_lead = null;
        vm.collapseLeadershipAdvice = true;
        vm.collapseEmployeeAdvice = true;
        vm.collapseSelfie = true;
        vm.collapseLeadershipPerception = true;
        vm.giveLeaderPerception = giveLeaderPerception;
        vm.replaceTemplateTags = replaceTemplateTags;
        activate();

        function activate() {
            getConversation();
        }

        function getConversation() {
            ConversationService.get($routeParams.conversationId)
                .then(function(conversation){
                    vm.conversation = conversation;
                    vm.advice = conversation.advice;
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

        function giveLeaderPerception(conversation) {
            var modalInstance = $modal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: '/static/angular/devzones/partials/_modals/leader-assessment.html',
                controller: 'LeaderAssessmentController as leaderAssessment',
                resolve: {
                    compactView: function () {
                        return false
                    },
                    conversation: function () {
                        return conversation
                    },}
            });
            modalInstance.result.then(
                function (conversation) {
                    console.log(conversation);
                    vm.conversation = conversation;
                }
            );
        }

        function gotoID() {
            $location.path('/id/');
        }

        function replaceTemplateTags(html) {
            var template = $parse(html);
            return template(vm);
        }
    }
