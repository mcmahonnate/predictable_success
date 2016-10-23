angular
    .module('leadership-style')
    .factory('LeadershipStyleTeamService', LeadershipStyleTeamService);

function LeadershipStyleTeamService($log, LeadershipStyleTeamResource) {
    return {
        getTeamsIOwn: getTeamsIOwn,
        getTeamsIBelongTo: getTeamsIBelongTo,
        getTeam: getTeam,
        removeTeamMember: removeTeamMember,
        requestTeamReport: requestTeamReport,
    };

    function getTeamsIBelongTo() {

        return LeadershipStyleTeamResource.getTeamsIBelongTo(null, success, fail).$promise;

        function success(teams) {
            return teams;
        }

        function fail(response) {
            $log.error('getTeamsIBelongTo failed');
        }
    }

    function getTeamsIOwn() {

        return LeadershipStyleTeamResource.getTeamsIOwn(null, success, fail).$promise;

        function success(teams) {
            return teams;
        }

        function fail(response) {
            $log.error('getTeamsIOwn failed');
        }
    }


    function getTeam(id) {

        return LeadershipStyleTeamResource.getTeam({id: id}, success, fail).$promise;

        function success(team) {
            return team;
        }

        function fail(response) {
            $log.error('getTeam failed');
        }
    }

    function removeTeamMember(id, team_member) {
        return LeadershipStyleTeamResource.removeTeamMember({id: id}, {team_member: team_member.id}, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('removeTeamMember failed');
        }
    }

    function requestTeamReport(id, message) {
        return LeadershipStyleTeamResource.requestTeamReport({id: id}, {message: message}, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('requestTeamReport failed');
        }
    }
}