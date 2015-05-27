angular.module('tdb.search.services', ['ngResource'])

    .factory('EmployeeSearch', ['$resource', function ($resource) {
        var EmployeeSearch = $resource('/api/v1/search/employees/');
        return EmployeeSearch;
    }])
;