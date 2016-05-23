angular.module('tdb.activity.services', ['ngResource'])

    .factory('Event', ['$resource', function($resource) {
        var actions = {
            'getCheckInEvents': {
                method: 'GET',
                isArray: true,
                url: '/api/v1/events/checkins/:id'
            },
            'getEventForComment': {
                method: 'GET',
                url: '/api/v1/events/sources/comments/:id/'
            }
        };
        Event = $resource('/api/v1/events/:path/:id/', null, actions);
        Event.getEmployeeEvents = function(id, page, type, success, failure) { return this.get({ path: 'employees', id: id, page: page, type: type}, success, failure); };
        Event.getTeamEvents = function(id, page, type, success, failure) { return this.get({ path: 'teams', id: id, page: page, type: type }, success, failure); };
        Event.getLeadEvents = function(id, page, type, success, failure) { return this.get({ path: 'leads', id: id, page: page, type: type}, success, failure); };
        Event.getCoachEvents = function(page, type, success, failure) { return this.get({ path: 'coaches', page: page, type: type}, success, failure); };

        return Event;
    }])

    .factory('ActivityReport', ['$resource', '$http', function($resource, $http) {
        var res = $resource('/api/v1/reports/activity');
        return res;
    }])
;