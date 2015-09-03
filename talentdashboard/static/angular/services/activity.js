angular.module('tdb.services.activity', ['ngResource'])

    .factory('Events', ['$resource', function($resource) {
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
        Events = $resource('/api/v1/events/:path/:id/', null, actions);
        Events.getEmployeeEvents = function(id, page, success, failure) { return this.get({ path: 'employees', id: id, page: page}, success, failure); };
        Events.getTeamEvents = function(id, page, success, failure) { return this.get({ path: 'teams', id: id, page: page }, success, failure); };
        Events.getLeadEvents = function(page, success, failure) { return this.get({ path: 'leads', page: page}, success, failure); };
        Events.getCoachEvents = function(page, success, failure) { return this.get({ path: 'coaches', page: page}, success, failure); };

        return Events;
    }])
;