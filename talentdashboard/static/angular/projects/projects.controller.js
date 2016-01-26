angular
    .module('projects')
    .controller('ProjectsController', ProjectsController);

function ProjectsController(ProjectsService, Notification, analytics, $location, $modal, $scope, $sce, $rootScope) {
    /* Since this page can be the root for some users let's make sure we capture the correct page */
    var location_url = $location.url().indexOf('/projects') < 0 ? '/projects' : $location.url();
    analytics.trackPage($scope, $location.absUrl(), location_url);

    var vm = this;
    vm.activeProjects = [];
    vm.activeProjectsLoaded = false;
    vm.showEmptyScreen = false;
    vm.welcome = $sce.trustAsHtml($rootScope.customer.projects_welcome);
    vm.submitProject = submitProject;

    activate();

    function activate() {
        getActiveProjects();
    };

    function getActiveProjects() {
        ProjectsService.getActiveProjects()
            .then(function (data) {
                vm.activeProjects = data;
                vm.activeProjectsLoaded = true;
                checkIsEmpty();
                return vm.activeProjects;
            });
    }

    function checkIsEmpty() {
        if (vm.activeProjectsLoaded) {
            if (vm.activeProjects.length == 0) {
                vm.showEmptyScreen = true;
            } else {
                vm.showEmptyScreen = false;
            }
        }
    }

    function submitProject() {
        var modalInstance = $modal.open({
            animation: true,
            windowClass: 'xx-dialog fade zoom',
            backdrop: 'static',
            templateUrl: '/static/angular/projects/partials/_modals/add-project.html',
            controller: 'AddProjectController as addProject',
            resolve: {
                    project: function () {
                        return null
                    }
            }
        });
        modalInstance.result.then(
            function (project) {
                getActiveProjects();
            }
        );
    }

}
