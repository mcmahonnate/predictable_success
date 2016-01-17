angular
    .module('projects')
    .controller('ProjectController', ProjectController);

function ProjectController(ProjectsService, Notification, analytics, $location, $modal, $scope, $sce, $rootScope, $routeParams) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());

    var vm = this;
    vm.project = null;
    vm.showSummaryEdit = false;
    vm.comments = [];

    activate();

    function activate() {
        getProject();
    };

    function getProject() {
        ProjectsService.getProject($routeParams.projectId)
            .then(function (data) {
                vm.project = data;
                vm.comments = vm.project.comments;
            }, function(error){
                    Notification.success("Sorry we had a problem opening this project.");
            }
        );
    }
}
