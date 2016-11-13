angular
    .module('leadership-style')
    .factory('LeadershipStyleService', LeadershipStyleService);

function LeadershipStyleService($http, $log, LeadershipStyleResource) {
    return {
        completeLeadershipStyle: completeLeadershipStyle,
        createLeadershipStyle: createLeadershipStyle,
        getLeadershipStyle: getLeadershipStyle,
        getMyLeadershipStyle: getMyLeadershipStyle,
        getTeases: getTeases,
        getMyUnfinishedLeadershipStyle: getMyUnfinishedLeadershipStyle,
        retakeLeadershipStyle: retakeLeadershipStyle,
        shareLeadershipStyle: shareLeadershipStyle,
        updateLeadershipStyle: updateLeadershipStyle,
        goToPreviousQuestion: goToPreviousQuestion
    };

    function completeLeadershipStyle(leadershipStyle) {
        return LeadershipStyleResource.complete({id: leadershipStyle.id}, null, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('completeLeadershipStyle failed');
        }
    }


    function createLeadershipStyle(request) {
        return LeadershipStyleResource.create({employee: request.requester.id, assessor: request.reviewer.id, request: request.id, assessment_type: 1}, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('createLeadershipStyle failed');
        }
    }

    function getLeadershipStyle(leadershipStyleId) {
        return LeadershipStyleResource.get({id: leadershipStyleId}, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getLeadershipStyle failed');
        }
    }

    function getMyLeadershipStyle() {
        return LeadershipStyleResource.getMy({id: 'my'}, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getMyLeadershipStyle failed');
        }
    }

    function getTeases() {
        return LeadershipStyleResource.getTeases(null, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getTeases failed');
        }
    }

    function getMyUnfinishedLeadershipStyle() {
        return LeadershipStyleResource.getUnfinished(null, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getUnfinished failed');
        }
    }

    function retakeLeadershipStyle(leadershipStyle) {
        return LeadershipStyleResource.retake({id: leadershipStyle.id}, leadershipStyle, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('retakeLeadershipStyle failed');
        }
    }

    function shareLeadershipStyle(leadershipStyle) {
        return LeadershipStyleResource.share({id: leadershipStyle.id}, leadershipStyle, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('shareLeadershipStyle failed');
        }
    }

    function updateLeadershipStyle(leadershipStyle) {
        return LeadershipStyleResource.update({id: leadershipStyle.id}, leadershipStyle, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('updateLeadershipStyle failed');
        }
    }

    function goToPreviousQuestion(leadershipStyle) {
        return LeadershipStyleResource.goToPreviousQuestion({id: leadershipStyle.id}, null, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('goToPreviousQuestion failed');
        }
    }
}