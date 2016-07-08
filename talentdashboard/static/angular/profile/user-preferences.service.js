angular
    .module('profile')
    .factory('UserPreferencesService', UserPreferencesService);

function UserPreferencesService($http) {
    return {
        showCheckinIntroPop: showCheckinIntroPop,
        showDevzoneIntroPop: showDevzoneIntroPop,
        showFeedbackIntroPop: showFeedbackIntroPop,
        showStrengthsIntroPop: showStrengthsIntroPop,
    };

    function showCheckinIntroPop(show) {
        return $http.put('/api/v1/org/user/preferences/', {show_checkin_intro_pop: show})
            .then(complete)
            .catch(failed);

        function complete(response) {
            return response.data;
        }

        function failed(response) {
        }
    }

    function showDevzoneIntroPop(show) {
        return $http.put('/api/v1/org/user/preferences/', {show_devzone_intro_pop: show})
            .then(complete)
            .catch(failed);

        function complete(response) {
            return response.data;
        }

        function failed(response) {
        }
    }

    function showFeedbackIntroPop(show) {
        return $http.put('/api/v1/org/user/preferences/', {show_feedback_intro_pop: show})
            .then(complete)
            .catch(failed);

        function complete(response) {
            return response.data;
        }

        function failed(response) {
        }
    }

    function showStrengthsIntroPop(show) {
        return $http.put('/api/v1/org/user/preferences/', {show_strengths_intro_pop: show})
            .then(complete)
            .catch(failed);

        function complete(response) {
            return response.data;
        }

        function failed(response) {
        }
    }
}