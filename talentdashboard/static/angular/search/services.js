angular.module('tdb.search.services', ['ngResource'])

    .factory('EmployeeSearch', ['$resource', function ($resource) {
        var actions = {
            myTeam: {method: 'GET', isArray: true, url: '/api/v1/search/employees/my-team/'},
            myCoachees: {method: 'GET', isArray: true, url: '/api/v1/search/employees/my-coachees/'}
        };

        var EmployeeSearch = $resource('/api/v1/search/employees/', null, actions);
        return EmployeeSearch;
    }])

    .factory('TalentReport', ['$resource', function ($resource) {
        var actions = {
            query: {method: 'GET', isArray: false},
            myTeam: {method: 'GET', isArray: false, url: '/api/v1/reports/talent/my-team/'},
            myCoachees: {method: 'GET', isArray: false, url: '/api/v1/reports/talent/my-coachees/'}
        };
        var TalentReport = $resource('/api/v1/search/reports/talent/', null, actions);
        return TalentReport;
    }])

    .factory('SalaryReport', ['$resource', function ($resource) {
        var actions = {
            query: {method: 'GET', isArray: false},
            myTeam: {method: 'GET', isArray: false, url: '/api/v1/reports/salary/my-team/'},
            myCoachees: {method: 'GET', isArray: false, url: '/api/v1/reports/salary/my-coachees/'}
        };
        var SalaryReport = $resource('/api/v1/search/reports/salary/', null, actions);
        return SalaryReport;
    }])
;