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
    var Mentorship = $resource('/api/v1/org/mentorships/:id/', {}, {
        _getMentorshipsForMentee: {
            method: 'GET',
            isArray: true,
            transformResponse: tastypieHelpers.getArray($http),
        },
    });

    Mentorship.getMentorshipsForMentee = function(id) { return this._getMentorshipsForMentee({mentee__id: id}); };

    return Mentorship;
}]);

services.factory('Team', ['$resource', '$http', function($resource, $http) {
    var Team = $resource('/api/v1/org/teams/:id/', {}, {
        query: {
            transformResponse: tastypieHelpers.getArray($http),
        }
    });
}]);

services.factory('CompSummary', ['$resource', '$http', function($resource, $http) {
    var CompSummary = $resource(
        '/api/v1/comp/summaries/:id/',
        {
            order_by: 'year',
        },
        {
            query: {
                transformResponse: tastypieHelpers.getArray($http),
                params: {
                    order_by: '-year',
                }
            },
            _getAllSummariesForEmployee: {
                method: 'GET',
                isArray: true,
                transformResponse: tastypieHelpers.getArray($http),
            },
            _getMostRecentSummaryForEmployee: {
                method: 'GET',
                isArray: false,
                params: { limit: 1 },
                transformResponse: tastypieHelpers.getOne($http),
            }
        }
    );

    CompSummary.getMostRecentSummaryForEmployee = function(id) { return this._getMostRecentSummaryForEmployee({employee__id: id}); };
    CompSummary.getAllSummariesForEmployee = function(id) { return this._getAllSummariesForEmployee({employee__id: id}); };

    return CompSummary;
}]);

services.factory('PvpEvaluation', ['$resource', '$http', function($resource, $http) {
    var PvpEvaluation = $resource('/api/v1/pvp/evaluations/:id/', {}, {
        query: {
            transformResponse: tastypieHelpers.getArray($http),
            order_by: '-evaluation_round__date',
            isArray: true,
        },
        _getAllEvaluationsForEmployee: {
            method: 'GET',
            isArray: true,
            transformResponse: tastypieHelpers.getArray($http),
        },
        _getCurrentEvaluationsForTalentCategory: {
            method: 'GET',
            isArray: true,
        }
    });

    PvpEvaluation.getAllEvaluationsForEmployee = function(id) { return this._getAllEvaluationsForEmployee({ employee__id: id }); };
    PvpEvaluation.getCurrentEvaluationsForTalentCategory = function(talent_category) { return this._getAllEvaluationsForEmployee({ id: 'current', talent_category: talent_category }); };

    return PvpEvaluation;
}]);

services.factory('TalentCategoryReport', ['$resource', '$http', function($resource, $http) {
    TalentCategoryReport = $resource('/api/v1/pvp/talent-category-reports/all-employees/', {}, {
        get: {
            method: 'GET',
            isArray: false,
        }
    });

    return TalentCategoryReport;
}]);
