angular.module('tdb.services.events', ['ngResource'])

    .factory('Events', ['$resource', '$http', function($resource, $http) {
        Events = $resource('/api/v1/events/:path/:id/');
        Events.getEmployeeEvents = function(id, page, success, failure) { return this.get({ path: 'employees', id: id, page: page}, success, failure); };
        Events.getTeamEvents = function(id, page, success, failure) { return this.get({ path: 'teams', id: id, page: page }, success, failure); };
        Events.getLeadEvents = function(page, success, failure) { return this.get({ path: 'leads', page: page}, success, failure); };
        Events.getCoachEvents = function(page, success, failure) { return this.get({ path: 'coaches', page: page}, success, failure); };

        return Events;
    }])