angular
    .module('checkins')
    .factory('CheckInsResource', CheckInsResource);

function CheckInsResource($resource) {
    var actions = {
        'get': {
            method: 'GET'
        },
        'getMyCheckIns': {
            'method': 'GET',
            isArray: true
        },
        'query': {
            method: 'GET',
            isArray: true
        },
        'save': {
            method: 'POST'
        },
        'update': {
            method: 'PUT'
        },
        'delete': {
            'method': 'DELETE'
        },
        'send': {
            method: 'PUT',
            url: '/api/v1/checkins/:id/send/'
        },
        'share': {
            method: 'PUT',
            url: '/api/v1/checkins/:id/share/'
        }
    };
    return $resource('/api/v1/checkins/:id/', null, actions);
}
