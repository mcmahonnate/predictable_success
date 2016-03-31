angular
    .module('qualities')
    .factory('PerceivedQualityService', PerceivedQualityService);

function PerceivedQualityService($http, $log, PerceivedQualityResource, Employee) {
    return {
        createPerceivedQualities: createPerceivedQualities,
        getEmployees: getEmployees,
        getMyQualities: getMyQualities
    };

    function createPerceivedQualities(qualities, subject, cluster) {
        var requests = [];

        for (var i = 0; i < qualities.length; i++) {
            requests.push({quality: qualities[i].id, subject: subject.id, cluster: cluster.id});
        }
        console.log(requests);
        return PerceivedQualityResource.createPerceivedQualities(requests, success, fail).$promise;

        function success(sentFeedbackRequests) {
            return sentFeedbackRequests;
        }

        function fail(response) {
            $log.error('createPerceivedQualities failed');
        }
    }

    function getEmployees() {
        return Employee.query({show_hidden: true}, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getEmployees failed');
        }
    }

    function getMyQualities() {
        return PerceivedQualityResource.get({id: 'my'}, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getMyQualities failed');
        }
    }
}