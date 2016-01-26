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
        getCurrentCriteria: getCurrentCriteria,
        save: save,
        update: update
    };

    function getCurrentCriteria() {
        return $http.get('/api/v1/projects/criteria/')
            .then(success)
            .catch(fail);

        function success(response) {
            return response.data;
        }

        function fail(response) {
            $log.error('getCurrentCriteria failed');
        }
    }

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
            templateUrl: '/static/angular/projects/partials/_modals/add-project.html',
            controller: 'AddProjectController as addProject',
            resolve: {

            }
        });
        modalInstance.result.then(
            function (project) {
                vm.activeProjects.push(project);
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

angular
    .module('projects')
    .controller('AddProjectController', AddProjectController);

function AddProjectController(ProjectsService, Notification, EmployeeSearch, $modalInstance) {
    var vm = this;

    vm.name = null;
    vm.description = null;
    vm.employees = [];
    vm.selectedOwners = [];
    vm.selectedSponsors = [];
    vm.selectedTeamMembers = [];
    vm.stepNext = stepNext;
    vm.stepBack = stepBack;
    vm.cancel = cancel;
    vm.panel_index = 0;
    vm.ruleSet = [];

    activate()

    function activate() {
        getEmployees();
        getCriteria();
    }

    function getCriteria() {
        ProjectsService.getCurrentCriteria()
            .then(function (data) {
                vm.ruleSet = data.criteria;
                console.log(vm.ruleSet);
                return vm.ruleSet;
        });
    }

    function getEmployees() {
        EmployeeSearch.query(function(data) {
                vm.employees = data;
        });
    }

    function stepNext() {
        vm.panel_index++;
    }

    function stepBack() {
        vm.panel_index--;
    }

    function cancel() {
        $modalInstance.dismiss();
    }

}
AddProjectController.$inject = ["ProjectsService", "Notification", "EmployeeSearch", "$modalInstance"];
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2plY3RzLm1vZHVsZS5qcyIsInByb2plY3RzLnNlcnZpY2UuanMiLCJwcm9qZWN0cy5yZXNvdXJjZS5qcyIsInByb2plY3RzLmNvbnRyb2xsZXIuanMiLCJwcm9qZWN0LmNvbnRyb2xsZXIuanMiLCJhZGQtcHJvamVjdC5jb250cm9sbGVyLmpzIiwicHJvamVjdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxDQUFBLFdBQUE7QUFDQTs7QUNEQTtLQUNBLE9BQUEsWUFBQSxDQUFBLFdBQUE7O0FBRUE7S0FDQSxPQUFBO0tBQ0EsUUFBQSxtQkFBQTs7QUFFQSxTQUFBLGdCQUFBLE9BQUEsTUFBQSxrQkFBQTtJQUNBLE9BQUE7UUFDQSxZQUFBO1FBQ0EsbUJBQUE7UUFDQSxvQkFBQTtRQUNBLE1BQUE7UUFDQSxRQUFBOzs7SUFHQSxTQUFBLHFCQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUE7YUFDQSxLQUFBO2FBQ0EsTUFBQTs7UUFFQSxTQUFBLFFBQUEsVUFBQTtZQUNBLE9BQUEsU0FBQTs7O1FBR0EsU0FBQSxLQUFBLFVBQUE7WUFDQSxLQUFBLE1BQUE7Ozs7SUFJQSxTQUFBLFdBQUEsV0FBQTtRQUNBLE9BQUEsaUJBQUEsSUFBQSxDQUFBLElBQUEsWUFBQSxTQUFBLE1BQUE7O1FBRUEsU0FBQSxRQUFBLFVBQUE7WUFDQSxPQUFBOzs7UUFHQSxTQUFBLEtBQUEsVUFBQTtZQUNBLEtBQUEsTUFBQTs7OztJQUlBLFNBQUEsb0JBQUE7UUFDQSxPQUFBLGlCQUFBLGtCQUFBLE1BQUEsU0FBQSxNQUFBOztRQUVBLFNBQUEsUUFBQSxVQUFBO1lBQ0EsT0FBQTs7O1FBR0EsU0FBQSxLQUFBLFVBQUE7WUFDQSxLQUFBLE1BQUE7Ozs7SUFJQSxTQUFBLEtBQUEsU0FBQTtRQUNBLE9BQUEsaUJBQUEsS0FBQSxTQUFBLFNBQUEsTUFBQTs7UUFFQSxTQUFBLFFBQUEsVUFBQTtZQUNBLE9BQUEsU0FBQTs7O1FBR0EsU0FBQSxLQUFBLFVBQUE7WUFD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Ozs7OztJQUtBLFNBQUEsV0FBQSxNQUFBO1FBQ0EsSUFBQSxLQUFBLFVBQUE7UUFDQSxRQUFBLGFBQUEsRUFBQSxHQUFBLGFBQUEsWUFBQSxHQUFBLFlBQUEsU0FBQSxTQUFBO1lBQ0E7WUFDQSxHQUFBLFNBQUEsS0FBQTs7S0MzQ0E7Ozs7QUFHQTtLQUNBLE9BQUE7S0FDQSxXQUFBLHdCQUFBOztBQUVBLFNBQUEscUJBQUEsaUJBQUEsY0FBQSxnQkFBQSxnQkFBQTtJQUNBLElBQUEsS0FBQTs7SUFFQSxHQUFBLE9BQUE7SUFDQSxHQUFBLGNBQUE7SUFDQSxHQUFBLFlBQUE7SUFDQSxHQUFBLGlCQUFBO0lBQ0EsR0FBQSxtQkFBQTtJQUNBLEdBQUEsc0JBQUE7SUFDQSxHQUFBLFdBQUE7SUFDQSxHQUFBLFdBQUE7SUFDQSxHQUFBLFNBQUE7SUFDQSxHQUFBLGNBQUE7SUFDQSxHQUFBLFVBQUE7O0lBRUE7O0lBRUEsU0FBQSxXQUFBO1FBQ0E7UUFDQTs7O0lBR0EsU0FBQSxjQUFBO1FBQ0EsZ0JBQUE7YUFDQSxLQUFBLFVBQUEsTUFBQTtnQkFDQSxHQUFBLFVBQUEsS0FBQTtnQkFDQSxRQUFBLElBQUEsR0FBQTtnQkFDQSxPQUFBLEdBQUE7Ozs7SUFJQSxTQUFBLGVBQUE7UUFDQSxlQUFBLE1BQUEsU0FBQSxNQUFBO2dCQUNBLEdBQUEsWUFBQTs7OztJQUlBLFNBQUEsV0FBQTtRQUNBLEdBQUE7OztJQUdBLFNBQUEsV0FBQTtRQUNBLEdBQUE7OztJQUdBLFNBQUEsU0FBQTtRQUNBLGVBQUE7Ozs7OztBQ3NQQSIsImZpbGUiOiJwcm9qZWN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9qZWN0cycsIFsnbmdSb3V0ZScsICd1aS1ub3RpZmljYXRpb24nXSk7XG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgncHJvamVjdHMnKVxuICAgIC5mYWN0b3J5KCdQcm9qZWN0c1NlcnZpY2UnLCBQcm9qZWN0c1NlcnZpY2UpO1xuXG5mdW5jdGlvbiBQcm9qZWN0c1NlcnZpY2UoJGh0dHAsICRsb2csIFByb2plY3RzUmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRQcm9qZWN0OiBnZXRQcm9qZWN0LFxuICAgICAgICBnZXRBY3RpdmVQcm9qZWN0czogZ2V0QWN0aXZlUHJvamVjdHMsXG4gICAgICAgIGdldEN1cnJlbnRDcml0ZXJpYTogZ2V0Q3VycmVudENyaXRlcmlhLFxuICAgICAgICBzYXZlOiBzYXZlLFxuICAgICAgICB1cGRhdGU6IHVwZGF0ZVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRDdXJyZW50Q3JpdGVyaWEoKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdjEvcHJvamVjdHMvY3JpdGVyaWEvJylcbiAgICAgICAgICAgIC50aGVuKHN1Y2Nlc3MpXG4gICAgICAgICAgICAuY2F0Y2goZmFpbCk7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdnZXRDdXJyZW50Q3JpdGVyaWEgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQcm9qZWN0KHByb2plY3RJZCkge1xuICAgICAgICByZXR1cm4gUHJvamVjdHNSZXNvdXJjZS5nZXQoe2lkOiBwcm9qZWN0SWR9LCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdnZXRQcm9qZWN0IGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QWN0aXZlUHJvamVjdHMoKSB7XG4gICAgICAgIHJldHVybiBQcm9qZWN0c1Jlc291cmNlLmdldEFjdGl2ZVByb2plY3RzKG51bGwsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ2dldFByb2plY3QgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzYXZlKHByb2plY3QpIHtcbiAgICAgICAgcmV0dXJuIFByb2plY3RzUmVzb3VyY2Uuc2F2ZShwcm9qZWN0LCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ3NhdmUgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGUocHJvamVjdCkge1xuICAgICAgICByZXR1cm4gUHJvamVjdHNSZXNvdXJjZS51cGRhdGUoe2lkOiBwcm9qZWN0LmlkfSwgcHJvamVjdCwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCd1cGRhdGUgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ3Byb2plY3RzJylcbiAgICAuZmFjdG9yeSgnUHJvamVjdHNSZXNvdXJjZScsIFByb2plY3RzUmVzb3VyY2UpO1xuXG5mdW5jdGlvbiBQcm9qZWN0c1Jlc291cmNlKCRyZXNvdXJjZSkge1xuICAgIHZhciBhY3Rpb25zID0ge1xuICAgICAgICAnZ2V0Jzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJ1xuICAgICAgICB9LFxuICAgICAgICAnZ2V0UHJvamVjdHNCeU93bmVyJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvcHJvamVjdHMvb3duZWQvOmlkLycsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRQcm9qZWN0c0lPd24nOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9wcm9qZWN0cy9vd25lZC9teS8nLFxuICAgICAgICAgICAgaXNBcnJheTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICAnZ2V0UHJvamVjdHNCeVNwb25zb3InOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9wcm9qZWN0cy9zcG9uc29yZWQvOmlkLycsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRQcm9qZWN0c0lTcG9uc29yJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvcHJvamVjdHMvc3BvbnNvcmVkL215LycsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRQcm9qZWN0c0J5VGVhbU1lbWJlcic6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3Byb2plY3RzL3RlYW0tbWVtYmVyLzppZC8nLFxuICAgICAgICAgICAgaXNBcnJheTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICAnZ2V0UHJvamVjdHNJQW1BVGVhbU1lbWJlcic6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3Byb2plY3RzL3RlYW0tbWVtYmVyL215LycsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRBY3RpdmVQcm9qZWN0cyc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdzYXZlJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCdcbiAgICAgICAgfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BVVCdcbiAgICAgICAgfSxcbiAgICAgICAgJ2RlbGV0ZSc6IHtcbiAgICAgICAgICAgICdtZXRob2QnOiAnREVMRVRFJ1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gJHJlc291cmNlKCcvYXBpL3YxL3Byb2plY3RzLzppZC8nLCBudWxsLCBhY3Rpb25zKTtcbn1cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9qZWN0cycpXG4gICAgLmNvbnRyb2xsZXIoJ1Byb2plY3RzQ29udHJvbGxlcicsIFByb2plY3RzQ29udHJvbGxlcik7XG5cbmZ1bmN0aW9uIFByb2plY3RzQ29udHJvbGxlcihQcm9qZWN0c1NlcnZpY2UsIE5vdGlmaWNhdGlvbiwgYW5hbHl0aWNzLCAkbG9jYXRpb24sICRtb2RhbCwgJHNjb3BlLCAkc2NlLCAkcm9vdFNjb3BlKSB7XG4gICAgLyogU2luY2UgdGhpcyBwYWdlIGNhbiBiZSB0aGUgcm9vdCBmb3Igc29tZSB1c2VycyBsZXQncyBtYWtlIHN1cmUgd2UgY2FwdHVyZSB0aGUgY29ycmVjdCBwYWdlICovXG4gICAgdmFyIGxvY2F0aW9uX3VybCA9ICRsb2NhdGlvbi51cmwoKS5pbmRleE9mKCcvcHJvamVjdHMnKSA8IDAgPyAnL3Byb2plY3RzJyA6ICRsb2NhdGlvbi51cmwoKTtcbiAgICBhbmFseXRpY3MudHJhY2tQYWdlKCRzY29wZSwgJGxvY2F0aW9uLmFic1VybCgpLCBsb2NhdGlvbl91cmwpO1xuXG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5hY3RpdmVQcm9qZWN0cyA9IFtdO1xuICAgIHZtLmFjdGl2ZVByb2plY3RzTG9hZGVkID0gZmFsc2U7XG4gICAgdm0uc2hvd0VtcHR5U2NyZWVuID0gZmFsc2U7XG4gICAgdm0ud2VsY29tZSA9ICRzY2UudHJ1c3RBc0h0bWwoJHJvb3RTY29wZS5jdXN0b21lci5wcm9qZWN0c193ZWxjb21lKTtcbiAgICB2bS5zdWJtaXRQcm9qZWN0ID0gc3VibWl0UHJvamVjdDtcblxuICAgIGFjdGl2YXRlKCk7XG5cbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgZ2V0QWN0aXZlUHJvamVjdHMoKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0QWN0aXZlUHJvamVjdHMoKSB7XG4gICAgICAgIFByb2plY3RzU2VydmljZS5nZXRBY3RpdmVQcm9qZWN0cygpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHZtLmFjdGl2ZVByb2plY3RzID0gZGF0YTtcbiAgICAgICAgICAgICAgICB2bS5hY3RpdmVQcm9qZWN0c0xvYWRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgY2hlY2tJc0VtcHR5KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZtLmFjdGl2ZVByb2plY3RzO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hlY2tJc0VtcHR5KCkge1xuICAgICAgICBpZiAodm0uYWN0aXZlUHJvamVjdHNMb2FkZWQpIHtcbiAgICAgICAgICAgIGlmICh2bS5hY3RpdmVQcm9qZWN0cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgIHZtLnNob3dFbXB0eVNjcmVlbiA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZtLnNob3dFbXB0eVNjcmVlbiA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3VibWl0UHJvamVjdCgpIHtcbiAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG4gICAgICAgICAgICBhbmltYXRpb246IHRydWUsXG4gICAgICAgICAgICB3aW5kb3dDbGFzczogJ3h4LWRpYWxvZyBmYWRlIHpvb20nLFxuICAgICAgICAgICAgYmFja2Ryb3A6ICdzdGF0aWMnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvc3RhdGljL2FuZ3VsYXIvcHJvamVjdHMvcGFydGlhbHMvX21vZGFscy9hZGQtcHJvamVjdC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBZGRQcm9qZWN0Q29udHJvbGxlciBhcyBhZGRQcm9qZWN0JyxcbiAgICAgICAgICAgIHJlc29sdmU6IHtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIChwcm9qZWN0KSB7XG4gICAgICAgICAgICAgICAgdm0uYWN0aXZlUHJvamVjdHMucHVzaChwcm9qZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbn1cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9qZWN0cycpXG4gICAgLmNvbnRyb2xsZXIoJ1Byb2plY3RDb250cm9sbGVyJywgUHJvamVjdENvbnRyb2xsZXIpO1xuXG5mdW5jdGlvbiBQcm9qZWN0Q29udHJvbGxlcihQcm9qZWN0c1NlcnZpY2UsIENvbW1lbnQsIE5vdGlmaWNhdGlvbiwgYW5hbHl0aWNzLCAkbG9jYXRpb24sICRtb2RhbCwgJHNjb3BlLCAkc2NlLCAkcm9vdFNjb3BlLCAkcm91dGVQYXJhbXMpIHtcbiAgICBhbmFseXRpY3MudHJhY2tQYWdlKCRzY29wZSwgJGxvY2F0aW9uLmFic1VybCgpLCAkbG9jYXRpb24udXJsKCkpO1xuXG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5wcm9qZWN0ID0gbnVsbDtcbiAgICB2bS5zaG93U3VtbWFyeUVkaXQgPSBmYWxzZTtcbiAgICB2bS5jb21tZW50cyA9IFtdO1xuICAgIHZtLmFkZENvbW1lbnQgPSBhZGRDb21tZW50O1xuXG4gICAgYWN0aXZhdGUoKTtcblxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICBpbml0aWFsaXplTmV3Q29tbWVudCgpO1xuICAgICAgICBnZXRQcm9qZWN0KCk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGluaXRpYWxpemVOZXdDb21tZW50KCkge1xuICAgICAgICB2bS5uZXdDb21tZW50ID0gbmV3IENvbW1lbnQoe2NvbnRlbnQ6JycsIGluY2x1ZGVfaW5fZGFpbHlfZGlnZXN0OnRydWV9KTtcbiAgICAgICAgdm0ubmV3Q29tbWVudC5leHBhbmRUZXh0QXJlYSA9IGZhbHNlO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRQcm9qZWN0KCkge1xuICAgICAgICBQcm9qZWN0c1NlcnZpY2UuZ2V0UHJvamVjdCgkcm91dGVQYXJhbXMucHJvamVjdElkKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2bS5wcm9qZWN0ID0gZGF0YTtcbiAgICAgICAgICAgICAgICB2bS5jb21tZW50cyA9IHZtLnByb2plY3QuY29tbWVudHM7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICAgICAgICAgIE5vdGlmaWNhdGlvbi5zdWNjZXNzKFwiU29ycnkgd2UgaGFkIGEgcHJvYmxlbSBvcGVuaW5nIHRoaXMgcHJvamVjdC5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkQ29tbWVudChmb3JtKSB7XG4gICAgICAgIGlmIChmb3JtLiRpbnZhbGlkKSByZXR1cm47XG4gICAgICAgIENvbW1lbnQuYWRkVG9Qcm9qZWN0KHsgaWQ6JHJvdXRlUGFyYW1zLnByb2plY3RJZH0sIHZtLm5ld0NvbW1lbnQsIGZ1bmN0aW9uKGNvbW1lbnQpIHtcbiAgICAgICAgICAgIGluaXRpYWxpemVOZXdDb21tZW50KCk7XG4gICAgICAgICAgICB2bS5jb21tZW50cy5wdXNoKGNvbW1lbnQpO1xuICAgICAgICB9KTtcbiAgICB9O1xufVxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ3Byb2plY3RzJylcbiAgICAuY29udHJvbGxlcignQWRkUHJvamVjdENvbnRyb2xsZXInLCBBZGRQcm9qZWN0Q29udHJvbGxlcik7XG5cbmZ1bmN0aW9uIEFkZFByb2plY3RDb250cm9sbGVyKFByb2plY3RzU2VydmljZSwgTm90aWZpY2F0aW9uLCBFbXBsb3llZVNlYXJjaCwgJG1vZGFsSW5zdGFuY2UpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgdm0ubmFtZSA9IG51bGw7XG4gICAgdm0uZGVzY3JpcHRpb24gPSBudWxsO1xuICAgIHZtLmVtcGxveWVlcyA9IFtdO1xuICAgIHZtLnNlbGVjdGVkT3duZXJzID0gW107XG4gICAgdm0uc2VsZWN0ZWRTcG9uc29ycyA9IFtdO1xuICAgIHZtLnNlbGVjdGVkVGVhbU1lbWJlcnMgPSBbXTtcbiAgICB2bS5zdGVwTmV4dCA9IHN0ZXBOZXh0O1xuICAgIHZtLnN0ZXBCYWNrID0gc3RlcEJhY2s7XG4gICAgdm0uY2FuY2VsID0gY2FuY2VsO1xuICAgIHZtLnBhbmVsX2luZGV4ID0gMDtcbiAgICB2bS5ydWxlU2V0ID0gW107XG5cbiAgICBhY3RpdmF0ZSgpXG5cbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgZ2V0RW1wbG95ZWVzKCk7XG4gICAgICAgIGdldENyaXRlcmlhKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Q3JpdGVyaWEoKSB7XG4gICAgICAgIFByb2plY3RzU2VydmljZS5nZXRDdXJyZW50Q3JpdGVyaWEoKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2bS5ydWxlU2V0ID0gZGF0YS5jcml0ZXJpYTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2bS5ydWxlU2V0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdm0ucnVsZVNldDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RW1wbG95ZWVzKCkge1xuICAgICAgICBFbXBsb3llZVNlYXJjaC5xdWVyeShmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgdm0uZW1wbG95ZWVzID0gZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RlcE5leHQoKSB7XG4gICAgICAgIHZtLnBhbmVsX2luZGV4Kys7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RlcEJhY2soKSB7XG4gICAgICAgIHZtLnBhbmVsX2luZGV4LS07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCk7XG4gICAgfVxuXG59IiwiOyhmdW5jdGlvbigpIHtcblwidXNlIHN0cmljdFwiO1xuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgncHJvamVjdHMnLCBbJ25nUm91dGUnLCAndWktbm90aWZpY2F0aW9uJ10pO1xuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgncHJvamVjdHMnKVxuICAgIC5mYWN0b3J5KCdQcm9qZWN0c1NlcnZpY2UnLCBQcm9qZWN0c1NlcnZpY2UpO1xuXG5mdW5jdGlvbiBQcm9qZWN0c1NlcnZpY2UoJGh0dHAsICRsb2csIFByb2plY3RzUmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRQcm9qZWN0OiBnZXRQcm9qZWN0LFxuICAgICAgICBnZXRBY3RpdmVQcm9qZWN0czogZ2V0QWN0aXZlUHJvamVjdHMsXG4gICAgICAgIGdldEN1cnJlbnRDcml0ZXJpYTogZ2V0Q3VycmVudENyaXRlcmlhLFxuICAgICAgICBzYXZlOiBzYXZlLFxuICAgICAgICB1cGRhdGU6IHVwZGF0ZVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRDdXJyZW50Q3JpdGVyaWEoKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdjEvcHJvamVjdHMvY3JpdGVyaWEvJylcbiAgICAgICAgICAgIC50aGVuKHN1Y2Nlc3MpXG4gICAgICAgICAgICAuY2F0Y2goZmFpbCk7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdnZXRDdXJyZW50Q3JpdGVyaWEgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQcm9qZWN0KHByb2plY3RJZCkge1xuICAgICAgICByZXR1cm4gUHJvamVjdHNSZXNvdXJjZS5nZXQoe2lkOiBwcm9qZWN0SWR9LCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdnZXRQcm9qZWN0IGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QWN0aXZlUHJvamVjdHMoKSB7XG4gICAgICAgIHJldHVybiBQcm9qZWN0c1Jlc291cmNlLmdldEFjdGl2ZVByb2plY3RzKG51bGwsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ2dldFByb2plY3QgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzYXZlKHByb2plY3QpIHtcbiAgICAgICAgcmV0dXJuIFByb2plY3RzUmVzb3VyY2Uuc2F2ZShwcm9qZWN0LCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ3NhdmUgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGUocHJvamVjdCkge1xuICAgICAgICByZXR1cm4gUHJvamVjdHNSZXNvdXJjZS51cGRhdGUoe2lkOiBwcm9qZWN0LmlkfSwgcHJvamVjdCwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCd1cGRhdGUgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5hbmd1bGFyXG4gICAgLm1vZHVsZSgncHJvamVjdHMnKVxuICAgIC5mYWN0b3J5KCdQcm9qZWN0c1Jlc291cmNlJywgUHJvamVjdHNSZXNvdXJjZSk7XG5cbmZ1bmN0aW9uIFByb2plY3RzUmVzb3VyY2UoJHJlc291cmNlKSB7XG4gICAgdmFyIGFjdGlvbnMgPSB7XG4gICAgICAgICdnZXQnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRQcm9qZWN0c0J5T3duZXInOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9wcm9qZWN0cy9vd25lZC86aWQvJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldFByb2plY3RzSU93bic6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3Byb2plY3RzL293bmVkL215LycsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRQcm9qZWN0c0J5U3BvbnNvcic6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3Byb2plY3RzL3Nwb25zb3JlZC86aWQvJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldFByb2plY3RzSVNwb25zb3InOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9wcm9qZWN0cy9zcG9uc29yZWQvbXkvJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldFByb2plY3RzQnlUZWFtTWVtYmVyJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvcHJvamVjdHMvdGVhbS1tZW1iZXIvOmlkLycsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRQcm9qZWN0c0lBbUFUZWFtTWVtYmVyJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvcHJvamVjdHMvdGVhbS1tZW1iZXIvbXkvJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldEFjdGl2ZVByb2plY3RzJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ3NhdmUnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJ1xuICAgICAgICB9LFxuICAgICAgICAndXBkYXRlJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnUFVUJ1xuICAgICAgICB9LFxuICAgICAgICAnZGVsZXRlJzoge1xuICAgICAgICAgICAgJ21ldGhvZCc6ICdERUxFVEUnXG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiAkcmVzb3VyY2UoJy9hcGkvdjEvcHJvamVjdHMvOmlkLycsIG51bGwsIGFjdGlvbnMpO1xufVxuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgncHJvamVjdHMnKVxuICAgIC5jb250cm9sbGVyKCdQcm9qZWN0c0NvbnRyb2xsZXInLCBQcm9qZWN0c0NvbnRyb2xsZXIpO1xuXG5mdW5jdGlvbiBQcm9qZWN0c0NvbnRyb2xsZXIoUHJvamVjdHNTZXJ2aWNlLCBOb3RpZmljYXRpb24sIGFuYWx5dGljcywgJGxvY2F0aW9uLCAkbW9kYWwsICRzY29wZSwgJHNjZSwgJHJvb3RTY29wZSkge1xuICAgIC8qIFNpbmNlIHRoaXMgcGFnZSBjYW4gYmUgdGhlIHJvb3QgZm9yIHNvbWUgdXNlcnMgbGV0J3MgbWFrZSBzdXJlIHdlIGNhcHR1cmUgdGhlIGNvcnJlY3QgcGFnZSAqL1xuICAgIHZhciBsb2NhdGlvbl91cmwgPSAkbG9jYXRpb24udXJsKCkuaW5kZXhPZignL3Byb2plY3RzJykgPCAwID8gJy9wcm9qZWN0cycgOiAkbG9jYXRpb24udXJsKCk7XG4gICAgYW5hbHl0aWNzLnRyYWNrUGFnZSgkc2NvcGUsICRsb2NhdGlvbi5hYnNVcmwoKSwgbG9jYXRpb25fdXJsKTtcblxuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uYWN0aXZlUHJvamVjdHMgPSBbXTtcbiAgICB2bS5hY3RpdmVQcm9qZWN0c0xvYWRlZCA9IGZhbHNlO1xuICAgIHZtLnNob3dFbXB0eVNjcmVlbiA9IGZhbHNlO1xuICAgIHZtLndlbGNvbWUgPSAkc2NlLnRydXN0QXNIdG1sKCRyb290U2NvcGUuY3VzdG9tZXIucHJvamVjdHNfd2VsY29tZSk7XG4gICAgdm0uc3VibWl0UHJvamVjdCA9IHN1Ym1pdFByb2plY3Q7XG5cbiAgICBhY3RpdmF0ZSgpO1xuXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgIGdldEFjdGl2ZVByb2plY3RzKCk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldEFjdGl2ZVByb2plY3RzKCkge1xuICAgICAgICBQcm9qZWN0c1NlcnZpY2UuZ2V0QWN0aXZlUHJvamVjdHMoKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2bS5hY3RpdmVQcm9qZWN0cyA9IGRhdGE7XG4gICAgICAgICAgICAgICAgdm0uYWN0aXZlUHJvamVjdHNMb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNoZWNrSXNFbXB0eSgpO1xuICAgICAgICAgICAgICAgIHJldHVybiB2bS5hY3RpdmVQcm9qZWN0cztcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoZWNrSXNFbXB0eSgpIHtcbiAgICAgICAgaWYgKHZtLmFjdGl2ZVByb2plY3RzTG9hZGVkKSB7XG4gICAgICAgICAgICBpZiAodm0uYWN0aXZlUHJvamVjdHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICB2bS5zaG93RW1wdHlTY3JlZW4gPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2bS5zaG93RW1wdHlTY3JlZW4gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN1Ym1pdFByb2plY3QoKSB7XG4gICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuICAgICAgICAgICAgYW5pbWF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgd2luZG93Q2xhc3M6ICd4eC1kaWFsb2cgZmFkZSB6b29tJyxcbiAgICAgICAgICAgIGJhY2tkcm9wOiAnc3RhdGljJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3N0YXRpYy9hbmd1bGFyL3Byb2plY3RzL3BhcnRpYWxzL19tb2RhbHMvYWRkLXByb2plY3QuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQWRkUHJvamVjdENvbnRyb2xsZXIgYXMgYWRkUHJvamVjdCcsXG4gICAgICAgICAgICByZXNvbHZlOiB7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIG1vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiAocHJvamVjdCkge1xuICAgICAgICAgICAgICAgIHZtLmFjdGl2ZVByb2plY3RzLnB1c2gocHJvamVjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG59XG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9qZWN0cycpXG4gICAgLmNvbnRyb2xsZXIoJ1Byb2plY3RDb250cm9sbGVyJywgUHJvamVjdENvbnRyb2xsZXIpO1xuXG5mdW5jdGlvbiBQcm9qZWN0Q29udHJvbGxlcihQcm9qZWN0c1NlcnZpY2UsIENvbW1lbnQsIE5vdGlmaWNhdGlvbiwgYW5hbHl0aWNzLCAkbG9jYXRpb24sICRtb2RhbCwgJHNjb3BlLCAkc2NlLCAkcm9vdFNjb3BlLCAkcm91dGVQYXJhbXMpIHtcbiAgICBhbmFseXRpY3MudHJhY2tQYWdlKCRzY29wZSwgJGxvY2F0aW9uLmFic1VybCgpLCAkbG9jYXRpb24udXJsKCkpO1xuXG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5wcm9qZWN0ID0gbnVsbDtcbiAgICB2bS5zaG93U3VtbWFyeUVkaXQgPSBmYWxzZTtcbiAgICB2bS5jb21tZW50cyA9IFtdO1xuICAgIHZtLmFkZENvbW1lbnQgPSBhZGRDb21tZW50O1xuXG4gICAgYWN0aXZhdGUoKTtcblxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICBpbml0aWFsaXplTmV3Q29tbWVudCgpO1xuICAgICAgICBnZXRQcm9qZWN0KCk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGluaXRpYWxpemVOZXdDb21tZW50KCkge1xuICAgICAgICB2bS5uZXdDb21tZW50ID0gbmV3IENvbW1lbnQoe2NvbnRlbnQ6JycsIGluY2x1ZGVfaW5fZGFpbHlfZGlnZXN0OnRydWV9KTtcbiAgICAgICAgdm0ubmV3Q29tbWVudC5leHBhbmRUZXh0QXJlYSA9IGZhbHNlO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRQcm9qZWN0KCkge1xuICAgICAgICBQcm9qZWN0c1NlcnZpY2UuZ2V0UHJvamVjdCgkcm91dGVQYXJhbXMucHJvamVjdElkKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2bS5wcm9qZWN0ID0gZGF0YTtcbiAgICAgICAgICAgICAgICB2bS5jb21tZW50cyA9IHZtLnByb2plY3QuY29tbWVudHM7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICAgICAgICAgIE5vdGlmaWNhdGlvbi5zdWNjZXNzKFwiU29ycnkgd2UgaGFkIGEgcHJvYmxlbSBvcGVuaW5nIHRoaXMgcHJvamVjdC5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkQ29tbWVudChmb3JtKSB7XG4gICAgICAgIGlmIChmb3JtLiRpbnZhbGlkKSByZXR1cm47XG4gICAgICAgIENvbW1lbnQuYWRkVG9Qcm9qZWN0KHsgaWQ6JHJvdXRlUGFyYW1zLnByb2plY3RJZH0sIHZtLm5ld0NvbW1lbnQsIGZ1bmN0aW9uKGNvbW1lbnQpIHtcbiAgICAgICAgICAgIGluaXRpYWxpemVOZXdDb21tZW50KCk7XG4gICAgICAgICAgICB2bS5jb21tZW50cy5wdXNoKGNvbW1lbnQpO1xuICAgICAgICB9KTtcbiAgICB9O1xufVxuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgncHJvamVjdHMnKVxuICAgIC5jb250cm9sbGVyKCdBZGRQcm9qZWN0Q29udHJvbGxlcicsIEFkZFByb2plY3RDb250cm9sbGVyKTtcblxuZnVuY3Rpb24gQWRkUHJvamVjdENvbnRyb2xsZXIoUHJvamVjdHNTZXJ2aWNlLCBOb3RpZmljYXRpb24sIEVtcGxveWVlU2VhcmNoLCAkbW9kYWxJbnN0YW5jZSkge1xuICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICB2bS5uYW1lID0gbnVsbDtcbiAgICB2bS5kZXNjcmlwdGlvbiA9IG51bGw7XG4gICAgdm0uZW1wbG95ZWVzID0gW107XG4gICAgdm0uc2VsZWN0ZWRPd25lcnMgPSBbXTtcbiAgICB2bS5zZWxlY3RlZFNwb25zb3JzID0gW107XG4gICAgdm0uc2VsZWN0ZWRUZWFtTWVtYmVycyA9IFtdO1xuICAgIHZtLnN0ZXBOZXh0ID0gc3RlcE5leHQ7XG4gICAgdm0uc3RlcEJhY2sgPSBzdGVwQmFjaztcbiAgICB2bS5jYW5jZWwgPSBjYW5jZWw7XG4gICAgdm0ucGFuZWxfaW5kZXggPSAwO1xuICAgIHZtLnJ1bGVTZXQgPSBbXTtcblxuICAgIGFjdGl2YXRlKClcblxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICBnZXRFbXBsb3llZXMoKTtcbiAgICAgICAgZ2V0Q3JpdGVyaWEoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRDcml0ZXJpYSgpIHtcbiAgICAgICAgUHJvamVjdHNTZXJ2aWNlLmdldEN1cnJlbnRDcml0ZXJpYSgpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHZtLnJ1bGVTZXQgPSBkYXRhLmNyaXRlcmlhO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHZtLnJ1bGVTZXQpO1xuICAgICAgICAgICAgICAgIHJldHVybiB2bS5ydWxlU2V0O1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRFbXBsb3llZXMoKSB7XG4gICAgICAgIEVtcGxveWVlU2VhcmNoLnF1ZXJ5KGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2bS5lbXBsb3llZXMgPSBkYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdGVwTmV4dCgpIHtcbiAgICAgICAgdm0ucGFuZWxfaW5kZXgrKztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdGVwQmFjaygpIHtcbiAgICAgICAgdm0ucGFuZWxfaW5kZXgtLTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoKTtcbiAgICB9XG5cbn1cbn0oKSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
