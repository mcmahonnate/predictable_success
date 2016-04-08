angular
    .module('devzones')
    .factory('DevZoneResource', DevZoneResource);

function DevZoneResource($resource) {
    var actions = {
        'create': {
            method: 'POST',
            url: '/api/v1/devzones/selfies/create/'
        },
        'get': {
            method: 'GET',
            url: '/api/v1/devzones/selfies/:id/'
        },
        'getMyZones': {
            method: 'GET',
            url: '/api/v1/devzones/selfies/:id/',
            isArray: true
        },
        'getUnfinished': {
            method: 'GET',
            url: '/api/v1/devzones/selfies/unfinished/'
        },
        'getZones' : {
            method: 'GET',
            url: '/api/v1/devzones/zones/',
            isArray: true
        },
        'retake': {
            method: 'PUT',
            url: '/api/v1/devzones/selfies/:id/retake/'
        },
        'share': {
            method: 'PUT',
            url: '/api/v1/devzones/selfies/:id/share/'
        },
        'update': {
            method: 'PUT',
            url: '/api/v1/devzones/selfies/:id/update/'
        }
    };
    return $resource('/api/v1/devzones/:id/', null, actions);
}
