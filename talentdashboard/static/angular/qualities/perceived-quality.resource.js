angular
    .module('qualities')
    .factory('PerceivedQualityResource', PerceivedQualityResource);

function PerceivedQualityResource($resource) {
    var actions = {
        'createPerceivedQualities': {
            method: 'POST',
            isArray: true
        }
    };
    return $resource('/api/v1/qualities/perception/:id', null, actions);
}
