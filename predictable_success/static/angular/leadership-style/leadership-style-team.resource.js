angular
    .module('leadership-style')
    .factory('LeadershipStyleTeamResource', LeadershipStyleTeamResource);

function LeadershipStyleTeamResource($resource) {
    var actions = {
        'getMyTeams': {
            method: 'GET',
            isArray: true
        },
        'getTeam': {
            method: 'GET',
            isArray: false
        },
    };
    return $resource('/api/v1/leadership-style/teams/', null, actions);
}
