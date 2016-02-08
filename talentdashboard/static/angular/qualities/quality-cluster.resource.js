angular
    .module('qualities')
    .factory('QualityClusterResource', QualityClusterResource);

function QualityClusterResource($resource) {
    return $resource('/api/v1/qualities/clusters/:id/');
}