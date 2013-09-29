angular.module('tdb.services', ['ngResource'])
.factory('Employee', function($resource) {
    return $resource('/api/v1/org/employees/:id/', {}, {
        query: {
            method: 'GET',
            params: {
                id: null,
            },
            isArray: false,
        }
    });
})
.factory('Mentorship', function($resource) {
    return $resource('/api/v1/org/mentorships/:id/', {}, {
        query: {
            method: 'GET',
            params: {
                id: '',
            },
            isArray: false,
        }
    });
})
.factory('Team', function($resource) {
    return $resource('/api/v1/org/teams/:id/', {}, {
        query: {
            method: 'GET',
            params: {
                id: null,
            },
            isArray: false,
        }
    });
})
.factory('CompSummary', function($resource) {
    return $resource('/api/v1/comp/summaries/:id/', {}, {
        query: {
            method: 'GET',
            params: {
                id: null,
            },
            isArray: false,
        }
    });
})
.factory('PvpEvaluation', function($resource) {
    return $resource('/api/v1/pvp/evaluations/:id/', {}, {
        query: {
            method: 'GET',
            params: {
                id: null,
            },
            isArray: false,
        }
    });
})
;
