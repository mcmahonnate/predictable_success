angular.module('tdb.customers.services', ['ngResource'])

    .factory('Customers', ['$resource', '$http', function($resource, $http) {
        return $resource('api/v1/customer/', {}, {
            get: {
                cache: true,
                method: 'get'
            }
        });
    }])
;
