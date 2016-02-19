angular
    .module('devzones')
    .factory('ConversationResource', ConversationResource);

function ConversationResource($resource) {
    var actions = {
        'get': {
            method: 'GET',
        },
        'update': {
            method: 'PUT',
        },
        'getMyConversation': {
            method: 'GET',
            url: '/api/v1/devzones/conversations/current/'
        },
        'getMyTeamLeadConversations': {
            method: 'GET',
            url: '/api/v1/devzones/conversations/team-lead/',
            isArray: true
        },
    };
    return $resource('/api/v1/devzones/conversations/:id/', null, actions);
}
