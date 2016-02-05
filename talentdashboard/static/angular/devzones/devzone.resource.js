angular
    .module('devzones')
    .factory('DevZoneResource', DevZoneResource);

function DevZoneResource($resource) {
    var actions = {
        'get': {
            method: 'GET'
        },
        'save': {
            method: 'POST',
            url: '/api/v1/devzones/selfies/start/'
        },
        'update': {
            method: 'PUT',
            url: '/api/v1/devzones/selfies/:id/update/'
        },
        'getUnfinished': {
            method: 'GET',
            url: '/api/v1/devzones/selfies/unfinished/'
        },
        'getMyZones': {
            method: 'GET',
            url: '/api/v1/devzones/selfies/',
            isArray: true
        },
        'getMyConversation': {
            method: 'GET',
            url: '/api/v1/devzones/conversations/current/'
        },
        'getMyTeamLeadConversations': {
            method: 'GET',
            url: '/api/v1/devzones/conversations/team-lead/',
            isArray: true
        }
    };
    return $resource('/api/v1/devzones/:id/', null, actions);
}
