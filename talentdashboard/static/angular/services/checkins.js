angular.module('tdb.services.checkins', ['ngResource'])

    .factory('CheckInType', ['$resource', function ($resource) {
        var CheckInType = $resource('/api/v1/checkintypes/');
        return CheckInType;
    }])

    .factory('CheckIn', ['$resource', function ($resource) {
        var fromServer = function(checkIn) {
            var copy = angular.copy(checkIn);
            copy.date = copy.date ? new Date(copy.date) : null;
            return copy
        };

        var actions = {
            'get': {
                method: 'GET',
                transformResponse: [
                    angular.fromJson,
                    fromServer
                ]
            },
            'query': {
                method: 'GET'
            },
            'save': {
                method: 'POST',
                transformResponse: [
                    angular.fromJson,
                    fromServer
                ]
            },
            'update': {
                method: 'PUT',
                transformResponse: [
                    angular.fromJson,
                    fromServer
                ]
            },
            'delete': {
                'method': 'DELETE'
            }
        };

        var CheckIn = $resource('/api/v1/checkins/:id/', {id: '@id'}, actions);
        return CheckIn;
    }]);