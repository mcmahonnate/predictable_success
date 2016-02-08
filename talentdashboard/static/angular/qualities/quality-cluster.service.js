angular
    .module('qualities')
    .factory('QualityClusterService', QualityClusterService);

function QualityClusterService($log, QualityClusterResource) {
    return {
        getQualityCluster: getQualityCluster,
        getQualityClusters: getQualityClusters
    };

    function getQualityCluster(clusterId) {
        return QualityClusterResource.get({id: clusterId}, success, fail).$promise;

        function success(response) {
            return response.data;
        }

        function fail(response) {
            $log.error('getQualityCluster failed');
        }
    }

    function getQualityClusters() {
        return QualityClusterResource.query(null , success, fail).$promise;

        function success(response) {
            return response.data;
        }

        function fail(response) {
            $log.error('getQualityCluster failed');
        }
    }
}