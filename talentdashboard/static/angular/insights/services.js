angular.module('tdb.insights.services', ['ngResource'])

    .factory('Prospect', ['$resource', '$http', function($resource, $http) {
        Prospect = $resource('/api/v1/prospect/');

        return Prospect;
    }])

    .factory('ProspectReport', ['$resource', '$http', function($resource, $http) {
        ProspectReport = $resource('/api/v1/prospects/');

        return ProspectReport;
    }])
;