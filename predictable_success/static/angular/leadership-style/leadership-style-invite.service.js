angular
    .module('leadership-style')
    .factory('LeadershipStyleInviteService', LeadershipStyleInviteService);

function LeadershipStyleInviteService($log, LeadershipStyleInviteResource) {
    return {
        sendInvites: sendInvites,
        remind: remind,
        remindMany: remindMany
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

    function remindMany(quiz_ids, message)  {

        return LeadershipStyleInviteResource.remindMany(null, {quiz_ids:quiz_ids, message:message}, success, fail).$promise;

        function success(quizzes) {
            return quizzes;
        }

        function fail(response) {
            $log.error('remindMany failed');
        }
    }

    function sendInvites(team_id, invites)  {

        return LeadershipStyleInviteResource.sendInvites({id:team_id}, {invites: invites}, success, fail).$promise;

        function success(sentInvites) {
            return sentInvites;
        }

        function fail(response) {
            $log.error('sendInvites failed');
        }
    }

}