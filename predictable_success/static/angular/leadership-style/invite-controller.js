    angular
        .module('leadership-style')
        .controller('InviteController', InviteController);

    function InviteController(analytics,LeadershipStyleInviteService, Notification, team_id, remaining_invites, team_member_count, $timeout, $modalInstance, $rootScope) {
        var vm = this;
        analytics.setPage('/team/invite');
        analytics.trackPage();
        vm.remaining_invites = remaining_invites;
        vm.has_team_members = team_member_count > 1 ? true :  false;
        vm.subject = $rootScope.currentUser.employee;
        vm.message = '';
        vm.submit = submit;
        vm.cancel = cancel;
        vm.addEmail = addEmail;
        vm.invites = []
        vm.enableSend = true;

        activate();

        function activate() {
            var count = remaining_invites >=3 ? 3 : remaining_invites;
            for (var i = 0; i < count; i++) {
                addEmail();
            }
        }

        function addEmail() {
            var invite = angular.copy({'email': ''});
            vm.invites.push(invite);
        }

        function submit() {
            analytics.trackEvent('Send invites button', 'click', null);
            vm.enableSend = false;
            var invites = [];
            var invite_notifications = [];
            angular.forEach(vm.invites, function(invite){
                if (invite.email) {
                    invites.push(invite.email);
                    invite_notifications.push(invite);
                }
            })
            LeadershipStyleInviteService.sendInvites(team_id, invites)
                .then(function(invites) {
                    var message;
                    if (invite_notifications.length == 1) {
                        message = 'An invitation has been sent to ' + invite_notifications['0'].email;
                    } else if (invite_notifications.length == 2) {
                        message = 'Invitations have been sent to ' +  invite_notifications['0'].email + ' and '  + invite_notifications['1'].email;
                    } else {
                        message = 'Invitations have been sent to ';
                        angular.forEach(invite_notifications, function(value, key) {
                            if (key == 0) {
                                message = message + value.email;
                            } else if (key < invite_notifications.length-1) {
                                message = message + ', ' + value.email;
                            } else if (key == invite_notifications.length-1) {
                                message = message + ' and ' + value.email;
                            }
                        })
                    }

                    Notification.success(message)
                    $modalInstance.close(invites)
                });
        }

        function cancel() {
            analytics.trackEvent('Cancel button', 'click', null);
            $modalInstance.dismiss();
        }
    }
