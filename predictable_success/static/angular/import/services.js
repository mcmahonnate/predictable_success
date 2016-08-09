angular.module('tdb.import.services', ['ngResource'])
    .factory('ImportData', ['$resource', '$http', function($resource, $http) {
        var actions = {
            'addNew': { method:'POST', isArray: true },
            'addNewEmployee': { method:'POST', url:'/api/v1/import-data/employee', isArray: false },
            'addNewLeadership': { method:'POST', url:'/api/v1/import-data/leadership', isArray: false },
            'addNewTeams': { method:'POST', url:'/api/v1/import-data/teams', isArray: true }
        }
        var ImportData = $resource('/api/v1/import-data/', {id:'@id'}, actions);

        return ImportData;
    }])
;