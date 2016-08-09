angular.module('tdb.kpi.services', ['ngResource'])

    .factory('KPIIndicator', ['$resource', '$http', function($resource, $http) {
        var res = $resource('/api/v1/kpi-indicator/');
        return res;
    }])

    .factory('KPIPerformance', ['$resource', '$http', function($resource, $http) {
        var res = $resource('/api/v1/kpi-performance/');
        return res;
    }])
;