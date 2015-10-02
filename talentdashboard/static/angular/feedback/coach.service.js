(function() {
angular
    .module('feedback')
    .factory('CoachService', CoachService);

CoachService.$inject = ['$http'];

function CoachService($http) {
    return {
        getAvailableCoaches: getAvailableCoaches,
        changeCoach: changeCoach
    };

    function getAvailableCoaches() {
        // get coaches
    }

    function changeCoach(newCoach) {
        // set new coach
    }
}
})();