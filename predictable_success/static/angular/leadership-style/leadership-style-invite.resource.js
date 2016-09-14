angular
    .module('leadership-style')
    .factory('LeadershipStyleInviteResource', LeadershipStyleInviteResource);

function LeadershipStyleInviteResource($resource) {
    var actions = {
        'sendInvites': {
            method: 'POST',
            url: '/api/v1/leadership-style/teams/invite/'
        },
    };
    return $resource('/api/v1/leadership-style/teams/:id/', null, actions);
}
