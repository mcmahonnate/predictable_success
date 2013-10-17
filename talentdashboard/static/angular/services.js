angular.module('tdb.services', ['ngResource'])

.factory('Employee', ['$resource', '$http', function($resource, $http) {
    var Employee = $resource('/api/v1/employees/:id/');

    return Employee;
}])

.factory('Mentorship', ['$resource', '$http', function($resource, $http) {
    var Mentorship = $resource('/api/v1/mentorships/:id/');

    Mentorship.getMentorshipsForMentee = function(id) { return this.query({mentee_id: id}); };

    return Mentorship;
}])

.factory('Team', ['$resource', '$http', function($resource, $http) {
    var Team = $resource('/api/v1/teams/:id/');
}])

.factory('CompSummary', ['$resource', '$http', function($resource, $http) {
    var CompSummary = $resource('/api/v1/compensation-summaries/');

    CompSummary.getAllSummariesForEmployee = function(id) { return this.query({employee_id: id}); };

    return CompSummary;
}])

.factory('PvpEvaluation', ['$resource', '$http', function($resource, $http) {
    var PvpEvaluation = $resource('/api/v1/pvp-evaluations/');

    PvpEvaluation.getAllEvaluationsForEmployee = function(id) {
        return this.query({ employee_id: id });
    };

    PvpEvaluation.getCurrentEvaluationsForTalentCategory = function(talent_category, team_id) {
        var params = { talent_category: talent_category, current_round: true };
        if(team_id) {
            params['team_id'] = team_id;
        }
        return this.query(params);
    };
    return PvpEvaluation;
}])

.factory('TalentCategoryReport', ['$resource', '$http', function($resource, $http) {
    TalentCategoryReport = $resource('/api/v1/talent-category-reports/:id/:teamId');

    TalentCategoryReport.getReportForTeam = function(teamId, success, failure) { return this.get({ id: 'teams', teamId: teamId }, success, failure); };
    TalentCategoryReport.getReportForCompany = function(success, failure) { return this.get({ id: 'all-employees' }, success, failure); };

    return TalentCategoryReport;
}])

.factory('SalaryReport', ['$resource', '$http', function($resource, $http) {
    SalaryReport = $resource('/api/v1/salary-reports/:id/:teamId');

    SalaryReport.getReportForTeam = function(teamId, success, failure) { return this.get({ id: 'teams', teamId: teamId }, success, failure); };
    SalaryReport.getReportForCompany = function(success, failure) { return this.get({ id: 'company' }, success, failure); };

    return SalaryReport;
}])

.factory('EmployeeComments', ['$resource', '$http', function($resource, $http) {
    var actions = {                   
        'addNew': { method:'POST' },  
    }
    var res = $resource('/api/v1/comments/employees/:id/', {}, actions)
    return res;
}])

.factory('Comment', ['$resource', '$http', function($resource, $http) {
    var actions = {                   
        'update': { method:'PUT' },  
        'remove': { method:'DELETE' },  
    }
    var res = $resource('/api/v1/comments/:id/', {}, actions)
    return res;
}]);

