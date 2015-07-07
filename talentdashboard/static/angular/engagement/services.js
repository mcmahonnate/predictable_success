angular.module('tdb.engagement.services', ['ngResource'])

    .factory('Happiness', ['$resource', function ($resource) {
        return $resource('/api/v1/happiness/:id/', {id: '@id'});
    }]);
