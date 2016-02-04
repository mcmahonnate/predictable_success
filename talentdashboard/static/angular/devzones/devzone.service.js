angular
    .module('devzones')
    .factory('DevZoneService', DevZoneService);

function DevZoneService($http, $log, DevZoneResource) {
    return {
        getEmployeeZone: getEmployeeZone,
        saveEmployeeZone: saveEmployeeZone,
        updateEmployeeZone: updateEmployeeZone,
        getUnfinished: getUnfinished,
        getMyEmployeeZones: getMyEmployeeZones,
        getMyConversation: getMyConversation
    };

    function getMyConversation() {
        return DevZoneResource.getMyConversation(null, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getMyConversation failed');
        }
    }

    function getEmployeeZone(employeeZoneId) {
        return DevZoneResource.get({id: employeeZoneId}, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getEmployeeZone failed');
        }
    }

    function saveEmployeeZone(devzone) {
        return DevZoneResource.save(devzone, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('saveEmployeeZone failed');
        }
    }


    function updateEmployeeZone(devzone) {
        return DevZoneResource.update({id: devzone.id}, devzone, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('updateEmployeeZone failed');
        }
    }

    function getUnfinished() {
        return DevZoneResource.getUnfinished(null, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getUnfinished failed');
        }
    }

    function getMyEmployeeZones() {
        return DevZoneResource.getMyZones({id: 'my'}, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getMyZones failed');
        }
    }
}