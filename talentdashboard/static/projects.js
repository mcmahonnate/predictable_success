;(function() {
"use strict";

angular
    .module('projects', ['ngRoute', 'ui-notification']);

angular
    .module('projects')
    .factory('ProjectsService', ProjectsService);

function ProjectsService($http, $log, ProjectsResource) {
    return {
        getProject: getProject,
        getActiveProjects: getActiveProjects,
        save: save,
        update: update
    };

    function getProject(projectId) {
        return ProjectsResource.get({id: projectId}, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getProject failed');
        }
    }

    function getActiveProjects() {
        return ProjectsResource.getActiveProjects(null, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getProject failed');
        }
    }

    function save(project) {
        return ProjectsResource.save(project, success, fail).$promise;

        function success(response) {
            return response.data;
        }

        function fail(response) {
            $log.error('save failed');
        }
    }

    function update(project) {
        return ProjectsResource.update({id: project.id}, project, success, fail).$promise;

        function success(response) {
            return response.data;
        }

        function fail(response) {
            $log.error('update failed');
        }
    }
}
ProjectsService.$inject = ["$http", "$log", "ProjectsResource"];
angular
    .module('projects')
    .factory('ProjectsResource', ProjectsResource);

function ProjectsResource($resource) {
    var actions = {
        'get': {
            method: 'GET'
        },
        'getProjectsByOwner': {
            method: 'GET',
            url: '/api/v1/projects/owned/:id/',
            isArray: true
        },
        'getProjectsIOwn': {
            method: 'GET',
            url: '/api/v1/projects/owned/my/',
            isArray: true
        },
        'getProjectsBySponsor': {
            method: 'GET',
            url: '/api/v1/projects/sponsored/:id/',
            isArray: true
        },
        'getProjectsISponsor': {
            method: 'GET',
            url: '/api/v1/projects/sponsored/my/',
            isArray: true
        },
        'getProjectsByTeamMember': {
            method: 'GET',
            url: '/api/v1/projects/team-member/:id/',
            isArray: true
        },
        'getProjectsIAmATeamMember': {
            method: 'GET',
            url: '/api/v1/projects/team-member/my/',
            isArray: true
        },
        'getActiveProjects': {
            method: 'GET',
            isArray: true
        },
        'save': {
            method: 'POST'
        },
        'update': {
            method: 'PUT'
        },
        'delete': {
            'method': 'DELETE'
        }
    };
    return $resource('/api/v1/projects/:id/', null, actions);
}
ProjectsResource.$inject = ["$resource"];

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
            templateUrl: '/static/angular/checkins/partials/_modals/request-checkin.html',
            controller: 'RequestCheckInController as request',
            resolve: {

            }
        });
        modalInstance.result.then(
            function (sentFeedbackRequests) {
                getMyCheckInRequests();
            }
        );
    }

}
ProjectsController.$inject = ["ProjectsService", "Notification", "analytics", "$location", "$modal", "$scope", "$sce", "$rootScope"];

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
                    Notification.success("Sorry we had a problem opening this project.");
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
}
ProjectController.$inject = ["ProjectsService", "Comment", "Notification", "analytics", "$location", "$modal", "$scope", "$sce", "$rootScope", "$routeParams"];
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2plY3RzLm1vZHVsZS5qcyIsInByb2plY3RzLnNlcnZpY2UuanMiLCJwcm9qZWN0cy5yZXNvdXJjZS5qcyIsInByb2plY3RzLmNvbnRyb2xsZXIuanMiLCJwcm9qZWN0LmNvbnRyb2xsZXIuanMiLCJwcm9qZWN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFBLENBQUEsV0FBQTtBQUNBOztBQ0RBO0tBQ0EsT0FBQSxZQUFBLENBQUEsV0FBQTs7QUFFQTtLQUNBLE9BQUE7S0FDQSxRQUFBLG1CQUFBOztBQUVBLFNBQUEsZ0JBQUEsT0FBQSxNQUFBLGtCQUFBO0lBQ0EsT0FBQTtRQUNBLFlBQUE7UUFDQSxtQkFBQTtRQUNBLE1BQUE7UUFDQSxRQUFBOzs7SUFHQSxTQUFBLFdBQUEsV0FBQTtRQUNBLE9BQUEsaUJBQUEsSUFBQSxDQUFBLElBQUEsWUFBQSxTQUFBLE1BQUE7O1FBRUEsU0FBQSxRQUFBLFVBQUE7WUFDQSxPQUFBOzs7UUFHQSxTQUFBLEtBQUEsVUFBQTtZQUNBLEtBQUEsTUFBQTs7OztJQUlBLFNBQUEsb0JBQUE7UUFDQSxPQUFBLGlCQUFBLGtCQUFBLE1BQUEsU0FBQSxNQUFBOztRQUVBLFNBQUEsUUFBQSxVQUFBO1lBQ0EsT0FBQTs7O1FBR0EsU0FBQSxLQUFBLFVBQUE7WUFDQSxLQUFBLE1BQUE7Ozs7SUFJQSxTQUFBLEtBQUEsU0FBQTtRQUNBLE9BQUEsaUJBQUEsS0FBQSxTQUFBLFNBQUEsTUFBQTs7UUFFQSxTQUFBLFFBQUEsVUFBQTtZQUNBLE9BQUEsU0FBQTs7O1FBR0EsU0FBQSxLQUFBLFVBQUE7WUFDQSxLQUFBLE1BQUE7Ozs7SUFJQSxTQUFBLE9BQUEsU0FBQTtRQUNBLE9BQUEsaUJBQUEsT0FBQSxDQUFBLElBQUEsUUFBQSxLQUFBLFNBQUEsU0FBQSxNQUFBOztRQUVBLFNBQUEsUUFBQSxVQUFBO1lBQ0EsT0FBQSxTQUFBOzs7UUFHQSxTQUFBLEtBQUEsVUFBQTtZQUNBLEtBQUEsTUFBQTs7Ozs7QUN4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bGFyXG4gICAgLm1vZHVsZSgncHJvamVjdHMnLCBbJ25nUm91dGUnLCAndWktbm90aWZpY2F0aW9uJ10pO1xuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ3Byb2plY3RzJylcbiAgICAuZmFjdG9yeSgnUHJvamVjdHNTZXJ2aWNlJywgUHJvamVjdHNTZXJ2aWNlKTtcblxuZnVuY3Rpb24gUHJvamVjdHNTZXJ2aWNlKCRodHRwLCAkbG9nLCBQcm9qZWN0c1Jlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0UHJvamVjdDogZ2V0UHJvamVjdCxcbiAgICAgICAgZ2V0QWN0aXZlUHJvamVjdHM6IGdldEFjdGl2ZVByb2plY3RzLFxuICAgICAgICBzYXZlOiBzYXZlLFxuICAgICAgICB1cGRhdGU6IHVwZGF0ZVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRQcm9qZWN0KHByb2plY3RJZCkge1xuICAgICAgICByZXR1cm4gUHJvamVjdHNSZXNvdXJjZS5nZXQoe2lkOiBwcm9qZWN0SWR9LCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdnZXRQcm9qZWN0IGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QWN0aXZlUHJvamVjdHMoKSB7XG4gICAgICAgIHJldHVybiBQcm9qZWN0c1Jlc291cmNlLmdldEFjdGl2ZVByb2plY3RzKG51bGwsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ2dldFByb2plY3QgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzYXZlKHByb2plY3QpIHtcbiAgICAgICAgcmV0dXJuIFByb2plY3RzUmVzb3VyY2Uuc2F2ZShwcm9qZWN0LCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ3NhdmUgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGUocHJvamVjdCkge1xuICAgICAgICByZXR1cm4gUHJvamVjdHNSZXNvdXJjZS51cGRhdGUoe2lkOiBwcm9qZWN0LmlkfSwgcHJvamVjdCwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCd1cGRhdGUgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ3Byb2plY3RzJylcbiAgICAuZmFjdG9yeSgnUHJvamVjdHNSZXNvdXJjZScsIFByb2plY3RzUmVzb3VyY2UpO1xuXG5mdW5jdGlvbiBQcm9qZWN0c1Jlc291cmNlKCRyZXNvdXJjZSkge1xuICAgIHZhciBhY3Rpb25zID0ge1xuICAgICAgICAnZ2V0Jzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJ1xuICAgICAgICB9LFxuICAgICAgICAnZ2V0UHJvamVjdHNCeU93bmVyJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvcHJvamVjdHMvb3duZWQvOmlkLycsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRQcm9qZWN0c0lPd24nOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9wcm9qZWN0cy9vd25lZC9teS8nLFxuICAgICAgICAgICAgaXNBcnJheTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICAnZ2V0UHJvamVjdHNCeVNwb25zb3InOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9wcm9qZWN0cy9zcG9uc29yZWQvOmlkLycsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRQcm9qZWN0c0lTcG9uc29yJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvcHJvamVjdHMvc3BvbnNvcmVkL215LycsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRQcm9qZWN0c0J5VGVhbU1lbWJlcic6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3Byb2plY3RzL3RlYW0tbWVtYmVyLzppZC8nLFxuICAgICAgICAgICAgaXNBcnJheTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICAnZ2V0UHJvamVjdHNJQW1BVGVhbU1lbWJlcic6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3Byb2plY3RzL3RlYW0tbWVtYmVyL215LycsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRBY3RpdmVQcm9qZWN0cyc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdzYXZlJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCdcbiAgICAgICAgfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BVVCdcbiAgICAgICAgfSxcbiAgICAgICAgJ2RlbGV0ZSc6IHtcbiAgICAgICAgICAgICdtZXRob2QnOiAnREVMRVRFJ1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gJHJlc291cmNlKCcvYXBpL3YxL3Byb2plY3RzLzppZC8nLCBudWxsLCBhY3Rpb25zKTtcbn1cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9qZWN0cycpXG4gICAgLmNvbnRyb2xsZXIoJ1Byb2plY3RzQ29udHJvbGxlcicsIFByb2plY3RzQ29udHJvbGxlcik7XG5cbmZ1bmN0aW9uIFByb2plY3RzQ29udHJvbGxlcihQcm9qZWN0c1NlcnZpY2UsIE5vdGlmaWNhdGlvbiwgYW5hbHl0aWNzLCAkbG9jYXRpb24sICRtb2RhbCwgJHNjb3BlLCAkc2NlLCAkcm9vdFNjb3BlKSB7XG4gICAgLyogU2luY2UgdGhpcyBwYWdlIGNhbiBiZSB0aGUgcm9vdCBmb3Igc29tZSB1c2VycyBsZXQncyBtYWtlIHN1cmUgd2UgY2FwdHVyZSB0aGUgY29ycmVjdCBwYWdlICovXG4gICAgdmFyIGxvY2F0aW9uX3VybCA9ICRsb2NhdGlvbi51cmwoKS5pbmRleE9mKCcvcHJvamVjdHMnKSA8IDAgPyAnL3Byb2plY3RzJyA6ICRsb2NhdGlvbi51cmwoKTtcbiAgICBhbmFseXRpY3MudHJhY2tQYWdlKCRzY29wZSwgJGxvY2F0aW9uLmFic1VybCgpLCBsb2NhdGlvbl91cmwpO1xuXG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5hY3RpdmVQcm9qZWN0cyA9IFtdO1xuICAgIHZtLmFjdGl2ZVByb2plY3RzTG9hZGVkID0gZmFsc2U7XG4gICAgdm0uc2hvd0VtcHR5U2NyZWVuID0gZmFsc2U7XG4gICAgdm0ud2VsY29tZSA9ICRzY2UudHJ1c3RBc0h0bWwoJHJvb3RTY29wZS5jdXN0b21lci5wcm9qZWN0c193ZWxjb21lKTtcbiAgICB2bS5zdWJtaXRQcm9qZWN0ID0gc3VibWl0UHJvamVjdDtcblxuICAgIGFjdGl2YXRlKCk7XG5cbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgZ2V0QWN0aXZlUHJvamVjdHMoKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0QWN0aXZlUHJvamVjdHMoKSB7XG4gICAgICAgIFByb2plY3RzU2VydmljZS5nZXRBY3RpdmVQcm9qZWN0cygpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHZtLmFjdGl2ZVByb2plY3RzID0gZGF0YTtcbiAgICAgICAgICAgICAgICB2bS5hY3RpdmVQcm9qZWN0c0xvYWRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgY2hlY2tJc0VtcHR5KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZtLmFjdGl2ZVByb2plY3RzO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hlY2tJc0VtcHR5KCkge1xuICAgICAgICBpZiAodm0uYWN0aXZlUHJvamVjdHNMb2FkZWQpIHtcbiAgICAgICAgICAgIGlmICh2bS5hY3RpdmVQcm9qZWN0cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgIHZtLnNob3dFbXB0eVNjcmVlbiA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZtLnNob3dFbXB0eVNjcmVlbiA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3VibWl0UHJvamVjdCgpIHtcbiAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG4gICAgICAgICAgICBhbmltYXRpb246IHRydWUsXG4gICAgICAgICAgICB3aW5kb3dDbGFzczogJ3h4LWRpYWxvZyBmYWRlIHpvb20nLFxuICAgICAgICAgICAgYmFja2Ryb3A6ICdzdGF0aWMnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvc3RhdGljL2FuZ3VsYXIvY2hlY2tpbnMvcGFydGlhbHMvX21vZGFscy9yZXF1ZXN0LWNoZWNraW4uaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnUmVxdWVzdENoZWNrSW5Db250cm9sbGVyIGFzIHJlcXVlc3QnLFxuICAgICAgICAgICAgcmVzb2x2ZToge1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKFxuICAgICAgICAgICAgZnVuY3Rpb24gKHNlbnRGZWVkYmFja1JlcXVlc3RzKSB7XG4gICAgICAgICAgICAgICAgZ2V0TXlDaGVja0luUmVxdWVzdHMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbn1cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9qZWN0cycpXG4gICAgLmNvbnRyb2xsZXIoJ1Byb2plY3RDb250cm9sbGVyJywgUHJvamVjdENvbnRyb2xsZXIpO1xuXG5mdW5jdGlvbiBQcm9qZWN0Q29udHJvbGxlcihQcm9qZWN0c1NlcnZpY2UsIENvbW1lbnQsIE5vdGlmaWNhdGlvbiwgYW5hbHl0aWNzLCAkbG9jYXRpb24sICRtb2RhbCwgJHNjb3BlLCAkc2NlLCAkcm9vdFNjb3BlLCAkcm91dGVQYXJhbXMpIHtcbiAgICBhbmFseXRpY3MudHJhY2tQYWdlKCRzY29wZSwgJGxvY2F0aW9uLmFic1VybCgpLCAkbG9jYXRpb24udXJsKCkpO1xuXG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5wcm9qZWN0ID0gbnVsbDtcbiAgICB2bS5zaG93U3VtbWFyeUVkaXQgPSBmYWxzZTtcbiAgICB2bS5jb21tZW50cyA9IFtdO1xuICAgIHZtLmFkZENvbW1lbnQgPSBhZGRDb21tZW50O1xuXG4gICAgYWN0aXZhdGUoKTtcblxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICBpbml0aWFsaXplTmV3Q29tbWVudCgpO1xuICAgICAgICBnZXRQcm9qZWN0KCk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGluaXRpYWxpemVOZXdDb21tZW50KCkge1xuICAgICAgICB2bS5uZXdDb21tZW50ID0gbmV3IENvbW1lbnQoe2NvbnRlbnQ6JycsIGluY2x1ZGVfaW5fZGFpbHlfZGlnZXN0OnRydWV9KTtcbiAgICAgICAgdm0ubmV3Q29tbWVudC5leHBhbmRUZXh0QXJlYSA9IGZhbHNlO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRQcm9qZWN0KCkge1xuICAgICAgICBQcm9qZWN0c1NlcnZpY2UuZ2V0UHJvamVjdCgkcm91dGVQYXJhbXMucHJvamVjdElkKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2bS5wcm9qZWN0ID0gZGF0YTtcbiAgICAgICAgICAgICAgICB2bS5jb21tZW50cyA9IHZtLnByb2plY3QuY29tbWVudHM7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICAgICAgICAgIE5vdGlmaWNhdGlvbi5zdWNjZXNzKFwiU29ycnkgd2UgaGFkIGEgcHJvYmxlbSBvcGVuaW5nIHRoaXMgcHJvamVjdC5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkQ29tbWVudChmb3JtKSB7XG4gICAgICAgIGlmIChmb3JtLiRpbnZhbGlkKSByZXR1cm47XG4gICAgICAgIENvbW1lbnQuYWRkVG9Qcm9qZWN0KHsgaWQ6JHJvdXRlUGFyYW1zLnByb2plY3RJZH0sIHZtLm5ld0NvbW1lbnQsIGZ1bmN0aW9uKGNvbW1lbnQpIHtcbiAgICAgICAgICAgIGluaXRpYWxpemVOZXdDb21tZW50KCk7XG4gICAgICAgICAgICB2bS5jb21tZW50cy5wdXNoKGNvbW1lbnQpO1xuICAgICAgICB9KTtcbiAgICB9O1xufVxuIiwiOyhmdW5jdGlvbigpIHtcblwidXNlIHN0cmljdFwiO1xuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgncHJvamVjdHMnLCBbJ25nUm91dGUnLCAndWktbm90aWZpY2F0aW9uJ10pO1xuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgncHJvamVjdHMnKVxuICAgIC5mYWN0b3J5KCdQcm9qZWN0c1NlcnZpY2UnLCBQcm9qZWN0c1NlcnZpY2UpO1xuXG5mdW5jdGlvbiBQcm9qZWN0c1NlcnZpY2UoJGh0dHAsICRsb2csIFByb2plY3RzUmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRQcm9qZWN0OiBnZXRQcm9qZWN0LFxuICAgICAgICBnZXRBY3RpdmVQcm9qZWN0czogZ2V0QWN0aXZlUHJvamVjdHMsXG4gICAgICAgIHNhdmU6IHNhdmUsXG4gICAgICAgIHVwZGF0ZTogdXBkYXRlXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldFByb2plY3QocHJvamVjdElkKSB7XG4gICAgICAgIHJldHVybiBQcm9qZWN0c1Jlc291cmNlLmdldCh7aWQ6IHByb2plY3RJZH0sIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ2dldFByb2plY3QgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRBY3RpdmVQcm9qZWN0cygpIHtcbiAgICAgICAgcmV0dXJuIFByb2plY3RzUmVzb3VyY2UuZ2V0QWN0aXZlUHJvamVjdHMobnVsbCwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignZ2V0UHJvamVjdCBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNhdmUocHJvamVjdCkge1xuICAgICAgICByZXR1cm4gUHJvamVjdHNSZXNvdXJjZS5zYXZlKHByb2plY3QsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignc2F2ZSBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZShwcm9qZWN0KSB7XG4gICAgICAgIHJldHVybiBQcm9qZWN0c1Jlc291cmNlLnVwZGF0ZSh7aWQ6IHByb2plY3QuaWR9LCBwcm9qZWN0LCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ3VwZGF0ZSBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9qZWN0cycpXG4gICAgLmZhY3RvcnkoJ1Byb2plY3RzUmVzb3VyY2UnLCBQcm9qZWN0c1Jlc291cmNlKTtcblxuZnVuY3Rpb24gUHJvamVjdHNSZXNvdXJjZSgkcmVzb3VyY2UpIHtcbiAgICB2YXIgYWN0aW9ucyA9IHtcbiAgICAgICAgJ2dldCc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCdcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldFByb2plY3RzQnlPd25lcic6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3Byb2plY3RzL293bmVkLzppZC8nLFxuICAgICAgICAgICAgaXNBcnJheTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICAnZ2V0UHJvamVjdHNJT3duJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvcHJvamVjdHMvb3duZWQvbXkvJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldFByb2plY3RzQnlTcG9uc29yJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvcHJvamVjdHMvc3BvbnNvcmVkLzppZC8nLFxuICAgICAgICAgICAgaXNBcnJheTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICAnZ2V0UHJvamVjdHNJU3BvbnNvcic6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3Byb2plY3RzL3Nwb25zb3JlZC9teS8nLFxuICAgICAgICAgICAgaXNBcnJheTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICAnZ2V0UHJvamVjdHNCeVRlYW1NZW1iZXInOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9wcm9qZWN0cy90ZWFtLW1lbWJlci86aWQvJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldFByb2plY3RzSUFtQVRlYW1NZW1iZXInOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9wcm9qZWN0cy90ZWFtLW1lbWJlci9teS8nLFxuICAgICAgICAgICAgaXNBcnJheTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICAnZ2V0QWN0aXZlUHJvamVjdHMnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgaXNBcnJheTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICAnc2F2ZSc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnXG4gICAgICAgIH0sXG4gICAgICAgICd1cGRhdGUnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnXG4gICAgICAgIH0sXG4gICAgICAgICdkZWxldGUnOiB7XG4gICAgICAgICAgICAnbWV0aG9kJzogJ0RFTEVURSdcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuICRyZXNvdXJjZSgnL2FwaS92MS9wcm9qZWN0cy86aWQvJywgbnVsbCwgYWN0aW9ucyk7XG59XG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9qZWN0cycpXG4gICAgLmNvbnRyb2xsZXIoJ1Byb2plY3RzQ29udHJvbGxlcicsIFByb2plY3RzQ29udHJvbGxlcik7XG5cbmZ1bmN0aW9uIFByb2plY3RzQ29udHJvbGxlcihQcm9qZWN0c1NlcnZpY2UsIE5vdGlmaWNhdGlvbiwgYW5hbHl0aWNzLCAkbG9jYXRpb24sICRtb2RhbCwgJHNjb3BlLCAkc2NlLCAkcm9vdFNjb3BlKSB7XG4gICAgLyogU2luY2UgdGhpcyBwYWdlIGNhbiBiZSB0aGUgcm9vdCBmb3Igc29tZSB1c2VycyBsZXQncyBtYWtlIHN1cmUgd2UgY2FwdHVyZSB0aGUgY29ycmVjdCBwYWdlICovXG4gICAgdmFyIGxvY2F0aW9uX3VybCA9ICRsb2NhdGlvbi51cmwoKS5pbmRleE9mKCcvcHJvamVjdHMnKSA8IDAgPyAnL3Byb2plY3RzJyA6ICRsb2NhdGlvbi51cmwoKTtcbiAgICBhbmFseXRpY3MudHJhY2tQYWdlKCRzY29wZSwgJGxvY2F0aW9uLmFic1VybCgpLCBsb2NhdGlvbl91cmwpO1xuXG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5hY3RpdmVQcm9qZWN0cyA9IFtdO1xuICAgIHZtLmFjdGl2ZVByb2plY3RzTG9hZGVkID0gZmFsc2U7XG4gICAgdm0uc2hvd0VtcHR5U2NyZWVuID0gZmFsc2U7XG4gICAgdm0ud2VsY29tZSA9ICRzY2UudHJ1c3RBc0h0bWwoJHJvb3RTY29wZS5jdXN0b21lci5wcm9qZWN0c193ZWxjb21lKTtcbiAgICB2bS5zdWJtaXRQcm9qZWN0ID0gc3VibWl0UHJvamVjdDtcblxuICAgIGFjdGl2YXRlKCk7XG5cbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgZ2V0QWN0aXZlUHJvamVjdHMoKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0QWN0aXZlUHJvamVjdHMoKSB7XG4gICAgICAgIFByb2plY3RzU2VydmljZS5nZXRBY3RpdmVQcm9qZWN0cygpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHZtLmFjdGl2ZVByb2plY3RzID0gZGF0YTtcbiAgICAgICAgICAgICAgICB2bS5hY3RpdmVQcm9qZWN0c0xvYWRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgY2hlY2tJc0VtcHR5KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZtLmFjdGl2ZVByb2plY3RzO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hlY2tJc0VtcHR5KCkge1xuICAgICAgICBpZiAodm0uYWN0aXZlUHJvamVjdHNMb2FkZWQpIHtcbiAgICAgICAgICAgIGlmICh2bS5hY3RpdmVQcm9qZWN0cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgIHZtLnNob3dFbXB0eVNjcmVlbiA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZtLnNob3dFbXB0eVNjcmVlbiA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3VibWl0UHJvamVjdCgpIHtcbiAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG4gICAgICAgICAgICBhbmltYXRpb246IHRydWUsXG4gICAgICAgICAgICB3aW5kb3dDbGFzczogJ3h4LWRpYWxvZyBmYWRlIHpvb20nLFxuICAgICAgICAgICAgYmFja2Ryb3A6ICdzdGF0aWMnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvc3RhdGljL2FuZ3VsYXIvY2hlY2tpbnMvcGFydGlhbHMvX21vZGFscy9yZXF1ZXN0LWNoZWNraW4uaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnUmVxdWVzdENoZWNrSW5Db250cm9sbGVyIGFzIHJlcXVlc3QnLFxuICAgICAgICAgICAgcmVzb2x2ZToge1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKFxuICAgICAgICAgICAgZnVuY3Rpb24gKHNlbnRGZWVkYmFja1JlcXVlc3RzKSB7XG4gICAgICAgICAgICAgICAgZ2V0TXlDaGVja0luUmVxdWVzdHMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbn1cblxuYW5ndWxhclxuICAgIC5tb2R1bGUoJ3Byb2plY3RzJylcbiAgICAuY29udHJvbGxlcignUHJvamVjdENvbnRyb2xsZXInLCBQcm9qZWN0Q29udHJvbGxlcik7XG5cbmZ1bmN0aW9uIFByb2plY3RDb250cm9sbGVyKFByb2plY3RzU2VydmljZSwgQ29tbWVudCwgTm90aWZpY2F0aW9uLCBhbmFseXRpY3MsICRsb2NhdGlvbiwgJG1vZGFsLCAkc2NvcGUsICRzY2UsICRyb290U2NvcGUsICRyb3V0ZVBhcmFtcykge1xuICAgIGFuYWx5dGljcy50cmFja1BhZ2UoJHNjb3BlLCAkbG9jYXRpb24uYWJzVXJsKCksICRsb2NhdGlvbi51cmwoKSk7XG5cbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLnByb2plY3QgPSBudWxsO1xuICAgIHZtLnNob3dTdW1tYXJ5RWRpdCA9IGZhbHNlO1xuICAgIHZtLmNvbW1lbnRzID0gW107XG4gICAgdm0uYWRkQ29tbWVudCA9IGFkZENvbW1lbnQ7XG5cbiAgICBhY3RpdmF0ZSgpO1xuXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgIGluaXRpYWxpemVOZXdDb21tZW50KCk7XG4gICAgICAgIGdldFByb2plY3QoKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gaW5pdGlhbGl6ZU5ld0NvbW1lbnQoKSB7XG4gICAgICAgIHZtLm5ld0NvbW1lbnQgPSBuZXcgQ29tbWVudCh7Y29udGVudDonJywgaW5jbHVkZV9pbl9kYWlseV9kaWdlc3Q6dHJ1ZX0pO1xuICAgICAgICB2bS5uZXdDb21tZW50LmV4cGFuZFRleHRBcmVhID0gZmFsc2U7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldFByb2plY3QoKSB7XG4gICAgICAgIFByb2plY3RzU2VydmljZS5nZXRQcm9qZWN0KCRyb3V0ZVBhcmFtcy5wcm9qZWN0SWQpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHZtLnByb2plY3QgPSBkYXRhO1xuICAgICAgICAgICAgICAgIHZtLmNvbW1lbnRzID0gdm0ucHJvamVjdC5jb21tZW50cztcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgICAgICAgICAgICAgTm90aWZpY2F0aW9uLnN1Y2Nlc3MoXCJTb3JyeSB3ZSBoYWQgYSBwcm9ibGVtIG9wZW5pbmcgdGhpcyBwcm9qZWN0LlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRDb21tZW50KGZvcm0pIHtcbiAgICAgICAgaWYgKGZvcm0uJGludmFsaWQpIHJldHVybjtcbiAgICAgICAgQ29tbWVudC5hZGRUb1Byb2plY3QoeyBpZDokcm91dGVQYXJhbXMucHJvamVjdElkfSwgdm0ubmV3Q29tbWVudCwgZnVuY3Rpb24oY29tbWVudCkge1xuICAgICAgICAgICAgaW5pdGlhbGl6ZU5ld0NvbW1lbnQoKTtcbiAgICAgICAgICAgIHZtLmNvbW1lbnRzLnB1c2goY29tbWVudCk7XG4gICAgICAgIH0pO1xuICAgIH07XG59XG59KCkpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
