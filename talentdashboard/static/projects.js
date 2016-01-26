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
            method: 'POST',
            url: '/api/v1/projects/add/'
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
}
ProjectController.$inject = ["ProjectsService", "Comment", "Notification", "analytics", "$location", "$modal", "$scope", "$sce", "$rootScope", "$routeParams"];

angular
    .module('projects')
    .controller('AddProjectController', AddProjectController);

function AddProjectController(ProjectsService, Notification, EmployeeSearch, $modalInstance) {
    var vm = this;
    vm.project = {
        name: null,
        description: null,
        owners: [],
        sponsors: [],
        team_members: [],
        scores: []
    }
    vm.selectedOwners = [];
    vm.selectedSponsors = [];
    vm.selectedTeamMembers = [];
    vm.employees = [];
    vm.stepNext = stepNext;
    vm.stepBack = stepBack;
    vm.cancel = cancel;
    vm.save = save;
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

    function save() {
        for(var i=0; i < vm.selectedOwners.length; i++) {
            vm.project.owners.push(vm.selectedOwners[i].pk);
        }
        for(var i=0; i < vm.selectedSponsors.length; i++) {
            vm.project.sponsors.push(vm.selectedSponsors[i].pk);
        }
        for(var i=0; i < vm.selectedTeamMembers.length; i++) {
            vm.project.team_members.push(vm.selectedTeamMembers[i].pk);
        }
        angular.forEach(vm.ruleSet, function (rule) {
            if (rule.selected) {
                console.log(rule.selected);
                vm.project.scores.push(rule.selected);
            }
        });

        console.log(vm.project);
        ProjectsService.save(vm.project)
            .then(function(project) {
                Notification.success('%s was created.' % project.name)
                $modalInstance.close(project)
        });
    }
}
AddProjectController.$inject = ["ProjectsService", "Notification", "EmployeeSearch", "$modalInstance"];
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2plY3RzLm1vZHVsZS5qcyIsInByb2plY3RzLnNlcnZpY2UuanMiLCJwcm9qZWN0cy5yZXNvdXJjZS5qcyIsInByb2plY3RzLmNvbnRyb2xsZXIuanMiLCJwcm9qZWN0LmNvbnRyb2xsZXIuanMiLCJhZGQtcHJvamVjdC5jb250cm9sbGVyLmpzIiwicHJvamVjdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxDQUFBLFdBQUE7QUFDQTs7QUNEQTtLQUNBLE9BQUEsWUFBQSxDQUFBLFdBQUE7O0FBRUE7S0FDQSxPQUFBO0tBQ0EsUUFBQSxtQkFBQTs7QUFFQSxTQUFBLGdCQUFBLE9BQUEsTUFBQSxrQkFBQTtJQUNBLE9BQUE7UUFDQSxZQUFBO1FBQ0EsbUJBQUE7UUFDQSxvQkFBQTtRQUNBLE1BQUE7UUFDQSxRQUFBOzs7SUFHQSxTQUFBLHFCQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUE7YUFDQSxLQUFBO2FBQ0EsTUFBQTs7UUFFQSxTQUFBLFFBQUEsVUFBQTtZQUNBLE9BQUEsU0FBQTs7O1FBR0EsU0FBQSxLQUFBLFVBQUE7WUFDQSxLQUFBLE1BQUE7Ozs7SUFJQSxTQUFBLFdBQUEsV0FBQTtRQUNBLE9BQUEsaUJBQUEsSUFBQSxDQUFBLElBQUEsWUFBQSxTQUFBLE1BQUE7O1FBRUEsU0FBQSxRQUFBLFVBQUE7WUFDQSxPQUFBOzs7UUFHQSxTQUFBLEtBQUEsVUFBQTtZQUNBLEtBQUEsTUFBQTs7OztJQUlBLFNBQUEsb0JBQUE7UUFDQSxPQUFBLGlCQUFBLGtCQUFBLE1BQUEsU0FBQSxNQUFBOztRQUVBLFNBQUEsUUFBQSxVQUFBO1lBQ0EsT0FBQTs7O1FBR0EsU0FBQSxLQUFBLFVBQUE7WUFDQSxLQUFBLE1BQUE7Ozs7SUFJQSxTQUFBLEtBQUEsU0FBQTtRQUNBLE9BQUEsaUJBQUEsS0FBQSxTQUFBLFNBQUEsTUFBQTs7UUFFQSxTQUFBLFFBQUEsVUFBQTtZQUNBLE9BQUEsU0FBQTs7O1FBR0EsU0FBQSxLQUFBLFVBQUE7WUFD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QSxHQUFBLGlCQUFBLEdBQUE7O1FBRUEsSUFBQSxJQUFBLEVBQUEsR0FBQSxJQUFBLEdBQUEsb0JBQUEsUUFBQSxLQUFBO1lBQ0EsR0FBQSxRQUFBLGFBQUEsS0FBQSxHQUFBLG9CQUFBLEdBQUE7O1FBRUEsUUFBQSxRQUFBLEdBQUEsU0FBQSxVQUFBLE1BQUE7WUFDQSxJQUFBLEtBQUEsVUFBQTtnQkFDQSxRQUFBLElBQUEsS0FBQTtnQkFDQSxHQUFBLFFBQUEsT0FBQSxLQUFBLEtBQUE7Ozs7UUFJQSxRQUFBLElBQUEsR0FBQTtRQUNBLGdCQUFBLEtBQUEsR0FBQTthQUNBLEtBQUEsU0FBQSxTQUFBO2dCQUNBLGFBQUEsUUFBQSxvQkFBQSxRQUFBO2dCQUNBLGVBQUEsTUFBQTs7Ozs7O0FDdVBBIiwiZmlsZSI6InByb2plY3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhclxuICAgIC5tb2R1bGUoJ3Byb2plY3RzJywgWyduZ1JvdXRlJywgJ3VpLW5vdGlmaWNhdGlvbiddKTtcbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9qZWN0cycpXG4gICAgLmZhY3RvcnkoJ1Byb2plY3RzU2VydmljZScsIFByb2plY3RzU2VydmljZSk7XG5cbmZ1bmN0aW9uIFByb2plY3RzU2VydmljZSgkaHR0cCwgJGxvZywgUHJvamVjdHNSZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGdldFByb2plY3Q6IGdldFByb2plY3QsXG4gICAgICAgIGdldEFjdGl2ZVByb2plY3RzOiBnZXRBY3RpdmVQcm9qZWN0cyxcbiAgICAgICAgZ2V0Q3VycmVudENyaXRlcmlhOiBnZXRDdXJyZW50Q3JpdGVyaWEsXG4gICAgICAgIHNhdmU6IHNhdmUsXG4gICAgICAgIHVwZGF0ZTogdXBkYXRlXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldEN1cnJlbnRDcml0ZXJpYSgpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS92MS9wcm9qZWN0cy9jcml0ZXJpYS8nKVxuICAgICAgICAgICAgLnRoZW4oc3VjY2VzcylcbiAgICAgICAgICAgIC5jYXRjaChmYWlsKTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ2dldEN1cnJlbnRDcml0ZXJpYSBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFByb2plY3QocHJvamVjdElkKSB7XG4gICAgICAgIHJldHVybiBQcm9qZWN0c1Jlc291cmNlLmdldCh7aWQ6IHByb2plY3RJZH0sIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ2dldFByb2plY3QgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRBY3RpdmVQcm9qZWN0cygpIHtcbiAgICAgICAgcmV0dXJuIFByb2plY3RzUmVzb3VyY2UuZ2V0QWN0aXZlUHJvamVjdHMobnVsbCwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignZ2V0UHJvamVjdCBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNhdmUocHJvamVjdCkge1xuICAgICAgICByZXR1cm4gUHJvamVjdHNSZXNvdXJjZS5zYXZlKHByb2plY3QsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignc2F2ZSBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZShwcm9qZWN0KSB7XG4gICAgICAgIHJldHVybiBQcm9qZWN0c1Jlc291cmNlLnVwZGF0ZSh7aWQ6IHByb2plY3QuaWR9LCBwcm9qZWN0LCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ3VwZGF0ZSBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgncHJvamVjdHMnKVxuICAgIC5mYWN0b3J5KCdQcm9qZWN0c1Jlc291cmNlJywgUHJvamVjdHNSZXNvdXJjZSk7XG5cbmZ1bmN0aW9uIFByb2plY3RzUmVzb3VyY2UoJHJlc291cmNlKSB7XG4gICAgdmFyIGFjdGlvbnMgPSB7XG4gICAgICAgICdnZXQnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRQcm9qZWN0c0J5T3duZXInOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9wcm9qZWN0cy9vd25lZC86aWQvJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldFByb2plY3RzSU93bic6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3Byb2plY3RzL293bmVkL215LycsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRQcm9qZWN0c0J5U3BvbnNvcic6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3Byb2plY3RzL3Nwb25zb3JlZC86aWQvJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldFByb2plY3RzSVNwb25zb3InOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9wcm9qZWN0cy9zcG9uc29yZWQvbXkvJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldFByb2plY3RzQnlUZWFtTWVtYmVyJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvcHJvamVjdHMvdGVhbS1tZW1iZXIvOmlkLycsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRQcm9qZWN0c0lBbUFUZWFtTWVtYmVyJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvcHJvamVjdHMvdGVhbS1tZW1iZXIvbXkvJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldEFjdGl2ZVByb2plY3RzJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ3NhdmUnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvcHJvamVjdHMvYWRkLydcbiAgICAgICAgfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BVVCdcbiAgICAgICAgfSxcbiAgICAgICAgJ2RlbGV0ZSc6IHtcbiAgICAgICAgICAgICdtZXRob2QnOiAnREVMRVRFJ1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gJHJlc291cmNlKCcvYXBpL3YxL3Byb2plY3RzLzppZC8nLCBudWxsLCBhY3Rpb25zKTtcbn1cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9qZWN0cycpXG4gICAgLmNvbnRyb2xsZXIoJ1Byb2plY3RzQ29udHJvbGxlcicsIFByb2plY3RzQ29udHJvbGxlcik7XG5cbmZ1bmN0aW9uIFByb2plY3RzQ29udHJvbGxlcihQcm9qZWN0c1NlcnZpY2UsIE5vdGlmaWNhdGlvbiwgYW5hbHl0aWNzLCAkbG9jYXRpb24sICRtb2RhbCwgJHNjb3BlLCAkc2NlLCAkcm9vdFNjb3BlKSB7XG4gICAgLyogU2luY2UgdGhpcyBwYWdlIGNhbiBiZSB0aGUgcm9vdCBmb3Igc29tZSB1c2VycyBsZXQncyBtYWtlIHN1cmUgd2UgY2FwdHVyZSB0aGUgY29ycmVjdCBwYWdlICovXG4gICAgdmFyIGxvY2F0aW9uX3VybCA9ICRsb2NhdGlvbi51cmwoKS5pbmRleE9mKCcvcHJvamVjdHMnKSA8IDAgPyAnL3Byb2plY3RzJyA6ICRsb2NhdGlvbi51cmwoKTtcbiAgICBhbmFseXRpY3MudHJhY2tQYWdlKCRzY29wZSwgJGxvY2F0aW9uLmFic1VybCgpLCBsb2NhdGlvbl91cmwpO1xuXG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5hY3RpdmVQcm9qZWN0cyA9IFtdO1xuICAgIHZtLmFjdGl2ZVByb2plY3RzTG9hZGVkID0gZmFsc2U7XG4gICAgdm0uc2hvd0VtcHR5U2NyZWVuID0gZmFsc2U7XG4gICAgdm0ud2VsY29tZSA9ICRzY2UudHJ1c3RBc0h0bWwoJHJvb3RTY29wZS5jdXN0b21lci5wcm9qZWN0c193ZWxjb21lKTtcbiAgICB2bS5zdWJtaXRQcm9qZWN0ID0gc3VibWl0UHJvamVjdDtcblxuICAgIGFjdGl2YXRlKCk7XG5cbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgZ2V0QWN0aXZlUHJvamVjdHMoKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0QWN0aXZlUHJvamVjdHMoKSB7XG4gICAgICAgIFByb2plY3RzU2VydmljZS5nZXRBY3RpdmVQcm9qZWN0cygpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHZtLmFjdGl2ZVByb2plY3RzID0gZGF0YTtcbiAgICAgICAgICAgICAgICB2bS5hY3RpdmVQcm9qZWN0c0xvYWRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgY2hlY2tJc0VtcHR5KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZtLmFjdGl2ZVByb2plY3RzO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hlY2tJc0VtcHR5KCkge1xuICAgICAgICBpZiAodm0uYWN0aXZlUHJvamVjdHNMb2FkZWQpIHtcbiAgICAgICAgICAgIGlmICh2bS5hY3RpdmVQcm9qZWN0cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgIHZtLnNob3dFbXB0eVNjcmVlbiA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZtLnNob3dFbXB0eVNjcmVlbiA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3VibWl0UHJvamVjdCgpIHtcbiAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG4gICAgICAgICAgICBhbmltYXRpb246IHRydWUsXG4gICAgICAgICAgICB3aW5kb3dDbGFzczogJ3h4LWRpYWxvZyBmYWRlIHpvb20nLFxuICAgICAgICAgICAgYmFja2Ryb3A6ICdzdGF0aWMnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvc3RhdGljL2FuZ3VsYXIvcHJvamVjdHMvcGFydGlhbHMvX21vZGFscy9hZGQtcHJvamVjdC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBZGRQcm9qZWN0Q29udHJvbGxlciBhcyBhZGRQcm9qZWN0JyxcbiAgICAgICAgICAgIHJlc29sdmU6IHtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIChwcm9qZWN0KSB7XG4gICAgICAgICAgICAgICAgdm0uYWN0aXZlUHJvamVjdHMucHVzaChwcm9qZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbn1cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9qZWN0cycpXG4gICAgLmNvbnRyb2xsZXIoJ1Byb2plY3RDb250cm9sbGVyJywgUHJvamVjdENvbnRyb2xsZXIpO1xuXG5mdW5jdGlvbiBQcm9qZWN0Q29udHJvbGxlcihQcm9qZWN0c1NlcnZpY2UsIENvbW1lbnQsIE5vdGlmaWNhdGlvbiwgYW5hbHl0aWNzLCAkbG9jYXRpb24sICRtb2RhbCwgJHNjb3BlLCAkc2NlLCAkcm9vdFNjb3BlLCAkcm91dGVQYXJhbXMpIHtcbiAgICBhbmFseXRpY3MudHJhY2tQYWdlKCRzY29wZSwgJGxvY2F0aW9uLmFic1VybCgpLCAkbG9jYXRpb24udXJsKCkpO1xuXG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5wcm9qZWN0ID0gbnVsbDtcbiAgICB2bS5zaG93U3VtbWFyeUVkaXQgPSBmYWxzZTtcbiAgICB2bS5jb21tZW50cyA9IFtdO1xuICAgIHZtLmFkZENvbW1lbnQgPSBhZGRDb21tZW50O1xuXG4gICAgYWN0aXZhdGUoKTtcblxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICBpbml0aWFsaXplTmV3Q29tbWVudCgpO1xuICAgICAgICBnZXRQcm9qZWN0KCk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGluaXRpYWxpemVOZXdDb21tZW50KCkge1xuICAgICAgICB2bS5uZXdDb21tZW50ID0gbmV3IENvbW1lbnQoe2NvbnRlbnQ6JycsIGluY2x1ZGVfaW5fZGFpbHlfZGlnZXN0OnRydWV9KTtcbiAgICAgICAgdm0ubmV3Q29tbWVudC5leHBhbmRUZXh0QXJlYSA9IGZhbHNlO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRQcm9qZWN0KCkge1xuICAgICAgICBQcm9qZWN0c1NlcnZpY2UuZ2V0UHJvamVjdCgkcm91dGVQYXJhbXMucHJvamVjdElkKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2bS5wcm9qZWN0ID0gZGF0YTtcbiAgICAgICAgICAgICAgICB2bS5jb21tZW50cyA9IHZtLnByb2plY3QuY29tbWVudHM7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICAgICAgICAgIE5vdGlmaWNhdGlvbi5lcnJvcihcIlNvcnJ5IHdlIGhhZCBhIHByb2JsZW0gb3BlbmluZyB0aGlzIHByb2plY3QuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZENvbW1lbnQoZm9ybSkge1xuICAgICAgICBpZiAoZm9ybS4kaW52YWxpZCkgcmV0dXJuO1xuICAgICAgICBDb21tZW50LmFkZFRvUHJvamVjdCh7IGlkOiRyb3V0ZVBhcmFtcy5wcm9qZWN0SWR9LCB2bS5uZXdDb21tZW50LCBmdW5jdGlvbihjb21tZW50KSB7XG4gICAgICAgICAgICBpbml0aWFsaXplTmV3Q29tbWVudCgpO1xuICAgICAgICAgICAgdm0uY29tbWVudHMucHVzaChjb21tZW50KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn1cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9qZWN0cycpXG4gICAgLmNvbnRyb2xsZXIoJ0FkZFByb2plY3RDb250cm9sbGVyJywgQWRkUHJvamVjdENvbnRyb2xsZXIpO1xuXG5mdW5jdGlvbiBBZGRQcm9qZWN0Q29udHJvbGxlcihQcm9qZWN0c1NlcnZpY2UsIE5vdGlmaWNhdGlvbiwgRW1wbG95ZWVTZWFyY2gsICRtb2RhbEluc3RhbmNlKSB7XG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5wcm9qZWN0ID0ge1xuICAgICAgICBuYW1lOiBudWxsLFxuICAgICAgICBkZXNjcmlwdGlvbjogbnVsbCxcbiAgICAgICAgb3duZXJzOiBbXSxcbiAgICAgICAgc3BvbnNvcnM6IFtdLFxuICAgICAgICB0ZWFtX21lbWJlcnM6IFtdLFxuICAgICAgICBzY29yZXM6IFtdXG4gICAgfVxuICAgIHZtLnNlbGVjdGVkT3duZXJzID0gW107XG4gICAgdm0uc2VsZWN0ZWRTcG9uc29ycyA9IFtdO1xuICAgIHZtLnNlbGVjdGVkVGVhbU1lbWJlcnMgPSBbXTtcbiAgICB2bS5lbXBsb3llZXMgPSBbXTtcbiAgICB2bS5zdGVwTmV4dCA9IHN0ZXBOZXh0O1xuICAgIHZtLnN0ZXBCYWNrID0gc3RlcEJhY2s7XG4gICAgdm0uY2FuY2VsID0gY2FuY2VsO1xuICAgIHZtLnNhdmUgPSBzYXZlO1xuICAgIHZtLnBhbmVsX2luZGV4ID0gMDtcbiAgICB2bS5ydWxlU2V0ID0gW107XG5cbiAgICBhY3RpdmF0ZSgpXG5cbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgZ2V0RW1wbG95ZWVzKCk7XG4gICAgICAgIGdldENyaXRlcmlhKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Q3JpdGVyaWEoKSB7XG4gICAgICAgIFByb2plY3RzU2VydmljZS5nZXRDdXJyZW50Q3JpdGVyaWEoKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2bS5ydWxlU2V0ID0gZGF0YS5jcml0ZXJpYTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdm0ucnVsZVNldDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RW1wbG95ZWVzKCkge1xuICAgICAgICBFbXBsb3llZVNlYXJjaC5xdWVyeShmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgdm0uZW1wbG95ZWVzID0gZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RlcE5leHQoKSB7XG4gICAgICAgIHZtLnBhbmVsX2luZGV4Kys7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RlcEJhY2soKSB7XG4gICAgICAgIHZtLnBhbmVsX2luZGV4LS07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2F2ZSgpIHtcbiAgICAgICAgZm9yKHZhciBpPTA7IGkgPCB2bS5zZWxlY3RlZE93bmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdm0ucHJvamVjdC5vd25lcnMucHVzaCh2bS5zZWxlY3RlZE93bmVyc1tpXS5wayk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yKHZhciBpPTA7IGkgPCB2bS5zZWxlY3RlZFNwb25zb3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2bS5wcm9qZWN0LnNwb25zb3JzLnB1c2godm0uc2VsZWN0ZWRTcG9uc29yc1tpXS5wayk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yKHZhciBpPTA7IGkgPCB2bS5zZWxlY3RlZFRlYW1NZW1iZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2bS5wcm9qZWN0LnRlYW1fbWVtYmVycy5wdXNoKHZtLnNlbGVjdGVkVGVhbU1lbWJlcnNbaV0ucGspO1xuICAgICAgICB9XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5ydWxlU2V0LCBmdW5jdGlvbiAocnVsZSkge1xuICAgICAgICAgICAgaWYgKHJ1bGUuc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhydWxlLnNlbGVjdGVkKTtcbiAgICAgICAgICAgICAgICB2bS5wcm9qZWN0LnNjb3Jlcy5wdXNoKHJ1bGUuc2VsZWN0ZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zb2xlLmxvZyh2bS5wcm9qZWN0KTtcbiAgICAgICAgUHJvamVjdHNTZXJ2aWNlLnNhdmUodm0ucHJvamVjdClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHByb2plY3QpIHtcbiAgICAgICAgICAgICAgICBOb3RpZmljYXRpb24uc3VjY2VzcygnJXMgd2FzIGNyZWF0ZWQuJyAlIHByb2plY3QubmFtZSlcbiAgICAgICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZShwcm9qZWN0KVxuICAgICAgICB9KTtcbiAgICB9XG59IiwiOyhmdW5jdGlvbigpIHtcblwidXNlIHN0cmljdFwiO1xuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgncHJvamVjdHMnLCBbJ25nUm91dGUnLCAndWktbm90aWZpY2F0aW9uJ10pO1xuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgncHJvamVjdHMnKVxuICAgIC5mYWN0b3J5KCdQcm9qZWN0c1NlcnZpY2UnLCBQcm9qZWN0c1NlcnZpY2UpO1xuXG5mdW5jdGlvbiBQcm9qZWN0c1NlcnZpY2UoJGh0dHAsICRsb2csIFByb2plY3RzUmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRQcm9qZWN0OiBnZXRQcm9qZWN0LFxuICAgICAgICBnZXRBY3RpdmVQcm9qZWN0czogZ2V0QWN0aXZlUHJvamVjdHMsXG4gICAgICAgIGdldEN1cnJlbnRDcml0ZXJpYTogZ2V0Q3VycmVudENyaXRlcmlhLFxuICAgICAgICBzYXZlOiBzYXZlLFxuICAgICAgICB1cGRhdGU6IHVwZGF0ZVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRDdXJyZW50Q3JpdGVyaWEoKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdjEvcHJvamVjdHMvY3JpdGVyaWEvJylcbiAgICAgICAgICAgIC50aGVuKHN1Y2Nlc3MpXG4gICAgICAgICAgICAuY2F0Y2goZmFpbCk7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdnZXRDdXJyZW50Q3JpdGVyaWEgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQcm9qZWN0KHByb2plY3RJZCkge1xuICAgICAgICByZXR1cm4gUHJvamVjdHNSZXNvdXJjZS5nZXQoe2lkOiBwcm9qZWN0SWR9LCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdnZXRQcm9qZWN0IGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QWN0aXZlUHJvamVjdHMoKSB7XG4gICAgICAgIHJldHVybiBQcm9qZWN0c1Jlc291cmNlLmdldEFjdGl2ZVByb2plY3RzKG51bGwsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ2dldFByb2plY3QgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzYXZlKHByb2plY3QpIHtcbiAgICAgICAgcmV0dXJuIFByb2plY3RzUmVzb3VyY2Uuc2F2ZShwcm9qZWN0LCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ3NhdmUgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGUocHJvamVjdCkge1xuICAgICAgICByZXR1cm4gUHJvamVjdHNSZXNvdXJjZS51cGRhdGUoe2lkOiBwcm9qZWN0LmlkfSwgcHJvamVjdCwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCd1cGRhdGUgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5hbmd1bGFyXG4gICAgLm1vZHVsZSgncHJvamVjdHMnKVxuICAgIC5mYWN0b3J5KCdQcm9qZWN0c1Jlc291cmNlJywgUHJvamVjdHNSZXNvdXJjZSk7XG5cbmZ1bmN0aW9uIFByb2plY3RzUmVzb3VyY2UoJHJlc291cmNlKSB7XG4gICAgdmFyIGFjdGlvbnMgPSB7XG4gICAgICAgICdnZXQnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRQcm9qZWN0c0J5T3duZXInOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9wcm9qZWN0cy9vd25lZC86aWQvJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldFByb2plY3RzSU93bic6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3Byb2plY3RzL293bmVkL215LycsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRQcm9qZWN0c0J5U3BvbnNvcic6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3Byb2plY3RzL3Nwb25zb3JlZC86aWQvJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldFByb2plY3RzSVNwb25zb3InOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9wcm9qZWN0cy9zcG9uc29yZWQvbXkvJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldFByb2plY3RzQnlUZWFtTWVtYmVyJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvcHJvamVjdHMvdGVhbS1tZW1iZXIvOmlkLycsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRQcm9qZWN0c0lBbUFUZWFtTWVtYmVyJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvcHJvamVjdHMvdGVhbS1tZW1iZXIvbXkvJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldEFjdGl2ZVByb2plY3RzJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ3NhdmUnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvcHJvamVjdHMvYWRkLydcbiAgICAgICAgfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BVVCdcbiAgICAgICAgfSxcbiAgICAgICAgJ2RlbGV0ZSc6IHtcbiAgICAgICAgICAgICdtZXRob2QnOiAnREVMRVRFJ1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gJHJlc291cmNlKCcvYXBpL3YxL3Byb2plY3RzLzppZC8nLCBudWxsLCBhY3Rpb25zKTtcbn1cblxuYW5ndWxhclxuICAgIC5tb2R1bGUoJ3Byb2plY3RzJylcbiAgICAuY29udHJvbGxlcignUHJvamVjdHNDb250cm9sbGVyJywgUHJvamVjdHNDb250cm9sbGVyKTtcblxuZnVuY3Rpb24gUHJvamVjdHNDb250cm9sbGVyKFByb2plY3RzU2VydmljZSwgTm90aWZpY2F0aW9uLCBhbmFseXRpY3MsICRsb2NhdGlvbiwgJG1vZGFsLCAkc2NvcGUsICRzY2UsICRyb290U2NvcGUpIHtcbiAgICAvKiBTaW5jZSB0aGlzIHBhZ2UgY2FuIGJlIHRoZSByb290IGZvciBzb21lIHVzZXJzIGxldCdzIG1ha2Ugc3VyZSB3ZSBjYXB0dXJlIHRoZSBjb3JyZWN0IHBhZ2UgKi9cbiAgICB2YXIgbG9jYXRpb25fdXJsID0gJGxvY2F0aW9uLnVybCgpLmluZGV4T2YoJy9wcm9qZWN0cycpIDwgMCA/ICcvcHJvamVjdHMnIDogJGxvY2F0aW9uLnVybCgpO1xuICAgIGFuYWx5dGljcy50cmFja1BhZ2UoJHNjb3BlLCAkbG9jYXRpb24uYWJzVXJsKCksIGxvY2F0aW9uX3VybCk7XG5cbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLmFjdGl2ZVByb2plY3RzID0gW107XG4gICAgdm0uYWN0aXZlUHJvamVjdHNMb2FkZWQgPSBmYWxzZTtcbiAgICB2bS5zaG93RW1wdHlTY3JlZW4gPSBmYWxzZTtcbiAgICB2bS53ZWxjb21lID0gJHNjZS50cnVzdEFzSHRtbCgkcm9vdFNjb3BlLmN1c3RvbWVyLnByb2plY3RzX3dlbGNvbWUpO1xuICAgIHZtLnN1Ym1pdFByb2plY3QgPSBzdWJtaXRQcm9qZWN0O1xuXG4gICAgYWN0aXZhdGUoKTtcblxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICBnZXRBY3RpdmVQcm9qZWN0cygpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRBY3RpdmVQcm9qZWN0cygpIHtcbiAgICAgICAgUHJvamVjdHNTZXJ2aWNlLmdldEFjdGl2ZVByb2plY3RzKClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdm0uYWN0aXZlUHJvamVjdHMgPSBkYXRhO1xuICAgICAgICAgICAgICAgIHZtLmFjdGl2ZVByb2plY3RzTG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjaGVja0lzRW1wdHkoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdm0uYWN0aXZlUHJvamVjdHM7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGVja0lzRW1wdHkoKSB7XG4gICAgICAgIGlmICh2bS5hY3RpdmVQcm9qZWN0c0xvYWRlZCkge1xuICAgICAgICAgICAgaWYgKHZtLmFjdGl2ZVByb2plY3RzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgdm0uc2hvd0VtcHR5U2NyZWVuID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdm0uc2hvd0VtcHR5U2NyZWVuID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdWJtaXRQcm9qZWN0KCkge1xuICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIHdpbmRvd0NsYXNzOiAneHgtZGlhbG9nIGZhZGUgem9vbScsXG4gICAgICAgICAgICBiYWNrZHJvcDogJ3N0YXRpYycsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9zdGF0aWMvYW5ndWxhci9wcm9qZWN0cy9wYXJ0aWFscy9fbW9kYWxzL2FkZC1wcm9qZWN0Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0FkZFByb2plY3RDb250cm9sbGVyIGFzIGFkZFByb2plY3QnLFxuICAgICAgICAgICAgcmVzb2x2ZToge1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKFxuICAgICAgICAgICAgZnVuY3Rpb24gKHByb2plY3QpIHtcbiAgICAgICAgICAgICAgICB2bS5hY3RpdmVQcm9qZWN0cy5wdXNoKHByb2plY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxufVxuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgncHJvamVjdHMnKVxuICAgIC5jb250cm9sbGVyKCdQcm9qZWN0Q29udHJvbGxlcicsIFByb2plY3RDb250cm9sbGVyKTtcblxuZnVuY3Rpb24gUHJvamVjdENvbnRyb2xsZXIoUHJvamVjdHNTZXJ2aWNlLCBDb21tZW50LCBOb3RpZmljYXRpb24sIGFuYWx5dGljcywgJGxvY2F0aW9uLCAkbW9kYWwsICRzY29wZSwgJHNjZSwgJHJvb3RTY29wZSwgJHJvdXRlUGFyYW1zKSB7XG4gICAgYW5hbHl0aWNzLnRyYWNrUGFnZSgkc2NvcGUsICRsb2NhdGlvbi5hYnNVcmwoKSwgJGxvY2F0aW9uLnVybCgpKTtcblxuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0ucHJvamVjdCA9IG51bGw7XG4gICAgdm0uc2hvd1N1bW1hcnlFZGl0ID0gZmFsc2U7XG4gICAgdm0uY29tbWVudHMgPSBbXTtcbiAgICB2bS5hZGRDb21tZW50ID0gYWRkQ29tbWVudDtcblxuICAgIGFjdGl2YXRlKCk7XG5cbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgaW5pdGlhbGl6ZU5ld0NvbW1lbnQoKTtcbiAgICAgICAgZ2V0UHJvamVjdCgpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBpbml0aWFsaXplTmV3Q29tbWVudCgpIHtcbiAgICAgICAgdm0ubmV3Q29tbWVudCA9IG5ldyBDb21tZW50KHtjb250ZW50OicnLCBpbmNsdWRlX2luX2RhaWx5X2RpZ2VzdDp0cnVlfSk7XG4gICAgICAgIHZtLm5ld0NvbW1lbnQuZXhwYW5kVGV4dEFyZWEgPSBmYWxzZTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0UHJvamVjdCgpIHtcbiAgICAgICAgUHJvamVjdHNTZXJ2aWNlLmdldFByb2plY3QoJHJvdXRlUGFyYW1zLnByb2plY3RJZClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdm0ucHJvamVjdCA9IGRhdGE7XG4gICAgICAgICAgICAgICAgdm0uY29tbWVudHMgPSB2bS5wcm9qZWN0LmNvbW1lbnRzO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3Ipe1xuICAgICAgICAgICAgICAgICAgICBOb3RpZmljYXRpb24uZXJyb3IoXCJTb3JyeSB3ZSBoYWQgYSBwcm9ibGVtIG9wZW5pbmcgdGhpcyBwcm9qZWN0LlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRDb21tZW50KGZvcm0pIHtcbiAgICAgICAgaWYgKGZvcm0uJGludmFsaWQpIHJldHVybjtcbiAgICAgICAgQ29tbWVudC5hZGRUb1Byb2plY3QoeyBpZDokcm91dGVQYXJhbXMucHJvamVjdElkfSwgdm0ubmV3Q29tbWVudCwgZnVuY3Rpb24oY29tbWVudCkge1xuICAgICAgICAgICAgaW5pdGlhbGl6ZU5ld0NvbW1lbnQoKTtcbiAgICAgICAgICAgIHZtLmNvbW1lbnRzLnB1c2goY29tbWVudCk7XG4gICAgICAgIH0pO1xuICAgIH07XG59XG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9qZWN0cycpXG4gICAgLmNvbnRyb2xsZXIoJ0FkZFByb2plY3RDb250cm9sbGVyJywgQWRkUHJvamVjdENvbnRyb2xsZXIpO1xuXG5mdW5jdGlvbiBBZGRQcm9qZWN0Q29udHJvbGxlcihQcm9qZWN0c1NlcnZpY2UsIE5vdGlmaWNhdGlvbiwgRW1wbG95ZWVTZWFyY2gsICRtb2RhbEluc3RhbmNlKSB7XG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5wcm9qZWN0ID0ge1xuICAgICAgICBuYW1lOiBudWxsLFxuICAgICAgICBkZXNjcmlwdGlvbjogbnVsbCxcbiAgICAgICAgb3duZXJzOiBbXSxcbiAgICAgICAgc3BvbnNvcnM6IFtdLFxuICAgICAgICB0ZWFtX21lbWJlcnM6IFtdLFxuICAgICAgICBzY29yZXM6IFtdXG4gICAgfVxuICAgIHZtLnNlbGVjdGVkT3duZXJzID0gW107XG4gICAgdm0uc2VsZWN0ZWRTcG9uc29ycyA9IFtdO1xuICAgIHZtLnNlbGVjdGVkVGVhbU1lbWJlcnMgPSBbXTtcbiAgICB2bS5lbXBsb3llZXMgPSBbXTtcbiAgICB2bS5zdGVwTmV4dCA9IHN0ZXBOZXh0O1xuICAgIHZtLnN0ZXBCYWNrID0gc3RlcEJhY2s7XG4gICAgdm0uY2FuY2VsID0gY2FuY2VsO1xuICAgIHZtLnNhdmUgPSBzYXZlO1xuICAgIHZtLnBhbmVsX2luZGV4ID0gMDtcbiAgICB2bS5ydWxlU2V0ID0gW107XG5cbiAgICBhY3RpdmF0ZSgpXG5cbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgZ2V0RW1wbG95ZWVzKCk7XG4gICAgICAgIGdldENyaXRlcmlhKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Q3JpdGVyaWEoKSB7XG4gICAgICAgIFByb2plY3RzU2VydmljZS5nZXRDdXJyZW50Q3JpdGVyaWEoKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2bS5ydWxlU2V0ID0gZGF0YS5jcml0ZXJpYTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdm0ucnVsZVNldDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RW1wbG95ZWVzKCkge1xuICAgICAgICBFbXBsb3llZVNlYXJjaC5xdWVyeShmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgdm0uZW1wbG95ZWVzID0gZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RlcE5leHQoKSB7XG4gICAgICAgIHZtLnBhbmVsX2luZGV4Kys7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RlcEJhY2soKSB7XG4gICAgICAgIHZtLnBhbmVsX2luZGV4LS07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2F2ZSgpIHtcbiAgICAgICAgZm9yKHZhciBpPTA7IGkgPCB2bS5zZWxlY3RlZE93bmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdm0ucHJvamVjdC5vd25lcnMucHVzaCh2bS5zZWxlY3RlZE93bmVyc1tpXS5wayk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yKHZhciBpPTA7IGkgPCB2bS5zZWxlY3RlZFNwb25zb3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2bS5wcm9qZWN0LnNwb25zb3JzLnB1c2godm0uc2VsZWN0ZWRTcG9uc29yc1tpXS5wayk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yKHZhciBpPTA7IGkgPCB2bS5zZWxlY3RlZFRlYW1NZW1iZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2bS5wcm9qZWN0LnRlYW1fbWVtYmVycy5wdXNoKHZtLnNlbGVjdGVkVGVhbU1lbWJlcnNbaV0ucGspO1xuICAgICAgICB9XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5ydWxlU2V0LCBmdW5jdGlvbiAocnVsZSkge1xuICAgICAgICAgICAgaWYgKHJ1bGUuc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhydWxlLnNlbGVjdGVkKTtcbiAgICAgICAgICAgICAgICB2bS5wcm9qZWN0LnNjb3Jlcy5wdXNoKHJ1bGUuc2VsZWN0ZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zb2xlLmxvZyh2bS5wcm9qZWN0KTtcbiAgICAgICAgUHJvamVjdHNTZXJ2aWNlLnNhdmUodm0ucHJvamVjdClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHByb2plY3QpIHtcbiAgICAgICAgICAgICAgICBOb3RpZmljYXRpb24uc3VjY2VzcygnJXMgd2FzIGNyZWF0ZWQuJyAlIHByb2plY3QubmFtZSlcbiAgICAgICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZShwcm9qZWN0KVxuICAgICAgICB9KTtcbiAgICB9XG59XG59KCkpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
