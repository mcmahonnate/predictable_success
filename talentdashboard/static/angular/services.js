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

.factory('Leadership', ['$resource', '$http', function($resource, $http) {
    var Leadership = $resource('/api/v1/leaderships/:id/');

    Leadership.getLeadershipsForEmployee = function(id) { return this.query({employee_id: id}); };
    Leadership.getLeadershipsForLeader = function(id) { return this.query({leader_id: id}); };

    return Leadership;
}])

.factory('Attribute', ['$resource', '$http', function($resource, $http) {
    var Attribute = $resource('/api/v1/attributes/');

    Attribute.getAttributtesForEmployee = function(employee_id, category_id) { return this.query({employee_id: employee_id, category_id: category_id}); };

    return Attribute;
}])

.factory('Team', ['$resource', '$http', function($resource, $http) {
    var Team = $resource('/api/v1/teams/:id/');
	
	return Team;
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

.factory('TeamLeads', ['$resource', '$http', function($resource, $http) {
    var TeamLeads = $resource('/api/v1/team-leads/');

    TeamLeads.getCurrentEvaluationsForTeamLeads = function(team_id) {
        return this.query({team_id: team_id});
    };
    return TeamLeads;
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

.factory('TalentCategoryColors', [function() {
    var TalentCategoryColors = {
        colors: ['#008000','#00f500','#91fa00','#ffca00','#ff4600','#ff0000'],
        getColorByTalentCategory: function(category) {
            return this.colors[category - 1];
        }
    };

    return TalentCategoryColors;
}])

.factory('EmployeeToDo', ['$resource', '$http', function($resource, $http) {
    var actions = {
        'addNew': { method:'POST', data:{description:'@description', completed: '@completed', assigned_to_id: '@assigned_to_id', due_date: '@due_date', owner_id: '@owner_id'}, isArray: false },
        'update': { method:'PUT', data:{description:'@description'}, isArray: false },
        'remove': { method:'DELETE' },
    }
    var res = $resource('/api/v1/tasks/employees/:id/', {id:'@id'}, actions);
    return res;
}])

.factory('ToDo', ['$resource', '$http', function($resource, $http) {
    var actions = {
        'update': { method:'PUT', data:{description:'@description', completed: '@completed', assigned_to_id: '@assigned_to_id', due_date: '@due_date'}, isArray: false },
        'remove': { method:'DELETE' },
    }
    var res = $resource('/api/v1/tasks/:id/', {id:'@id'}, actions);
    return res;
}])

.factory('EmployeeComments', ['$resource', '$http', function($resource, $http) {
    var actions = {
        'addNew': { method:'POST' },
    }
    var res = $resource('/api/v1/comments/employees/:id/', {id:'@id'}, actions);
    return res;
}])

.factory('SubComments', ['$resource', '$http', function($resource, $http) {
    var subComments = $resource('/api/v1/comments/subcomments/:id/');

    return subComments;
}])

.factory('Comment', ['$resource', '$http', function($resource, $http) {
    var actions = {                   
        'update': { method:'PUT', data:{content:'@content'}, isArray: false },  
        'remove': { method:'DELETE' },  
    };
    var res = $resource('/api/v1/comments/:id/', {id:'@id'}, actions);
    return res;
}])

.factory('User', ['$resource', '$http', function($resource, $http) {
    var currentUser = $resource('api/v1/user-status/');

    return currentUser;
}]);

angular.module('analytics', ['ng'])

.service('analytics', ['$window', function($window) {
    return {
        trackPage: function (scope, absoluteUrl, locationPath) {

          if (absoluteUrl.indexOf("0.0.0.0") < 0 && absoluteUrl.indexOf("localhost") < 0) {
            scope.$on('$viewContentLoaded', function(event) {
              $window._gaq.push(['_trackPageview', locationPath]);
            });
          } else {
            console.log('not tracked', locationPath);
          }
        }
    };
}]);