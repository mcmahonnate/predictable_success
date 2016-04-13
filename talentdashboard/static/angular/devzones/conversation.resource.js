angular
    .module('devzones')
    .factory('ConversationResource', ConversationResource);

function ConversationResource($resource) {
    var actions = {
        'create': {
            method: 'POST',
            isArray: true
        },
        'get': {
            method: 'GET',
        },
        'update': {
            method: 'PUT',
        },
        'updateBulk': {
            method: 'PUT',
            url: '/api/v1/devzones/conversations/update/',
            isArray: true
        },
        'deleteBulk': {
            method: 'PUT',
            url: '/api/v1/devzones/conversations/delete/',
            isArray: true
        },
        'getMyConversations': {
            method: 'GET',
            url: '/api/v1/devzones/conversations/my/',
            isArray: true
        },
        'getMyCurrentConversation': {
            method: 'GET',
            url: '/api/v1/devzones/conversations/my/current/'
        },
        'getMyTeamLeadConversations': {
            method: 'GET',
            url: '/api/v1/devzones/conversations/team-lead/',
            isArray: true
        },
    };
    return $resource('/api/v1/devzones/conversations/:id/', null, actions);
}
