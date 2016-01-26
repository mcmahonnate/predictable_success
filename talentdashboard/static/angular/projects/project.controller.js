angular
    .module('projects')
    .controller('ProjectController', ProjectController);

function ProjectController(ProjectsService, Comment, Notification, analytics, $location, $modal, $scope, $sce, $rootScope, $routeParams) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());

    var vm = this;
    vm.project = null;
    vm.showSummaryEdit = false;
    vm.comments = [];
    vm.addComment = addComment;
    vm.editProject = editProject;

    activate();

    function activate() {
        initializeNewComment();
        getProject();
    };

    function initializeNewComment() {
        vm.newComment = new Comment({content:'', include_in_daily_digest:true});
        vm.newComment.expandTextArea = false;
    };

    function getProject() {
        ProjectsService.getProject($routeParams.projectId)
            .then(function (data) {
                vm.project = data;
                vm.comments = vm.project.comments;
            }, function(error){
                    Notification.error("Sorry we had a problem opening this project.");
            }
        );
    }

    function addComment(form) {
        if (form.$invalid) return;
        Comment.addToProject({ id:$routeParams.projectId}, vm.newComment, function(comment) {
            initializeNewComment();
            vm.comments.push(comment);
        });
    };

    function editProject() {
        var modalInstance = $modal.open({
            animation: true,
            windowClass: 'xx-dialog fade zoom',
            backdrop: 'static',
            templateUrl: '/static/angular/projects/partials/_modals/add-project.html',
            controller: 'AddProjectController as addProject',
            resolve: {
                    project: function () {
                        return vm.project
                    }
            }
        });
        modalInstance.result.then(
            function (project) {
                getProject();
            }
        );
    }
}
