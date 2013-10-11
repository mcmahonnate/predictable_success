var tastypieHelpers = {
    getArray: function ($http) {
        return $http.defaults.transformResponse.concat([
            function (data, headersGetter) {
                if(data.meta) {
                    var result = data.objects;
                    result.meta = data.meta;
                    return result;
                }
                return data;
            }
        ]);
    },
    getOne: function ($http) {
        return $http.defaults.transformResponse.concat([
            function (data, headersGetter) {
                var result = data.objects;
                return result.length == 1 ? result[0] : null;
            }
        ]);
    }
};

var services = angular.module('tdb.services', ['ngResource']);

services.factory('Employee', ['$resource', '$http', function($resource, $http) {
    var Employee = $resource('/api/v1/employees/:id/', {}, {
        query: {
            method: 'GET',
            isArray: true,
        }
    });

    return Employee;
}]);

services.factory('Mentorship', ['$resource', '$http', function($resource, $http) {
    var Mentorship = $resource('/api/v1/mentorships/:id/', {}, {
        _getMentorshipsForMentee: {
            method: 'GET',
            isArray: true,
        },
    });

    Mentorship.getMentorshipsForMentee = function(id) { return this._getMentorshipsForMentee({mentee_id: id}); };

    return Mentorship;
}]);

services.factory('Team', ['$resource', '$http', function($resource, $http) {
    var Team = $resource('/api/v1/teams/:id/', {} );
}]);

services.factory('CompSummary', ['$resource', '$http', function($resource, $http) {
    var CompSummary = $resource(
        '/api/v1/compensation-summaries/', {},
        {
            _getAllSummariesForEmployee: {
                method: 'GET',
                isArray: true,
            },
            _getMostRecentSummaryForEmployee: {
                method: 'GET',
                isArray: false,
                params: { most_recent: 1 },
            }
        }
    );

    CompSummary.getMostRecentSummaryForEmployee = function(id) { return this._getMostRecentSummaryForEmployee({employee_id: id}); };
    CompSummary.getAllSummariesForEmployee = function(id) { return this._getAllSummariesForEmployee({employee_id: id}); };

    return CompSummary;
}]);

services.factory('PvpEvaluation', ['$resource', '$http', function($resource, $http) {
    var PvpEvaluation = $resource('/api/v1/pvp-evaluations/', {}, {
    });

    PvpEvaluation.getAllEvaluationsForEmployee = function(id) {
        return this.query({ employee_id: id });
    };
    PvpEvaluation.getCurrentEvaluationsForTalentCategory = function(talent_category) {
        return this.query({ talent_category: talent_category, current_round: true });
    };
    PvpEvaluation.getCurrentEvaluationsForTalentCategoryAndTeam = function(talent_category, team_id) {
        return this.query({ talent_category: talent_category, team_id: team_id, current_round: true });
    };

    return PvpEvaluation;
}]);

services.factory('TalentCategoryReport', ['$resource', '$http', function($resource, $http) {
    TalentCategoryReport = $resource('/api/v1/talent-category-reports/:id/:teamId', {}, {
        get: {
            method: 'GET',
            isArray: false,
        }
    });

    TalentCategoryReport.getReportForEntireCompany = function(success, failure) { return this.get({ id: 'all-employees' }, success, failure); };
    TalentCategoryReport.getReportForTeam = function(teamId, success, failure) { return this.get({ id: 'teams', teamId: teamId }, success, failure); };

    return TalentCategoryReport;
}]);

services.factory('TeamTalentCategoryReport', ['$resource', '$http', function($resource, $http) {
    TalentCategoryReport = $resource('/api/v1/talent-category-reports/teams/:id', {}, {
        get: {
            method: 'GET',
            isArray: false,
        }
    });

    return TalentCategoryReport;
}]);

