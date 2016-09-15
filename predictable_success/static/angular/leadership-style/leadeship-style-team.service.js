angular
    .module('leadership-style')
    .factory('LeadershipStyleTeamService', LeadershipStyleTeamService);

function LeadershipStyleTeamService($log, LeadershipStyleTeamResource) {
    return {
        getMyTeams: getMyTeams,
        getTeam: getTeam,
    };

    function getMyTeams() {

        return LeadershipStyleTeamResource.getMyTeams(null, success, fail).$promise;

        function success(teams) {
            return teams;
        }

        function fail(response) {
            $log.error('getMyTeams failed');
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
}