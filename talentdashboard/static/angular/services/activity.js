angular.module('tdb.services.activity', ['ngResource'])

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
        Event.getEmployeeEvents = function(id, page, success, failure) { return this.get({ path: 'employees', id: id, page: page}, success, failure); };
        Event.getTeamEvents = function(id, page, success, failure) { return this.get({ path: 'teams', id: id, page: page }, success, failure); };
        Event.getLeadEvents = function(page, success, failure) { return this.get({ path: 'leads', page: page}, success, failure); };
        Event.getCoachEvents = function(page, success, failure) { return this.get({ path: 'coaches', page: page}, success, failure); };

        return Event;
    }])
;