angular
    .module('leadership-style')
    .factory('LeadershipStyleService', LeadershipStyleService);

function LeadershipStyleService($http, $log, LeadershipStyleResource) {
    return {
        createLeadershipStyle: createLeadershipStyle,
        getLeadershipStyle: getLeadershipStyle,
        getMyLeadershipStyle: getMyLeadershipStyle,
        getMyUnfinishedLeadershipStyle: getMyUnfinishedLeadershipStyle,
        retakeLeadershipStyle: retakeLeadershipStyle,
        shareLeadershipStyle: shareLeadershipStyle,
        updateLeadershipStyle: updateLeadershipStyle
    };

    function createLeadershipStyle(leadershipStyle) {
        return LeadershipStyleResource.create(leadershipStyle, success, fail).$promise;

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
}