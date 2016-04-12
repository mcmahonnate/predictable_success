angular
    .module('devzones')
    .factory('MeetingResource', MeetingResource);

function MeetingResource($resource) {
    var actions = {
        'get': {
            method: 'GET',
        },
        'create': {
            url: '/api/v1/devzones/meetings/create/',
            method: 'POST',
        },
        'update': {
            url: '/api/v1/devzones/meetings/:id/update/',
            method: 'PUT',
        },
        'getMyMeetings': {
            method: 'GET',
            isArray: true
        },
    };
    return $resource('/api/v1/devzones/meetings/:id/', null, actions);
}
