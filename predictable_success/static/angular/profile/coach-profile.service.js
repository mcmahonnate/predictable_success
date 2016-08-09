angular
    .module('profile')
    .factory('CoachProfileService', CoachProfileService);

function CoachProfileService($http, $log, CoachProfileResource) {
    return {
        create: create,
        get: get,
        update: update,
    };

    function create(profile) {
        return CoachProfileResource.create(null, profile, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('created Coach Profile failed');
        }
    }

    function get(id) {
        return CoachProfileResource.get({id: id}, null, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('get Coach Profile failed');
        }
    }

    function update(profile) {
        return CoachProfileResource.update({id: profile.id}, profile, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('update Coach Profile failed');
        }
    }
}