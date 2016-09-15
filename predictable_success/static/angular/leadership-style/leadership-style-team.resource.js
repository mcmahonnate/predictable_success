angular
    .module('leadership-style')
    .factory('LeadershipStyleTeamResource', LeadershipStyleTeamResource);

function LeadershipStyleTeamResource($resource) {
    var actions = {
        'getTeamsIBelongTo': {
            method: 'GET',
            isArray: true
        },
        'getTeamsIOwn': {
            url: '/api/v1/leadership-style/teams/owned',
            method: 'GET',
            isArray: true
        },
        'getTeam': {
            method: 'GET',
            isArray: false
        },
    };
    return $resource('/api/v1/leadership-style/teams/:id', null, actions);
}
