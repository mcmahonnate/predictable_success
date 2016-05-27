;(function() {
"use strict";

ProjectsService.$inject = ["$http", "$log", "ProjectsResource"];
ProjectsResource.$inject = ["$resource"];
ProjectsController.$inject = ["ProjectsService", "Notification", "analytics", "$location", "$modal", "$scope", "$sce", "$rootScope"];
ProjectController.$inject = ["ProjectsService", "Comment", "Notification", "analytics", "$location", "$modal", "$scope", "$sce", "$rootScope", "$routeParams"];
AddProjectController.$inject = ["project", "ProjectsService", "Notification", "EmployeeSearch", "$modalInstance"];
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
        console.log(project);
        return ProjectsResource.update({id: project.id}, project, success, fail).$promise;

        function success(response) {
            return response.data;
        }

        function fail(response) {
            $log.error('update failed');
        }
    }
}
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
            method: 'PUT',
            url: '/api/v1/projects/:id/update/'
        },
        'delete': {
            'method': 'DELETE'
        }
    };
    return $resource('/api/v1/projects/:id/', null, actions);
}

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

angular
    .module('projects')
    .controller('AddProjectController', AddProjectController);

function AddProjectController(project, ProjectsService, Notification, EmployeeSearch, $modalInstance) {
    var vm = this;
    vm.project = {
        name: null,
        description: '',
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
    vm.categories = [];

    activate()

    function activate() {
        if (project) {
            loadProject();
        }
        getEmployees();
        getCriteria();
    }

    function loadProject() {
        vm.project = angular.copy(project);
        vm.selectedOwners = angular.copy(project.owners);
        vm.selectedSponsors = angular.copy(project.sponsors);
        vm.selectedTeamMembers = angular.copy(project.team_members);
        vm.project.owners = [];
        vm.project.sponsors = [];
        vm.project.team_members = [];
    }

    function getCriteria() {
        ProjectsService.getCurrentCriteria()
            .then(function (data) {
                vm.categories = data.categories;
                if (vm.project.scores) {
                    angular.forEach(vm.categories, function (category) {
                        angular.forEach(category.criteria, function(criteria){
                            angular.forEach(vm.project.scores, function (score) {
                                if (criteria.id == score.criteria_id) {
                                    criteria.selected = score.id;
                                }
                            });
                       });
                    });
                    vm.project.scores = [];
                }
                return vm.categories;
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
            var pk = vm.selectedOwners[i].pk ? vm.selectedOwners[i].pk : vm.selectedOwners[i].id;
            vm.project.owners.push(pk);
        }
        for(var i=0; i < vm.selectedSponsors.length; i++) {
            var pk = vm.selectedSponsors[i].pk ? vm.selectedSponsors[i].pk : vm.selectedSponsors[i].id
            vm.project.sponsors.push(pk);
        }
        for(var i=0; i < vm.selectedTeamMembers.length; i++) {
            var pk = vm.selectedTeamMembers[i].pk ? vm.selectedTeamMembers[i].pk : vm.selectedTeamMembers[i].id;
            vm.project.team_members.push(pk);
        }
        angular.forEach(vm.categories, function (category) {

          angular.forEach(category.criteria, function(criteria){
            if (criteria.selected){

                vm.project.scores.push(criteria.selected);
            }
           });

        });
        if (vm.project.id) {
            ProjectsService.update(vm.project)
                .then(function (project) {
                    Notification.success(project.name + ' was saved.')
                    $modalInstance.close(project)
                });
        } else {
            ProjectsService.save(vm.project)
                .then(function (project) {
                    Notification.success(project.name + ' was created.')
                    $modalInstance.close(project)
                });
        }
    }
}
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2plY3RzLm1vZHVsZS5qcyIsInByb2plY3RzLnNlcnZpY2UuanMiLCJwcm9qZWN0cy5yZXNvdXJjZS5qcyIsInByb2plY3RzLmNvbnRyb2xsZXIuanMiLCJwcm9qZWN0LmNvbnRyb2xsZXIuanMiLCJhZGQtcHJvamVjdC5jb250cm9sbGVyLmpzIiwicHJvamVjdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxDQUFBLFdBQUE7QUFDQTs7Ozs7OztBQ0RBO0tBQ0EsT0FBQSxZQUFBLENBQUEsV0FBQTs7QUFFQTtLQUNBLE9BQUE7S0FDQSxRQUFBLG1CQUFBOztBQUVBLFNBQUEsZ0JBQUEsT0FBQSxNQUFBLGtCQUFBO0lBQ0EsT0FBQTtRQUNBLFlBQUE7UUFDQSxtQkFBQTtRQUNBLG9CQUFBO1FBQ0EsTUFBQTtRQUNBLFFBQUE7OztJQUdBLFNBQUEscUJBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQTthQUNBLEtBQUE7YUFDQSxNQUFBOztRQUVBLFNBQUEsUUFBQSxVQUFBO1lBQ0EsT0FBQSxTQUFBOzs7UUFHQSxTQUFBLEtBQUEsVUFBQTtZQUNBLEtBQUEsTUFBQTs7OztJQUlBLFNBQUEsV0FBQSxXQUFBO1FBQ0EsT0FBQSxpQkFBQSxJQUFBLENBQUEsSUFBQSxZQUFBLFNBQUEsTUFBQTs7UUFFQSxTQUFBLFFBQUEsVUFBQTtZQUNBLE9BQUE7OztRQUdBLFNBQUEsS0FBQSxVQUFBO1lBQ0EsS0FBQSxNQUFBOzs7O0lBSUEsU0FBQSxvQkFBQTtRQUNBLE9BQUEsaUJBQUEsa0JBQUEsTUFBQSxTQUFBLE1BQUE7O1FBRUEsU0FBQSxRQUFBLFVBQUE7WUFDQSxPQUFBOzs7UUFHQSxTQUFBLEtBQUEsVUFBQTtZQUNBLEtBQUEsTUFBQTs7OztJQUlBLFNBQUEsS0FBQSxTQUFBO1FBQ0EsT0FBQSxpQkFBQSxLQUFBLFNBQUEsU0FBQSxNQUFBOztRQUVBLFNBQUEsUUFBQSxVQUFBO1lBQ0EsT0FBQSxTQUFBOzs7UUFHQSxTQUFBLEtBQUEsVUFBQTtZQUNBLEtBQUEsTUFBQTs7OztJQUlBLFNBQUEsT0FBQSxTQUFBO1FBQ0EsUUFBQSxJQUFBO1FBQ0EsT0FBQSxpQkFBQSxPQUFBLENBQUEsSUFBQSxRQUFBLEtBQUEsU0FBQSxTQUFBLE1BQUE7O1FBRUEsU0FBQSxRQUFBLFVBQUE7WUFDQSxPQUFBLFNBQUE7OztRQUdBLFNBQUEsS0FBQSxVQUFBO1lBQ0EsS0FBQSxNQUFBOzs7O0FDeEVBO0tBQ0EsT0FBQTtLQUNBLFFBQUEsb0JBQUE7O0FBRUEsU0FBQSxpQkFBQSxXQUFBO0lBQ0EsSUFBQSxVQUFBO1FBQ0EsT0FBQTtZQUNBLFFBQUE7O1FBRUEsc0JBQUE7WUFDQSxRQUFBO1lBQ0EsS0FBQTtZQUNBLFNBQUE7O1FBRUEsbUJBQUE7WUFDQSxRQUFBO1lBQ0EsS0FBQTtZQUNBLFNBQUE7O1FBRUEsd0JBQUE7WUFDQSxRQUFBO1lBQ0EsS0FBQTtZQUNBLFNBQUE7O1FBRUEsdUJBQUE7WUFDQSxRQUFBO1lBQ0EsS0FBQTtZQUNBLFNBQUE7O1FBRUEsMkJBQUE7WUFDQSxRQUFBO1lBQ0EsS0FBQTtZQUNBLFNBQUE7O1FBRUEsNkJBQUE7WUFDQSxRQUFBO1lBQ0EsS0FBQTtZQUNBLFNBQUE7O1FBRUEscUJBQUE7WUFDQSxRQUFBO1lBQ0EsU0FBQTs7UUFFQSxRQUFBO1lBQ0EsUUFBQTtZQUNBLEtBQUE7O1FBRUEsVUFBQTtZQUNBLFFBQUE7WUFDQSxLQUFBOztRQUVBLFVBQUE7WUFDQSxVQUFBOzs7SUN2REEsT0FBQSxVQUFBLHlCQUFBLE1BQUE7OztBQUdBO0tBQ0EsT0FBQTtLQUNBLFdBQUEsc0JBQUE7O0FBRUEsU0FBQSxtQkFBQSxpQkFBQSxjQUFBLFdBQUEsV0FBQSxRQUFBLFFBQUEsTUFBQSxZQUFBOztJQUVBLElBQUEsZUFBQSxVQUFBLE1BQUEsUUFBQSxlQUFBLElBQUEsY0FBQSxVQUFBO0lBQ0EsVUFBQSxVQUFBLFFBQUEsVUFBQSxVQUFBOztJQUVBLElBQUEsS0FBQTtJQUNBLEdBQUEsaUJBQUE7SUFDQSxHQUFBLHVCQUFBO0lBQ0EsR0FB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QTtRQUNBLEdBQUEsUUFBQSxXQUFBO1FBQ0EsR0FBQSxRQUFBLGVBQUE7OztJQUdBLFNBQUEsY0FBQTtRQUNBLGdCQUFBO2FBQ0EsS0FBQSxVQUFBLE1BQUE7Z0JBQ0EsR0FBQSxhQUFBLEtBQUE7Z0JBQ0EsSUFBQSxHQUFBLFFBQUEsUUFBQTtvQkFDQSxRQUFBLFFBQUEsR0FBQSxZQUFBLFVBQUEsVUFBQTt3QkFDQSxRQUFBLFFBQUEsU0FBQSxVQUFBLFNBQUEsU0FBQTs0QkFDQSxRQUFBLFFBQUEsR0FBQSxRQUFBLFFBQUEsVUFBQSxPQUFBO2dDQUNBLElBQUEsU0FBQSxNQUFBLE1BQUEsYUFBQTtvQ0FDQSxTQUFBLFdBQUEsTUFBQTs7Ozs7b0JBS0EsR0FBQSxRQUFBLFNBQUE7O2dCQUVBLE9BQUEsR0FBQTs7OztJQUlBLFNBQUEsZUFBQTtRQUNBLGVBQUEsTUFBQSxTQUFBLE1BQUE7Z0JBQ0EsR0FBQSxZQUFBOzs7O0lBSUEsU0FBQSxXQUFBO1FBQ0EsR0FBQTs7O0lBR0EsU0FBQSxXQUFBO1FBQ0EsR0FBQTs7O0lBR0EsU0FBQSxTQUFBO1FBQ0EsZUFBQTs7O0lBR0EsU0FBQSxPQUFBO1FBQ0EsSUFBQSxJQUFBLEVBQUEsR0FBQSxJQUFBLEdBQUEsZUFBQSxRQUFBLEtBQUE7WUFDQSxJQUFBLEtBQUEsR0FBQSxlQUFBLEdBQUEsS0FBQSxHQUFBLGVBQUEsR0FBQSxLQUFBLEdBQUEsZUFBQSxHQUFBO1lBQ0EsR0FBQSxRQUFBLE9BQUEsS0FBQTs7UUFFQSxJQUFBLElBQUEsRUFBQSxHQUFBLElBQUEsR0FBQSxpQkFBQSxRQUFBLEtBQUE7WUFDQSxJQUFBLEtBQUEsR0FBQSxpQkFBQSxHQUFBLEtBQUEsR0FBQSxpQkFBQSxHQUFBLEtBQUEsR0FBQSxpQkFBQSxHQUFBO1lBQ0EsR0FBQSxRQUFBLFNBQUEsS0FBQTs7UUFFQSxJQUFBLElBQUEsRUFBQSxHQUFBLElBQUEsR0FBQSxvQkFBQSxRQUFBLEtBQUE7WUFDQSxJQUFBLEtBQUEsR0FBQSxvQkFBQSxHQUFBLEtBQUEsR0FBQSxvQkFBQSxHQUFBLEtBQUEsR0FBQSxvQkFBQSxHQUFBO1lBQ0EsR0FBQSxRQUFBLGFBQUEsS0FBQTs7UUFFQSxRQUFBLFFBQUEsR0FBQSxZQUFBLFVBQUEsVUFBQTs7VUFFQSxRQUFBLFFBQUEsU0FBQSxVQUFBLFNBQUEsU0FBQTtZQUNBLElBQUEsU0FBQSxTQUFBOztnQkFFQSxHQUFBLFFBQUEsT0FBQSxLQUFBLFNBQUE7Ozs7O1FBS0EsSUFBQSxHQUFBLFFBQUEsSUFBQTtZQUNBLGdCQUFBLE9BQUEsR0FBQTtpQkFDQSxLQUFBLFVBQUEsU0FBQTtvQkFDQSxhQUFBLFFBQUEsUUFBQSxPQUFBO29CQUNBLGVBQUEsTUFBQTs7ZUFFQTtZQUNBLGdCQUFBLEtBQUEsR0FBQTtpQkFDQSxLQUFBLFVBQUEsU0FBQTtvQkFDQSxhQUFBLFFBQUEsUUFBQSxPQUFBO29CQUNBLGVBQUEsTUFBQTs7Ozs7O0FDaVJBIiwiZmlsZSI6InByb2plY3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhclxuICAgIC5tb2R1bGUoJ3Byb2plY3RzJywgWyduZ1JvdXRlJywgJ3VpLW5vdGlmaWNhdGlvbiddKTtcbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9qZWN0cycpXG4gICAgLmZhY3RvcnkoJ1Byb2plY3RzU2VydmljZScsIFByb2plY3RzU2VydmljZSk7XG5cbmZ1bmN0aW9uIFByb2plY3RzU2VydmljZSgkaHR0cCwgJGxvZywgUHJvamVjdHNSZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGdldFByb2plY3Q6IGdldFByb2plY3QsXG4gICAgICAgIGdldEFjdGl2ZVByb2plY3RzOiBnZXRBY3RpdmVQcm9qZWN0cyxcbiAgICAgICAgZ2V0Q3VycmVudENyaXRlcmlhOiBnZXRDdXJyZW50Q3JpdGVyaWEsXG4gICAgICAgIHNhdmU6IHNhdmUsXG4gICAgICAgIHVwZGF0ZTogdXBkYXRlXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldEN1cnJlbnRDcml0ZXJpYSgpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS92MS9wcm9qZWN0cy9jcml0ZXJpYS8nKVxuICAgICAgICAgICAgLnRoZW4oc3VjY2VzcylcbiAgICAgICAgICAgIC5jYXRjaChmYWlsKTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ2dldEN1cnJlbnRDcml0ZXJpYSBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFByb2plY3QocHJvamVjdElkKSB7XG4gICAgICAgIHJldHVybiBQcm9qZWN0c1Jlc291cmNlLmdldCh7aWQ6IHByb2plY3RJZH0sIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ2dldFByb2plY3QgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRBY3RpdmVQcm9qZWN0cygpIHtcbiAgICAgICAgcmV0dXJuIFByb2plY3RzUmVzb3VyY2UuZ2V0QWN0aXZlUHJvamVjdHMobnVsbCwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignZ2V0UHJvamVjdCBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNhdmUocHJvamVjdCkge1xuICAgICAgICByZXR1cm4gUHJvamVjdHNSZXNvdXJjZS5zYXZlKHByb2plY3QsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignc2F2ZSBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZShwcm9qZWN0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHByb2plY3QpO1xuICAgICAgICByZXR1cm4gUHJvamVjdHNSZXNvdXJjZS51cGRhdGUoe2lkOiBwcm9qZWN0LmlkfSwgcHJvamVjdCwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCd1cGRhdGUgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ3Byb2plY3RzJylcbiAgICAuZmFjdG9yeSgnUHJvamVjdHNSZXNvdXJjZScsIFByb2plY3RzUmVzb3VyY2UpO1xuXG5mdW5jdGlvbiBQcm9qZWN0c1Jlc291cmNlKCRyZXNvdXJjZSkge1xuICAgIHZhciBhY3Rpb25zID0ge1xuICAgICAgICAnZ2V0Jzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJ1xuICAgICAgICB9LFxuICAgICAgICAnZ2V0UHJvamVjdHNCeU93bmVyJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvcHJvamVjdHMvb3duZWQvOmlkLycsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRQcm9qZWN0c0lPd24nOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9wcm9qZWN0cy9vd25lZC9teS8nLFxuICAgICAgICAgICAgaXNBcnJheTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICAnZ2V0UHJvamVjdHNCeVNwb25zb3InOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9wcm9qZWN0cy9zcG9uc29yZWQvOmlkLycsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRQcm9qZWN0c0lTcG9uc29yJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvcHJvamVjdHMvc3BvbnNvcmVkL215LycsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRQcm9qZWN0c0J5VGVhbU1lbWJlcic6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3Byb2plY3RzL3RlYW0tbWVtYmVyLzppZC8nLFxuICAgICAgICAgICAgaXNBcnJheTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICAnZ2V0UHJvamVjdHNJQW1BVGVhbU1lbWJlcic6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3Byb2plY3RzL3RlYW0tbWVtYmVyL215LycsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRBY3RpdmVQcm9qZWN0cyc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdzYXZlJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3Byb2plY3RzL2FkZC8nXG4gICAgICAgIH0sXG4gICAgICAgICd1cGRhdGUnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9wcm9qZWN0cy86aWQvdXBkYXRlLydcbiAgICAgICAgfSxcbiAgICAgICAgJ2RlbGV0ZSc6IHtcbiAgICAgICAgICAgICdtZXRob2QnOiAnREVMRVRFJ1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gJHJlc291cmNlKCcvYXBpL3YxL3Byb2plY3RzLzppZC8nLCBudWxsLCBhY3Rpb25zKTtcbn1cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9qZWN0cycpXG4gICAgLmNvbnRyb2xsZXIoJ1Byb2plY3RzQ29udHJvbGxlcicsIFByb2plY3RzQ29udHJvbGxlcik7XG5cbmZ1bmN0aW9uIFByb2plY3RzQ29udHJvbGxlcihQcm9qZWN0c1NlcnZpY2UsIE5vdGlmaWNhdGlvbiwgYW5hbHl0aWNzLCAkbG9jYXRpb24sICRtb2RhbCwgJHNjb3BlLCAkc2NlLCAkcm9vdFNjb3BlKSB7XG4gICAgLyogU2luY2UgdGhpcyBwYWdlIGNhbiBiZSB0aGUgcm9vdCBmb3Igc29tZSB1c2VycyBsZXQncyBtYWtlIHN1cmUgd2UgY2FwdHVyZSB0aGUgY29ycmVjdCBwYWdlICovXG4gICAgdmFyIGxvY2F0aW9uX3VybCA9ICRsb2NhdGlvbi51cmwoKS5pbmRleE9mKCcvcHJvamVjdHMnKSA8IDAgPyAnL3Byb2plY3RzJyA6ICRsb2NhdGlvbi51cmwoKTtcbiAgICBhbmFseXRpY3MudHJhY2tQYWdlKCRzY29wZSwgJGxvY2F0aW9uLmFic1VybCgpLCBsb2NhdGlvbl91cmwpO1xuXG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5hY3RpdmVQcm9qZWN0cyA9IFtdO1xuICAgIHZtLmFjdGl2ZVByb2plY3RzTG9hZGVkID0gZmFsc2U7XG4gICAgdm0uc2hvd0VtcHR5U2NyZWVuID0gZmFsc2U7XG4gICAgdm0ud2VsY29tZSA9ICRzY2UudHJ1c3RBc0h0bWwoJHJvb3RTY29wZS5jdXN0b21lci5wcm9qZWN0c193ZWxjb21lKTtcbiAgICB2bS5zdWJtaXRQcm9qZWN0ID0gc3VibWl0UHJvamVjdDtcblxuICAgIGFjdGl2YXRlKCk7XG5cbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgZ2V0QWN0aXZlUHJvamVjdHMoKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0QWN0aXZlUHJvamVjdHMoKSB7XG4gICAgICAgIFByb2plY3RzU2VydmljZS5nZXRBY3RpdmVQcm9qZWN0cygpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHZtLmFjdGl2ZVByb2plY3RzID0gZGF0YTtcbiAgICAgICAgICAgICAgICB2bS5hY3RpdmVQcm9qZWN0c0xvYWRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgY2hlY2tJc0VtcHR5KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZtLmFjdGl2ZVByb2plY3RzO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hlY2tJc0VtcHR5KCkge1xuICAgICAgICBpZiAodm0uYWN0aXZlUHJvamVjdHNMb2FkZWQpIHtcbiAgICAgICAgICAgIGlmICh2bS5hY3RpdmVQcm9qZWN0cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgIHZtLnNob3dFbXB0eVNjcmVlbiA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZtLnNob3dFbXB0eVNjcmVlbiA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3VibWl0UHJvamVjdCgpIHtcbiAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG4gICAgICAgICAgICBhbmltYXRpb246IHRydWUsXG4gICAgICAgICAgICB3aW5kb3dDbGFzczogJ3h4LWRpYWxvZyBmYWRlIHpvb20nLFxuICAgICAgICAgICAgYmFja2Ryb3A6ICdzdGF0aWMnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvc3RhdGljL2FuZ3VsYXIvcHJvamVjdHMvcGFydGlhbHMvX21vZGFscy9hZGQtcHJvamVjdC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBZGRQcm9qZWN0Q29udHJvbGxlciBhcyBhZGRQcm9qZWN0JyxcbiAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIChwcm9qZWN0KSB7XG4gICAgICAgICAgICAgICAgZ2V0QWN0aXZlUHJvamVjdHMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbn1cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9qZWN0cycpXG4gICAgLmNvbnRyb2xsZXIoJ1Byb2plY3RDb250cm9sbGVyJywgUHJvamVjdENvbnRyb2xsZXIpO1xuXG5mdW5jdGlvbiBQcm9qZWN0Q29udHJvbGxlcihQcm9qZWN0c1NlcnZpY2UsIENvbW1lbnQsIE5vdGlmaWNhdGlvbiwgYW5hbHl0aWNzLCAkbG9jYXRpb24sICRtb2RhbCwgJHNjb3BlLCAkc2NlLCAkcm9vdFNjb3BlLCAkcm91dGVQYXJhbXMpIHtcbiAgICBhbmFseXRpY3MudHJhY2tQYWdlKCRzY29wZSwgJGxvY2F0aW9uLmFic1VybCgpLCAkbG9jYXRpb24udXJsKCkpO1xuXG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5wcm9qZWN0ID0gbnVsbDtcbiAgICB2bS5zaG93U3VtbWFyeUVkaXQgPSBmYWxzZTtcbiAgICB2bS5jb21tZW50cyA9IFtdO1xuICAgIHZtLmFkZENvbW1lbnQgPSBhZGRDb21tZW50O1xuICAgIHZtLmVkaXRQcm9qZWN0ID0gZWRpdFByb2plY3Q7XG5cbiAgICBhY3RpdmF0ZSgpO1xuXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgIGluaXRpYWxpemVOZXdDb21tZW50KCk7XG4gICAgICAgIGdldFByb2plY3QoKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gaW5pdGlhbGl6ZU5ld0NvbW1lbnQoKSB7XG4gICAgICAgIHZtLm5ld0NvbW1lbnQgPSBuZXcgQ29tbWVudCh7Y29udGVudDonJywgaW5jbHVkZV9pbl9kYWlseV9kaWdlc3Q6dHJ1ZX0pO1xuICAgICAgICB2bS5uZXdDb21tZW50LmV4cGFuZFRleHRBcmVhID0gZmFsc2U7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldFByb2plY3QoKSB7XG4gICAgICAgIFByb2plY3RzU2VydmljZS5nZXRQcm9qZWN0KCRyb3V0ZVBhcmFtcy5wcm9qZWN0SWQpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHZtLnByb2plY3QgPSBkYXRhO1xuICAgICAgICAgICAgICAgIHZtLmNvbW1lbnRzID0gdm0ucHJvamVjdC5jb21tZW50cztcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgICAgICAgICAgICAgTm90aWZpY2F0aW9uLmVycm9yKFwiU29ycnkgd2UgaGFkIGEgcHJvYmxlbSBvcGVuaW5nIHRoaXMgcHJvamVjdC5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkQ29tbWVudChmb3JtKSB7XG4gICAgICAgIGlmIChmb3JtLiRpbnZhbGlkKSByZXR1cm47XG4gICAgICAgIENvbW1lbnQuYWRkVG9Qcm9qZWN0KHsgaWQ6JHJvdXRlUGFyYW1zLnByb2plY3RJZH0sIHZtLm5ld0NvbW1lbnQsIGZ1bmN0aW9uKGNvbW1lbnQpIHtcbiAgICAgICAgICAgIGluaXRpYWxpemVOZXdDb21tZW50KCk7XG4gICAgICAgICAgICB2bS5jb21tZW50cy5wdXNoKGNvbW1lbnQpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZWRpdFByb2plY3QoKSB7XG4gICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuICAgICAgICAgICAgYW5pbWF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgd2luZG93Q2xhc3M6ICd4eC1kaWFsb2cgZmFkZSB6b29tJyxcbiAgICAgICAgICAgIGJhY2tkcm9wOiAnc3RhdGljJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3N0YXRpYy9hbmd1bGFyL3Byb2plY3RzL3BhcnRpYWxzL19tb2RhbHMvYWRkLXByb2plY3QuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQWRkUHJvamVjdENvbnRyb2xsZXIgYXMgYWRkUHJvamVjdCcsXG4gICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgIHByb2plY3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2bS5wcm9qZWN0XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIG1vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiAocHJvamVjdCkge1xuICAgICAgICAgICAgICAgIGdldFByb2plY3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgncHJvamVjdHMnKVxuICAgIC5jb250cm9sbGVyKCdBZGRQcm9qZWN0Q29udHJvbGxlcicsIEFkZFByb2plY3RDb250cm9sbGVyKTtcblxuZnVuY3Rpb24gQWRkUHJvamVjdENvbnRyb2xsZXIocHJvamVjdCwgUHJvamVjdHNTZXJ2aWNlLCBOb3RpZmljYXRpb24sIEVtcGxveWVlU2VhcmNoLCAkbW9kYWxJbnN0YW5jZSkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0ucHJvamVjdCA9IHtcbiAgICAgICAgbmFtZTogbnVsbCxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBvd25lcnM6IFtdLFxuICAgICAgICBzcG9uc29yczogW10sXG4gICAgICAgIHRlYW1fbWVtYmVyczogW10sXG4gICAgICAgIHNjb3JlczogW11cbiAgICB9XG4gICAgdm0uc2VsZWN0ZWRPd25lcnMgPSBbXTtcbiAgICB2bS5zZWxlY3RlZFNwb25zb3JzID0gW107XG4gICAgdm0uc2VsZWN0ZWRUZWFtTWVtYmVycyA9IFtdO1xuICAgIHZtLmVtcGxveWVlcyA9IFtdO1xuICAgIHZtLnN0ZXBOZXh0ID0gc3RlcE5leHQ7XG4gICAgdm0uc3RlcEJhY2sgPSBzdGVwQmFjaztcbiAgICB2bS5jYW5jZWwgPSBjYW5jZWw7XG4gICAgdm0uc2F2ZSA9IHNhdmU7XG4gICAgdm0ucGFuZWxfaW5kZXggPSAwO1xuICAgIHZtLmNhdGVnb3JpZXMgPSBbXTtcblxuICAgIGFjdGl2YXRlKClcblxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICBpZiAocHJvamVjdCkge1xuICAgICAgICAgICAgbG9hZFByb2plY3QoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXRFbXBsb3llZXMoKTtcbiAgICAgICAgZ2V0Q3JpdGVyaWEoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2FkUHJvamVjdCgpIHtcbiAgICAgICAgdm0ucHJvamVjdCA9IGFuZ3VsYXIuY29weShwcm9qZWN0KTtcbiAgICAgICAgdm0uc2VsZWN0ZWRPd25lcnMgPSBhbmd1bGFyLmNvcHkocHJvamVjdC5vd25lcnMpO1xuICAgICAgICB2bS5zZWxlY3RlZFNwb25zb3JzID0gYW5ndWxhci5jb3B5KHByb2plY3Quc3BvbnNvcnMpO1xuICAgICAgICB2bS5zZWxlY3RlZFRlYW1NZW1iZXJzID0gYW5ndWxhci5jb3B5KHByb2plY3QudGVhbV9tZW1iZXJzKTtcbiAgICAgICAgdm0ucHJvamVjdC5vd25lcnMgPSBbXTtcbiAgICAgICAgdm0ucHJvamVjdC5zcG9uc29ycyA9IFtdO1xuICAgICAgICB2bS5wcm9qZWN0LnRlYW1fbWVtYmVycyA9IFtdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldENyaXRlcmlhKCkge1xuICAgICAgICBQcm9qZWN0c1NlcnZpY2UuZ2V0Q3VycmVudENyaXRlcmlhKClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdm0uY2F0ZWdvcmllcyA9IGRhdGEuY2F0ZWdvcmllcztcbiAgICAgICAgICAgICAgICBpZiAodm0ucHJvamVjdC5zY29yZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLmNhdGVnb3JpZXMsIGZ1bmN0aW9uIChjYXRlZ29yeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGNhdGVnb3J5LmNyaXRlcmlhLCBmdW5jdGlvbihjcml0ZXJpYSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLnByb2plY3Quc2NvcmVzLCBmdW5jdGlvbiAoc2NvcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNyaXRlcmlhLmlkID09IHNjb3JlLmNyaXRlcmlhX2lkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcml0ZXJpYS5zZWxlY3RlZCA9IHNjb3JlLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdm0ucHJvamVjdC5zY29yZXMgPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZtLmNhdGVnb3JpZXM7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEVtcGxveWVlcygpIHtcbiAgICAgICAgRW1wbG95ZWVTZWFyY2gucXVlcnkoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIHZtLmVtcGxveWVlcyA9IGRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0ZXBOZXh0KCkge1xuICAgICAgICB2bS5wYW5lbF9pbmRleCsrO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0ZXBCYWNrKCkge1xuICAgICAgICB2bS5wYW5lbF9pbmRleC0tO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNhdmUoKSB7XG4gICAgICAgIGZvcih2YXIgaT0wOyBpIDwgdm0uc2VsZWN0ZWRPd25lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBwayA9IHZtLnNlbGVjdGVkT3duZXJzW2ldLnBrID8gdm0uc2VsZWN0ZWRPd25lcnNbaV0ucGsgOiB2bS5zZWxlY3RlZE93bmVyc1tpXS5pZDtcbiAgICAgICAgICAgIHZtLnByb2plY3Qub3duZXJzLnB1c2gocGspO1xuICAgICAgICB9XG4gICAgICAgIGZvcih2YXIgaT0wOyBpIDwgdm0uc2VsZWN0ZWRTcG9uc29ycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHBrID0gdm0uc2VsZWN0ZWRTcG9uc29yc1tpXS5wayA/IHZtLnNlbGVjdGVkU3BvbnNvcnNbaV0ucGsgOiB2bS5zZWxlY3RlZFNwb25zb3JzW2ldLmlkXG4gICAgICAgICAgICB2bS5wcm9qZWN0LnNwb25zb3JzLnB1c2gocGspO1xuICAgICAgICB9XG4gICAgICAgIGZvcih2YXIgaT0wOyBpIDwgdm0uc2VsZWN0ZWRUZWFtTWVtYmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHBrID0gdm0uc2VsZWN0ZWRUZWFtTWVtYmVyc1tpXS5wayA/IHZtLnNlbGVjdGVkVGVhbU1lbWJlcnNbaV0ucGsgOiB2bS5zZWxlY3RlZFRlYW1NZW1iZXJzW2ldLmlkO1xuICAgICAgICAgICAgdm0ucHJvamVjdC50ZWFtX21lbWJlcnMucHVzaChwayk7XG4gICAgICAgIH1cbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLmNhdGVnb3JpZXMsIGZ1bmN0aW9uIChjYXRlZ29yeSkge1xuXG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGNhdGVnb3J5LmNyaXRlcmlhLCBmdW5jdGlvbihjcml0ZXJpYSl7XG4gICAgICAgICAgICBpZiAoY3JpdGVyaWEuc2VsZWN0ZWQpe1xuXG4gICAgICAgICAgICAgICAgdm0ucHJvamVjdC5zY29yZXMucHVzaChjcml0ZXJpYS5zZWxlY3RlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodm0ucHJvamVjdC5pZCkge1xuICAgICAgICAgICAgUHJvamVjdHNTZXJ2aWNlLnVwZGF0ZSh2bS5wcm9qZWN0KVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChwcm9qZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIE5vdGlmaWNhdGlvbi5zdWNjZXNzKHByb2plY3QubmFtZSArICcgd2FzIHNhdmVkLicpXG4gICAgICAgICAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKHByb2plY3QpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBQcm9qZWN0c1NlcnZpY2Uuc2F2ZSh2bS5wcm9qZWN0KVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChwcm9qZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIE5vdGlmaWNhdGlvbi5zdWNjZXNzKHByb2plY3QubmFtZSArICcgd2FzIGNyZWF0ZWQuJylcbiAgICAgICAgICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2UocHJvamVjdClcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCI7KGZ1bmN0aW9uKCkge1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9qZWN0cycsIFsnbmdSb3V0ZScsICd1aS1ub3RpZmljYXRpb24nXSk7XG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9qZWN0cycpXG4gICAgLmZhY3RvcnkoJ1Byb2plY3RzU2VydmljZScsIFByb2plY3RzU2VydmljZSk7XG5cbmZ1bmN0aW9uIFByb2plY3RzU2VydmljZSgkaHR0cCwgJGxvZywgUHJvamVjdHNSZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGdldFByb2plY3Q6IGdldFByb2plY3QsXG4gICAgICAgIGdldEFjdGl2ZVByb2plY3RzOiBnZXRBY3RpdmVQcm9qZWN0cyxcbiAgICAgICAgZ2V0Q3VycmVudENyaXRlcmlhOiBnZXRDdXJyZW50Q3JpdGVyaWEsXG4gICAgICAgIHNhdmU6IHNhdmUsXG4gICAgICAgIHVwZGF0ZTogdXBkYXRlXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldEN1cnJlbnRDcml0ZXJpYSgpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS92MS9wcm9qZWN0cy9jcml0ZXJpYS8nKVxuICAgICAgICAgICAgLnRoZW4oc3VjY2VzcylcbiAgICAgICAgICAgIC5jYXRjaChmYWlsKTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ2dldEN1cnJlbnRDcml0ZXJpYSBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFByb2plY3QocHJvamVjdElkKSB7XG4gICAgICAgIHJldHVybiBQcm9qZWN0c1Jlc291cmNlLmdldCh7aWQ6IHByb2plY3RJZH0sIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ2dldFByb2plY3QgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRBY3RpdmVQcm9qZWN0cygpIHtcbiAgICAgICAgcmV0dXJuIFByb2plY3RzUmVzb3VyY2UuZ2V0QWN0aXZlUHJvamVjdHMobnVsbCwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignZ2V0UHJvamVjdCBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNhdmUocHJvamVjdCkge1xuICAgICAgICByZXR1cm4gUHJvamVjdHNSZXNvdXJjZS5zYXZlKHByb2plY3QsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignc2F2ZSBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZShwcm9qZWN0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHByb2plY3QpO1xuICAgICAgICByZXR1cm4gUHJvamVjdHNSZXNvdXJjZS51cGRhdGUoe2lkOiBwcm9qZWN0LmlkfSwgcHJvamVjdCwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCd1cGRhdGUgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5hbmd1bGFyXG4gICAgLm1vZHVsZSgncHJvamVjdHMnKVxuICAgIC5mYWN0b3J5KCdQcm9qZWN0c1Jlc291cmNlJywgUHJvamVjdHNSZXNvdXJjZSk7XG5cbmZ1bmN0aW9uIFByb2plY3RzUmVzb3VyY2UoJHJlc291cmNlKSB7XG4gICAgdmFyIGFjdGlvbnMgPSB7XG4gICAgICAgICdnZXQnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRQcm9qZWN0c0J5T3duZXInOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9wcm9qZWN0cy9vd25lZC86aWQvJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldFByb2plY3RzSU93bic6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3Byb2plY3RzL293bmVkL215LycsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRQcm9qZWN0c0J5U3BvbnNvcic6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3Byb2plY3RzL3Nwb25zb3JlZC86aWQvJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldFByb2plY3RzSVNwb25zb3InOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9wcm9qZWN0cy9zcG9uc29yZWQvbXkvJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldFByb2plY3RzQnlUZWFtTWVtYmVyJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvcHJvamVjdHMvdGVhbS1tZW1iZXIvOmlkLycsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRQcm9qZWN0c0lBbUFUZWFtTWVtYmVyJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvcHJvamVjdHMvdGVhbS1tZW1iZXIvbXkvJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldEFjdGl2ZVByb2plY3RzJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ3NhdmUnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvcHJvamVjdHMvYWRkLydcbiAgICAgICAgfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3Byb2plY3RzLzppZC91cGRhdGUvJ1xuICAgICAgICB9LFxuICAgICAgICAnZGVsZXRlJzoge1xuICAgICAgICAgICAgJ21ldGhvZCc6ICdERUxFVEUnXG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiAkcmVzb3VyY2UoJy9hcGkvdjEvcHJvamVjdHMvOmlkLycsIG51bGwsIGFjdGlvbnMpO1xufVxuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgncHJvamVjdHMnKVxuICAgIC5jb250cm9sbGVyKCdQcm9qZWN0c0NvbnRyb2xsZXInLCBQcm9qZWN0c0NvbnRyb2xsZXIpO1xuXG5mdW5jdGlvbiBQcm9qZWN0c0NvbnRyb2xsZXIoUHJvamVjdHNTZXJ2aWNlLCBOb3RpZmljYXRpb24sIGFuYWx5dGljcywgJGxvY2F0aW9uLCAkbW9kYWwsICRzY29wZSwgJHNjZSwgJHJvb3RTY29wZSkge1xuICAgIC8qIFNpbmNlIHRoaXMgcGFnZSBjYW4gYmUgdGhlIHJvb3QgZm9yIHNvbWUgdXNlcnMgbGV0J3MgbWFrZSBzdXJlIHdlIGNhcHR1cmUgdGhlIGNvcnJlY3QgcGFnZSAqL1xuICAgIHZhciBsb2NhdGlvbl91cmwgPSAkbG9jYXRpb24udXJsKCkuaW5kZXhPZignL3Byb2plY3RzJykgPCAwID8gJy9wcm9qZWN0cycgOiAkbG9jYXRpb24udXJsKCk7XG4gICAgYW5hbHl0aWNzLnRyYWNrUGFnZSgkc2NvcGUsICRsb2NhdGlvbi5hYnNVcmwoKSwgbG9jYXRpb25fdXJsKTtcblxuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uYWN0aXZlUHJvamVjdHMgPSBbXTtcbiAgICB2bS5hY3RpdmVQcm9qZWN0c0xvYWRlZCA9IGZhbHNlO1xuICAgIHZtLnNob3dFbXB0eVNjcmVlbiA9IGZhbHNlO1xuICAgIHZtLndlbGNvbWUgPSAkc2NlLnRydXN0QXNIdG1sKCRyb290U2NvcGUuY3VzdG9tZXIucHJvamVjdHNfd2VsY29tZSk7XG4gICAgdm0uc3VibWl0UHJvamVjdCA9IHN1Ym1pdFByb2plY3Q7XG5cbiAgICBhY3RpdmF0ZSgpO1xuXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgIGdldEFjdGl2ZVByb2plY3RzKCk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldEFjdGl2ZVByb2plY3RzKCkge1xuICAgICAgICBQcm9qZWN0c1NlcnZpY2UuZ2V0QWN0aXZlUHJvamVjdHMoKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2bS5hY3RpdmVQcm9qZWN0cyA9IGRhdGE7XG4gICAgICAgICAgICAgICAgdm0uYWN0aXZlUHJvamVjdHNMb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNoZWNrSXNFbXB0eSgpO1xuICAgICAgICAgICAgICAgIHJldHVybiB2bS5hY3RpdmVQcm9qZWN0cztcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoZWNrSXNFbXB0eSgpIHtcbiAgICAgICAgaWYgKHZtLmFjdGl2ZVByb2plY3RzTG9hZGVkKSB7XG4gICAgICAgICAgICBpZiAodm0uYWN0aXZlUHJvamVjdHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICB2bS5zaG93RW1wdHlTY3JlZW4gPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2bS5zaG93RW1wdHlTY3JlZW4gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN1Ym1pdFByb2plY3QoKSB7XG4gICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuICAgICAgICAgICAgYW5pbWF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgd2luZG93Q2xhc3M6ICd4eC1kaWFsb2cgZmFkZSB6b29tJyxcbiAgICAgICAgICAgIGJhY2tkcm9wOiAnc3RhdGljJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3N0YXRpYy9hbmd1bGFyL3Byb2plY3RzL3BhcnRpYWxzL19tb2RhbHMvYWRkLXByb2plY3QuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQWRkUHJvamVjdENvbnRyb2xsZXIgYXMgYWRkUHJvamVjdCcsXG4gICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgIHByb2plY3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIG1vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiAocHJvamVjdCkge1xuICAgICAgICAgICAgICAgIGdldEFjdGl2ZVByb2plY3RzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG59XG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9qZWN0cycpXG4gICAgLmNvbnRyb2xsZXIoJ1Byb2plY3RDb250cm9sbGVyJywgUHJvamVjdENvbnRyb2xsZXIpO1xuXG5mdW5jdGlvbiBQcm9qZWN0Q29udHJvbGxlcihQcm9qZWN0c1NlcnZpY2UsIENvbW1lbnQsIE5vdGlmaWNhdGlvbiwgYW5hbHl0aWNzLCAkbG9jYXRpb24sICRtb2RhbCwgJHNjb3BlLCAkc2NlLCAkcm9vdFNjb3BlLCAkcm91dGVQYXJhbXMpIHtcbiAgICBhbmFseXRpY3MudHJhY2tQYWdlKCRzY29wZSwgJGxvY2F0aW9uLmFic1VybCgpLCAkbG9jYXRpb24udXJsKCkpO1xuXG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5wcm9qZWN0ID0gbnVsbDtcbiAgICB2bS5zaG93U3VtbWFyeUVkaXQgPSBmYWxzZTtcbiAgICB2bS5jb21tZW50cyA9IFtdO1xuICAgIHZtLmFkZENvbW1lbnQgPSBhZGRDb21tZW50O1xuICAgIHZtLmVkaXRQcm9qZWN0ID0gZWRpdFByb2plY3Q7XG5cbiAgICBhY3RpdmF0ZSgpO1xuXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgIGluaXRpYWxpemVOZXdDb21tZW50KCk7XG4gICAgICAgIGdldFByb2plY3QoKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gaW5pdGlhbGl6ZU5ld0NvbW1lbnQoKSB7XG4gICAgICAgIHZtLm5ld0NvbW1lbnQgPSBuZXcgQ29tbWVudCh7Y29udGVudDonJywgaW5jbHVkZV9pbl9kYWlseV9kaWdlc3Q6dHJ1ZX0pO1xuICAgICAgICB2bS5uZXdDb21tZW50LmV4cGFuZFRleHRBcmVhID0gZmFsc2U7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldFByb2plY3QoKSB7XG4gICAgICAgIFByb2plY3RzU2VydmljZS5nZXRQcm9qZWN0KCRyb3V0ZVBhcmFtcy5wcm9qZWN0SWQpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHZtLnByb2plY3QgPSBkYXRhO1xuICAgICAgICAgICAgICAgIHZtLmNvbW1lbnRzID0gdm0ucHJvamVjdC5jb21tZW50cztcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgICAgICAgICAgICAgTm90aWZpY2F0aW9uLmVycm9yKFwiU29ycnkgd2UgaGFkIGEgcHJvYmxlbSBvcGVuaW5nIHRoaXMgcHJvamVjdC5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkQ29tbWVudChmb3JtKSB7XG4gICAgICAgIGlmIChmb3JtLiRpbnZhbGlkKSByZXR1cm47XG4gICAgICAgIENvbW1lbnQuYWRkVG9Qcm9qZWN0KHsgaWQ6JHJvdXRlUGFyYW1zLnByb2plY3RJZH0sIHZtLm5ld0NvbW1lbnQsIGZ1bmN0aW9uKGNvbW1lbnQpIHtcbiAgICAgICAgICAgIGluaXRpYWxpemVOZXdDb21tZW50KCk7XG4gICAgICAgICAgICB2bS5jb21tZW50cy5wdXNoKGNvbW1lbnQpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZWRpdFByb2plY3QoKSB7XG4gICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuICAgICAgICAgICAgYW5pbWF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgd2luZG93Q2xhc3M6ICd4eC1kaWFsb2cgZmFkZSB6b29tJyxcbiAgICAgICAgICAgIGJhY2tkcm9wOiAnc3RhdGljJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3N0YXRpYy9hbmd1bGFyL3Byb2plY3RzL3BhcnRpYWxzL19tb2RhbHMvYWRkLXByb2plY3QuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQWRkUHJvamVjdENvbnRyb2xsZXIgYXMgYWRkUHJvamVjdCcsXG4gICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgIHByb2plY3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2bS5wcm9qZWN0XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIG1vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiAocHJvamVjdCkge1xuICAgICAgICAgICAgICAgIGdldFByb2plY3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9qZWN0cycpXG4gICAgLmNvbnRyb2xsZXIoJ0FkZFByb2plY3RDb250cm9sbGVyJywgQWRkUHJvamVjdENvbnRyb2xsZXIpO1xuXG5mdW5jdGlvbiBBZGRQcm9qZWN0Q29udHJvbGxlcihwcm9qZWN0LCBQcm9qZWN0c1NlcnZpY2UsIE5vdGlmaWNhdGlvbiwgRW1wbG95ZWVTZWFyY2gsICRtb2RhbEluc3RhbmNlKSB7XG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5wcm9qZWN0ID0ge1xuICAgICAgICBuYW1lOiBudWxsLFxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgIG93bmVyczogW10sXG4gICAgICAgIHNwb25zb3JzOiBbXSxcbiAgICAgICAgdGVhbV9tZW1iZXJzOiBbXSxcbiAgICAgICAgc2NvcmVzOiBbXVxuICAgIH1cbiAgICB2bS5zZWxlY3RlZE93bmVycyA9IFtdO1xuICAgIHZtLnNlbGVjdGVkU3BvbnNvcnMgPSBbXTtcbiAgICB2bS5zZWxlY3RlZFRlYW1NZW1iZXJzID0gW107XG4gICAgdm0uZW1wbG95ZWVzID0gW107XG4gICAgdm0uc3RlcE5leHQgPSBzdGVwTmV4dDtcbiAgICB2bS5zdGVwQmFjayA9IHN0ZXBCYWNrO1xuICAgIHZtLmNhbmNlbCA9IGNhbmNlbDtcbiAgICB2bS5zYXZlID0gc2F2ZTtcbiAgICB2bS5wYW5lbF9pbmRleCA9IDA7XG4gICAgdm0uY2F0ZWdvcmllcyA9IFtdO1xuXG4gICAgYWN0aXZhdGUoKVxuXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgIGlmIChwcm9qZWN0KSB7XG4gICAgICAgICAgICBsb2FkUHJvamVjdCgpO1xuICAgICAgICB9XG4gICAgICAgIGdldEVtcGxveWVlcygpO1xuICAgICAgICBnZXRDcml0ZXJpYSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvYWRQcm9qZWN0KCkge1xuICAgICAgICB2bS5wcm9qZWN0ID0gYW5ndWxhci5jb3B5KHByb2plY3QpO1xuICAgICAgICB2bS5zZWxlY3RlZE93bmVycyA9IGFuZ3VsYXIuY29weShwcm9qZWN0Lm93bmVycyk7XG4gICAgICAgIHZtLnNlbGVjdGVkU3BvbnNvcnMgPSBhbmd1bGFyLmNvcHkocHJvamVjdC5zcG9uc29ycyk7XG4gICAgICAgIHZtLnNlbGVjdGVkVGVhbU1lbWJlcnMgPSBhbmd1bGFyLmNvcHkocHJvamVjdC50ZWFtX21lbWJlcnMpO1xuICAgICAgICB2bS5wcm9qZWN0Lm93bmVycyA9IFtdO1xuICAgICAgICB2bS5wcm9qZWN0LnNwb25zb3JzID0gW107XG4gICAgICAgIHZtLnByb2plY3QudGVhbV9tZW1iZXJzID0gW107XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Q3JpdGVyaWEoKSB7XG4gICAgICAgIFByb2plY3RzU2VydmljZS5nZXRDdXJyZW50Q3JpdGVyaWEoKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2bS5jYXRlZ29yaWVzID0gZGF0YS5jYXRlZ29yaWVzO1xuICAgICAgICAgICAgICAgIGlmICh2bS5wcm9qZWN0LnNjb3Jlcykge1xuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uY2F0ZWdvcmllcywgZnVuY3Rpb24gKGNhdGVnb3J5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goY2F0ZWdvcnkuY3JpdGVyaWEsIGZ1bmN0aW9uKGNyaXRlcmlhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0ucHJvamVjdC5zY29yZXMsIGZ1bmN0aW9uIChzY29yZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3JpdGVyaWEuaWQgPT0gc2NvcmUuY3JpdGVyaWFfaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyaXRlcmlhLnNlbGVjdGVkID0gc2NvcmUuaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB2bS5wcm9qZWN0LnNjb3JlcyA9IFtdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdm0uY2F0ZWdvcmllcztcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RW1wbG95ZWVzKCkge1xuICAgICAgICBFbXBsb3llZVNlYXJjaC5xdWVyeShmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgdm0uZW1wbG95ZWVzID0gZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RlcE5leHQoKSB7XG4gICAgICAgIHZtLnBhbmVsX2luZGV4Kys7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RlcEJhY2soKSB7XG4gICAgICAgIHZtLnBhbmVsX2luZGV4LS07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2F2ZSgpIHtcbiAgICAgICAgZm9yKHZhciBpPTA7IGkgPCB2bS5zZWxlY3RlZE93bmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHBrID0gdm0uc2VsZWN0ZWRPd25lcnNbaV0ucGsgPyB2bS5zZWxlY3RlZE93bmVyc1tpXS5wayA6IHZtLnNlbGVjdGVkT3duZXJzW2ldLmlkO1xuICAgICAgICAgICAgdm0ucHJvamVjdC5vd25lcnMucHVzaChwayk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yKHZhciBpPTA7IGkgPCB2bS5zZWxlY3RlZFNwb25zb3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcGsgPSB2bS5zZWxlY3RlZFNwb25zb3JzW2ldLnBrID8gdm0uc2VsZWN0ZWRTcG9uc29yc1tpXS5wayA6IHZtLnNlbGVjdGVkU3BvbnNvcnNbaV0uaWRcbiAgICAgICAgICAgIHZtLnByb2plY3Quc3BvbnNvcnMucHVzaChwayk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yKHZhciBpPTA7IGkgPCB2bS5zZWxlY3RlZFRlYW1NZW1iZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcGsgPSB2bS5zZWxlY3RlZFRlYW1NZW1iZXJzW2ldLnBrID8gdm0uc2VsZWN0ZWRUZWFtTWVtYmVyc1tpXS5wayA6IHZtLnNlbGVjdGVkVGVhbU1lbWJlcnNbaV0uaWQ7XG4gICAgICAgICAgICB2bS5wcm9qZWN0LnRlYW1fbWVtYmVycy5wdXNoKHBrKTtcbiAgICAgICAgfVxuICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uY2F0ZWdvcmllcywgZnVuY3Rpb24gKGNhdGVnb3J5KSB7XG5cbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2goY2F0ZWdvcnkuY3JpdGVyaWEsIGZ1bmN0aW9uKGNyaXRlcmlhKXtcbiAgICAgICAgICAgIGlmIChjcml0ZXJpYS5zZWxlY3RlZCl7XG5cbiAgICAgICAgICAgICAgICB2bS5wcm9qZWN0LnNjb3Jlcy5wdXNoKGNyaXRlcmlhLnNlbGVjdGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh2bS5wcm9qZWN0LmlkKSB7XG4gICAgICAgICAgICBQcm9qZWN0c1NlcnZpY2UudXBkYXRlKHZtLnByb2plY3QpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHByb2plY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgTm90aWZpY2F0aW9uLnN1Y2Nlc3MocHJvamVjdC5uYW1lICsgJyB3YXMgc2F2ZWQuJylcbiAgICAgICAgICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2UocHJvamVjdClcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFByb2plY3RzU2VydmljZS5zYXZlKHZtLnByb2plY3QpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHByb2plY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgTm90aWZpY2F0aW9uLnN1Y2Nlc3MocHJvamVjdC5uYW1lICsgJyB3YXMgY3JlYXRlZC4nKVxuICAgICAgICAgICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZShwcm9qZWN0KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxufSgpKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
