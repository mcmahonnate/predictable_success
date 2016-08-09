angular
    .module('devzones')
    .factory('DevZoneService', DevZoneService);

function DevZoneService($http, $log, DevZoneResource) {
    return {
        createEmployeeZone: createEmployeeZone,
        getEmployeeZone: getEmployeeZone,
        getMyEmployeeZones: getMyEmployeeZones,
        getUnfinished: getUnfinished,
        getZones: getZones,
        retakeEmployeeZone: retakeEmployeeZone,
        shareEmployeeZone: shareEmployeeZone,
        updateEmployeeZone: updateEmployeeZone
    };

    function createEmployeeZone(devzone) {
        return DevZoneResource.create(devzone, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('saveEmployeeZone failed');
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

    function getMyEmployeeZones() {
        return DevZoneResource.getMyZones({id: 'my'}, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getMyZones failed');
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

    function getZones() {
        return DevZoneResource.getZones(null, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getZones failed');
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

    function shareEmployeeZone(devzone) {
        return DevZoneResource.share({id: devzone.id}, devzone, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('shareEmployeeZone failed');
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

}