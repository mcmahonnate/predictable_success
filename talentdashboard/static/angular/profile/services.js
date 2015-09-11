angular.module('tdb.profile.services', ['ngResource'])

    .factory('Profile', ['$resource', '$http', function ($resource, $http) {
        var resource = $resource('api/v1/profile/');
        return resource;
    }])