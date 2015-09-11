angular.module('tdb.comp.services', ['ngResource'])

    .factory('CompSummary', ['$resource', '$http', function($resource, $http) {
        var CompSummary = $resource('/api/v1/compensation-summaries/employees/:employee_id/');

        CompSummary.getAllSummariesForEmployee = function(id) { return this.query({employee_id: id}); };

        return CompSummary;
    }])
;