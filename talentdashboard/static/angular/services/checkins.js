angular.module('tdb.services.checkins', ['ngResource'])

    .factory('CheckIn', ['$resource', function ($resource) {
        var CheckIn = $resource('/api/v1/checkins/:id/', {id: '@id'});
        return CheckIn;
    }]);