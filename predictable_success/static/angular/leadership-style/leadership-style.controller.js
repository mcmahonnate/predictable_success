angular
    .module('leadership-style')
    .controller('LeadershipStyleController', LeadershipStyleController);

function LeadershipStyleController(LeadershipStyleService, LeadershipStyleRequestService, analytics, $location, $modal, $rootScope, $scope, $timeout) {
    /* Since this page can be the root for some users let's make sure we capture the correct page */
    var location_url = $location.url().indexOf('/id') < 0 ? '/id' : $location.url();
    analytics.trackPage($scope, $location.absUrl(), location_url);

    var vm = this;
    vm.busy = true;
    vm.showEmptyScreen = false;
    vm.myLeadershipStyle = null;
    vm.takeQuiz = takeQuiz;
    vm.requestLeadershipStyle = requestLeadershipStyle;
    $rootScope.successRequestMessage = false;
    $rootScope.hideMessage = false;
    $rootScope.hideRequestMessage = false;
    activate();

    function activate() {
        getMyLeadershipStyle();

    };

    function getMyLeadershipStyle() {
        vm.busy = true;
        LeadershipStyleService.getMyLeadershipStyle()
            .then(function(leadershipStyle){
                vm.myLeadershipStyle = leadershipStyle;
                vm.busy = false;
            }, function(){
                vm.busy = false;
            }
        )
    }

    function takeQuiz() {
        var modalInstance = $modal.open({
            animation: true,
            windowClass: 'xx-dialog fade zoom',
            backdrop: 'static',
            templateUrl: '/static/angular/leadership-style/partials/_modals/quiz.html',
            controller: 'QuizController as quiz',
            resolve: {
                    leadershipStyle: function () {
                        return vm.myLeadershipStyle
                    }
            }
        });
        modalInstance.result.then(
            function (leadershipStyle) {
                vm.myLeadershipStyle = leadershipStyle;
            }
        );
    };

    function getMyRecentlySentRequests() {
        LeadershipStyleService.getMyRecentlySentRequests()
            .then(function (data) {
                vm.myRecentlySentRequests = data;
                return vm.myRecentlySentRequests;
            });
    }


    function requestLeadershipStyle(panel) {
            var modalInstance = $modal.open({
                animation: true,
                windowClass: 'xx-dialog fade zoom',
                backdrop: 'static',
                templateUrl: '/static/angular/leadership-style/partials/_modals/request-leadership-style.html',
                controller: 'LeadershipStyleRequestController as request',
                resolve: {
                    panel: function () {
                        return panel
                    }
                }
            });
            modalInstance.result.then(
                function (sentLeadershipStyleRequests) {
                    getMyRecentlySentRequests();
                }
            );
        }
}
