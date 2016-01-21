angular.module('tdb.search.services', ['ngResource'])

    .factory('EmployeeSearch', ['$resource', function ($resource) {
        var actions = {
            myTeam: {method: 'GET', isArray: true, url: '/api/v1/search/employees/my-team/'},
            leadEmployees: {method: 'GET', isArray: true, url: '/api/v1/search/employees/lead/:id'},
            myCoachees: {method: 'GET', isArray: true, url: '/api/v1/search/employees/my-coachees/'},
            getLeaders: {method: 'GET', isArray: true, url: '/api/v1/search/employees/:id/leaders/'}
        };

        var EmployeeSearch = $resource('/api/v1/search/employees/', null, actions);
        return EmployeeSearch;
    }])

    .factory('TalentReport', ['$resource', function ($resource) {
        var actions = {
            query: {method: 'GET', isArray: false},
            myTeam: {method: 'GET', isArray: false, url: '/api/v1/search/reports/talent/my-team/'},
            leadEmployees: {method: 'GET', isArray: false, url: '/api/v1/search/reports/talent/lead/:id'},
            myCoachees: {method: 'GET', isArray: false, url: '/api/v1/search/reports/talent/my-coachees/'}
        };
        var TalentReport = $resource('/api/v1/search/reports/talent/', null, actions);
        return TalentReport;
    }])

    .factory('SalaryReport', ['$resource', function ($resource) {
        var actions = {
            query: {method: 'GET', isArray: false},
            myTeam: {method: 'GET', isArray: false, url: '/api/v1/search/reports/salary/my-team/'},
            leadEmployees: {method: 'GET', isArray: false, url: '/api/v1/search/reports/salary/lead/:id'},
            myCoachees: {method: 'GET', isArray: false, url: '/api/v1/search/reports/salary/my-coachees/'}
        };
        var SalaryReport = $resource('/api/v1/search/reports/salary/', null, actions);
        return SalaryReport;
    }])
;