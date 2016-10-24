angular
    .module('leadership-style')
    .factory('LeadershipStyleInviteService', LeadershipStyleInviteService);

function LeadershipStyleInviteService($log, LeadershipStyleInviteResource) {
    return {
        sendInvites: sendInvites,
        remind: remind,
    };

    function remind(quiz_id, message)  {

        return LeadershipStyleInviteResource.remind({id:quiz_id}, {id:quiz_id, message:message}, success, fail).$promise;

        function success(quiz) {
            return quiz;
        }

        function fail(response) {
            $log.error('remind failed');
        }
    }

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