angular
    .module('checkins')
    .factory('CheckInRequestResource', CheckInRequestResource);

function CheckInRequestResource($resource) {
    var actions = {
        'sendCheckInRequest': {
            method: 'POST',
            isArray: true
        },
        'getMyCheckInToDos': {
            url: '/api/v1/checkins/requests/todo/',
            method: 'GET',
            isArray: true
        },
        'getMyCheckInRequests': {
            url: '/api/v1/checkins/requests/my/',
            method: 'GET',
            isArray: true
        }
    };
    return $resource('/api/v1/checkins/requests/:id/', null, actions);
}
