angular.module('tdb.search.services', ['ngResource'])

    .factory('EmployeeSearch', ['$resource', function ($resource) {
        var EmployeeSearch = $resource('/api/v1/search/employees/');
        return EmployeeSearch;
    }])

    .factory('TalentReport', ['$resource', function ($resource) {
        var actions = {
            query: {method: 'GET', isArray: false},
            myTeam: {method: 'GET', isArray: false, url: '/api/v1/reports/talent/my-team/'},
            myCoachees: {method: 'GET', isArray: false, url: '/api/v1/reports/talent/my-coachees/'}
        };
        var TalentReport = $resource('/api/v1/reports/talent/', null, actions);
        return TalentReport;
    }])
;