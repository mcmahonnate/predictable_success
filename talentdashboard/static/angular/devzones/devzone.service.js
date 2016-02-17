angular
    .module('devzones')
    .factory('DevZoneService', DevZoneService);

function DevZoneService($http, $log, DevZoneResource) {
    return {
        getEmployeeZone: getEmployeeZone,
        saveEmployeeZone: saveEmployeeZone,
        updateEmployeeZone: updateEmployeeZone,
        retakeEmployeeZone: retakeEmployeeZone,
        getUnfinished: getUnfinished,
        getMyEmployeeZones: getMyEmployeeZones,
        getMyConversation: getMyConversation,
        getMyTeamLeadConversations: getMyTeamLeadConversations,
        getZones: getZones
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

    function getMyTeamLeadConversations() {
        return DevZoneResource.getMyTeamLeadConversations(null, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getMyTeamLeadConversations failed');
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

    function retakeEmployeeZone(devzone) {
        return DevZoneResource.retake({id: devzone.id}, devzone, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('retakeEmployeeZone failed');
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

    function getZones() {
        return DevZoneResource.getZones(null, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getZones failed');
        }
    }
}