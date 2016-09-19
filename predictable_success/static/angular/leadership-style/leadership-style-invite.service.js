angular
    .module('leadership-style')
    .factory('LeadershipStyleInviteService', LeadershipStyleInviteService);

function LeadershipStyleInviteService($log, LeadershipStyleInviteResource) {
    return {
        sendInvites: sendInvites,
    };

    function sendInvites(team_id, emails)  {
        var invites = {emails: emails};

        return LeadershipStyleInviteResource.sendInvites({id:team_id}, invites, success, fail).$promise;

        function success(sentInvites) {
            return sentInvites;
        }

        function fail(response) {
            $log.error('sendInvites failed');
        }
    }

}