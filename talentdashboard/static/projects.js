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
            method: 'PUT',
            url: '/api/v1/projects/:id/update/'
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
ProjectController.$inject = ["ProjectsService", "Comment", "Notification", "analytics", "$location", "$modal", "$scope", "$sce", "$rootScope", "$routeParams"];

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
    vm.ruleSet = [];

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
                vm.ruleSet = data.criteria;
                if (vm.project.scores) {
                    angular.forEach(vm.ruleSet, function (rule) {
                        angular.forEach(vm.project.scores, function (score) {
                            if (rule.id == score.criteria_id) {
                                rule.selected = score.id;
                            }
                        });
                    });
                    vm.project.scores = [];
                }
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
        angular.forEach(vm.ruleSet, function (rule) {
            if (rule.selected) {
                vm.project.scores.push(rule.selected);
            }
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
AddProjectController.$inject = ["project", "ProjectsService", "Notification", "EmployeeSearch", "$modalInstance"];
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2plY3RzLm1vZHVsZS5qcyIsInByb2plY3RzLnNlcnZpY2UuanMiLCJwcm9qZWN0cy5yZXNvdXJjZS5qcyIsInByb2plY3RzLmNvbnRyb2xsZXIuanMiLCJwcm9qZWN0LmNvbnRyb2xsZXIuanMiLCJhZGQtcHJvamVjdC5jb250cm9sbGVyLmpzIiwicHJvamVjdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxDQUFBLFdBQUE7QUFDQTs7QUNEQTtLQUNBLE9BQUEsWUFBQSxDQUFBLFdBQUE7O0FBRUE7S0FDQSxPQUFBO0tBQ0EsUUFBQSxtQkFBQTs7QUFFQSxTQUFBLGdCQUFBLE9BQUEsTUFBQSxrQkFBQTtJQUNBLE9BQUE7UUFDQSxZQUFBO1FBQ0EsbUJBQUE7UUFDQSxvQkFBQTtRQUNBLE1BQUE7UUFDQSxRQUFBOzs7SUFHQSxTQUFBLHFCQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUE7YUFDQSxLQUFBO2FBQ0EsTUFBQTs7UUFFQSxTQUFBLFFBQUEsVUFBQTtZQUNBLE9BQUEsU0FBQTs7O1FBR0EsU0FBQSxLQUFBLFVBQUE7WUFDQSxLQUFBLE1BQUE7Ozs7SUFJQSxTQUFBLFdBQUEsV0FBQTtRQUNBLE9BQUEsaUJBQUEsSUFBQSxDQUFBLElBQUEsWUFBQSxTQUFBLE1BQUE7O1FBRUEsU0FBQSxRQUFBLFVBQUE7WUFDQSxPQUFBOzs7UUFHQSxTQUFBLEtBQUEsVUFBQTtZQUNBLEtBQUEsTUFBQTs7OztJQUlBLFNBQUEsb0JBQUE7UUFDQSxPQUFBLGlCQUFBLGtCQUFBLE1BQUEsU0FBQSxNQUFBOztRQUVBLFNBQUEsUUFBQSxVQUFBO1lBQ0EsT0FBQTs7O1FBR0EsU0FBQSxLQUFBLFVBQUE7WUFDQSxLQUFBLE1BQUE7Ozs7SUFJQSxTQUFBLEtBQUEsU0FBQTtRQUNBLE9BQUEsaUJBQUEsS0FBQSxTQUFBLFNBQUEsTUFBQTs7UUFFQSxTQUFBLFFBQUEsVUFBQTtZQUNBLE9BQUEsU0FBQTs7O1FBR0EsU0FBQSxLQUFBLFVBQUE7WUFD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O1FBQ0EsR0FBQSxRQUFBLFdBQUE7UUFDQSxHQUFBLFFBQUEsZUFBQTs7O0lBR0EsU0FBQSxjQUFBO1FBQ0EsZ0JBQUE7YUFDQSxLQUFBLFVBQUEsTUFBQTtnQkFDQSxHQUFBLFVBQUEsS0FBQTtnQkFDQSxJQUFBLEdBQUEsUUFBQSxRQUFBO29CQUNBLFFBQUEsUUFBQSxHQUFBLFNBQUEsVUFBQSxNQUFBO3dCQUNBLFFBQUEsUUFBQSxHQUFBLFFBQUEsUUFBQSxVQUFBLE9BQUE7NEJBQ0EsSUFBQSxLQUFBLE1BQUEsTUFBQSxhQUFBO2dDQUNBLEtBQUEsV0FBQSxNQUFBOzs7O29CQUlBLEdBQUEsUUFBQSxTQUFBOztnQkFFQSxPQUFBLEdBQUE7Ozs7SUFJQSxTQUFBLGVBQUE7UUFDQSxlQUFBLE1BQUEsU0FBQSxNQUFBO2dCQUNBLEdBQUEsWUFBQTs7OztJQUlBLFNBQUEsV0FBQTtRQUNBLEdBQUE7OztJQUdBLFNBQUEsV0FBQTtRQUNBLEdBQUE7OztJQUdBLFNBQUEsU0FBQTtRQUNBLGVBQUE7OztJQUdBLFNBQUEsT0FBQTtRQUNBLElBQUEsSUFBQSxFQUFBLEdBQUEsSUFBQSxHQUFBLGVBQUEsUUFBQSxLQUFBO1lBQ0EsSUFBQSxLQUFBLEdBQUEsZUFBQSxHQUFBLEtBQUEsR0FBQSxlQUFBLEdBQUEsS0FBQSxHQUFBLGVBQUEsR0FBQTtZQUNBLEdBQUEsUUFBQSxPQUFBLEtBQUE7O1FBRUEsSUFBQSxJQUFBLEVBQUEsR0FBQSxJQUFBLEdBQUEsaUJBQUEsUUFBQSxLQUFBO1lBQ0EsSUFBQSxLQUFBLEdBQUEsaUJBQUEsR0FBQSxLQUFBLEdBQUEsaUJBQUEsR0FBQSxLQUFBLEdBQUEsaUJBQUEsR0FBQTtZQUNBLEdBQUEsUUFBQSxTQUFBLEtBQUE7O1FBRUEsSUFBQSxJQUFBLEVBQUEsR0FBQSxJQUFBLEdBQUEsb0JBQUEsUUFBQSxLQUFBO1lBQ0EsSUFBQSxLQUFBLEdBQUEsb0JBQUEsR0FBQSxLQUFBLEdBQUEsb0JBQUEsR0FBQSxLQUFBLEdBQUEsb0JBQUEsR0FBQTtZQUNBLEdBQUEsUUFBQSxhQUFBLEtBQUE7O1FBRUEsUUFBQSxRQUFBLEdBQUEsU0FBQSxVQUFBLE1BQUE7WUFDQSxJQUFBLEtBQUEsVUFBQTtnQkFDQSxHQUFBLFFBQUEsT0FBQSxLQUFBLEtBQUE7OztRQUdBLElBQUEsR0FBQSxRQUFBLElBQUE7WUFDQSxnQkFBQSxPQUFBLEdBQUE7aUJBQ0EsS0FBQSxVQUFBLFNBQUE7b0JBQ0EsYUFBQSxRQUFBLFFBQUEsT0FBQTtvQkFDQSxlQUFBLE1BQUE7O2VBRUE7WUFDQSxnQkFBQSxLQUFBLEdBQUE7aUJBQ0EsS0FBQSxVQUFBLFNBQUE7b0JBQ0EsYUFBQSxRQUFBLFFBQUEsT0FBQTtvQkFDQSxlQUFBLE1BQUE7Ozs7Ozs7QUNpUkEiLCJmaWxlIjoicHJvamVjdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyXG4gICAgLm1vZHVsZSgncHJvamVjdHMnLCBbJ25nUm91dGUnLCAndWktbm90aWZpY2F0aW9uJ10pO1xuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ3Byb2plY3RzJylcbiAgICAuZmFjdG9yeSgnUHJvamVjdHNTZXJ2aWNlJywgUHJvamVjdHNTZXJ2aWNlKTtcblxuZnVuY3Rpb24gUHJvamVjdHNTZXJ2aWNlKCRodHRwLCAkbG9nLCBQcm9qZWN0c1Jlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0UHJvamVjdDogZ2V0UHJvamVjdCxcbiAgICAgICAgZ2V0QWN0aXZlUHJvamVjdHM6IGdldEFjdGl2ZVByb2plY3RzLFxuICAgICAgICBnZXRDdXJyZW50Q3JpdGVyaWE6IGdldEN1cnJlbnRDcml0ZXJpYSxcbiAgICAgICAgc2F2ZTogc2F2ZSxcbiAgICAgICAgdXBkYXRlOiB1cGRhdGVcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0Q3VycmVudENyaXRlcmlhKCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3YxL3Byb2plY3RzL2NyaXRlcmlhLycpXG4gICAgICAgICAgICAudGhlbihzdWNjZXNzKVxuICAgICAgICAgICAgLmNhdGNoKGZhaWwpO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignZ2V0Q3VycmVudENyaXRlcmlhIGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UHJvamVjdChwcm9qZWN0SWQpIHtcbiAgICAgICAgcmV0dXJuIFByb2plY3RzUmVzb3VyY2UuZ2V0KHtpZDogcHJvamVjdElkfSwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcignZ2V0UHJvamVjdCBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEFjdGl2ZVByb2plY3RzKCkge1xuICAgICAgICByZXR1cm4gUHJvamVjdHNSZXNvdXJjZS5nZXRBY3RpdmVQcm9qZWN0cyhudWxsLCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdnZXRQcm9qZWN0IGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2F2ZShwcm9qZWN0KSB7XG4gICAgICAgIHJldHVybiBQcm9qZWN0c1Jlc291cmNlLnNhdmUocHJvamVjdCwgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdzYXZlIGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlKHByb2plY3QpIHtcbiAgICAgICAgY29uc29sZS5sb2cocHJvamVjdCk7XG4gICAgICAgIHJldHVybiBQcm9qZWN0c1Jlc291cmNlLnVwZGF0ZSh7aWQ6IHByb2plY3QuaWR9LCBwcm9qZWN0LCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ3VwZGF0ZSBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgncHJvamVjdHMnKVxuICAgIC5mYWN0b3J5KCdQcm9qZWN0c1Jlc291cmNlJywgUHJvamVjdHNSZXNvdXJjZSk7XG5cbmZ1bmN0aW9uIFByb2plY3RzUmVzb3VyY2UoJHJlc291cmNlKSB7XG4gICAgdmFyIGFjdGlvbnMgPSB7XG4gICAgICAgICdnZXQnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRQcm9qZWN0c0J5T3duZXInOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9wcm9qZWN0cy9vd25lZC86aWQvJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldFByb2plY3RzSU93bic6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3Byb2plY3RzL293bmVkL215LycsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRQcm9qZWN0c0J5U3BvbnNvcic6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3Byb2plY3RzL3Nwb25zb3JlZC86aWQvJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldFByb2plY3RzSVNwb25zb3InOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9wcm9qZWN0cy9zcG9uc29yZWQvbXkvJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldFByb2plY3RzQnlUZWFtTWVtYmVyJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvcHJvamVjdHMvdGVhbS1tZW1iZXIvOmlkLycsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRQcm9qZWN0c0lBbUFUZWFtTWVtYmVyJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvcHJvamVjdHMvdGVhbS1tZW1iZXIvbXkvJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ2dldEFjdGl2ZVByb2plY3RzJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ3NhdmUnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvcHJvamVjdHMvYWRkLydcbiAgICAgICAgfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3Byb2plY3RzLzppZC91cGRhdGUvJ1xuICAgICAgICB9LFxuICAgICAgICAnZGVsZXRlJzoge1xuICAgICAgICAgICAgJ21ldGhvZCc6ICdERUxFVEUnXG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiAkcmVzb3VyY2UoJy9hcGkvdjEvcHJvamVjdHMvOmlkLycsIG51bGwsIGFjdGlvbnMpO1xufVxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ3Byb2plY3RzJylcbiAgICAuY29udHJvbGxlcignUHJvamVjdHNDb250cm9sbGVyJywgUHJvamVjdHNDb250cm9sbGVyKTtcblxuZnVuY3Rpb24gUHJvamVjdHNDb250cm9sbGVyKFByb2plY3RzU2VydmljZSwgTm90aWZpY2F0aW9uLCBhbmFseXRpY3MsICRsb2NhdGlvbiwgJG1vZGFsLCAkc2NvcGUsICRzY2UsICRyb290U2NvcGUpIHtcbiAgICAvKiBTaW5jZSB0aGlzIHBhZ2UgY2FuIGJlIHRoZSByb290IGZvciBzb21lIHVzZXJzIGxldCdzIG1ha2Ugc3VyZSB3ZSBjYXB0dXJlIHRoZSBjb3JyZWN0IHBhZ2UgKi9cbiAgICB2YXIgbG9jYXRpb25fdXJsID0gJGxvY2F0aW9uLnVybCgpLmluZGV4T2YoJy9wcm9qZWN0cycpIDwgMCA/ICcvcHJvamVjdHMnIDogJGxvY2F0aW9uLnVybCgpO1xuICAgIGFuYWx5dGljcy50cmFja1BhZ2UoJHNjb3BlLCAkbG9jYXRpb24uYWJzVXJsKCksIGxvY2F0aW9uX3VybCk7XG5cbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLmFjdGl2ZVByb2plY3RzID0gW107XG4gICAgdm0uYWN0aXZlUHJvamVjdHNMb2FkZWQgPSBmYWxzZTtcbiAgICB2bS5zaG93RW1wdHlTY3JlZW4gPSBmYWxzZTtcbiAgICB2bS53ZWxjb21lID0gJHNjZS50cnVzdEFzSHRtbCgkcm9vdFNjb3BlLmN1c3RvbWVyLnByb2plY3RzX3dlbGNvbWUpO1xuICAgIHZtLnN1Ym1pdFByb2plY3QgPSBzdWJtaXRQcm9qZWN0O1xuXG4gICAgYWN0aXZhdGUoKTtcblxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICBnZXRBY3RpdmVQcm9qZWN0cygpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRBY3RpdmVQcm9qZWN0cygpIHtcbiAgICAgICAgUHJvamVjdHNTZXJ2aWNlLmdldEFjdGl2ZVByb2plY3RzKClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdm0uYWN0aXZlUHJvamVjdHMgPSBkYXRhO1xuICAgICAgICAgICAgICAgIHZtLmFjdGl2ZVByb2plY3RzTG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjaGVja0lzRW1wdHkoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdm0uYWN0aXZlUHJvamVjdHM7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGVja0lzRW1wdHkoKSB7XG4gICAgICAgIGlmICh2bS5hY3RpdmVQcm9qZWN0c0xvYWRlZCkge1xuICAgICAgICAgICAgaWYgKHZtLmFjdGl2ZVByb2plY3RzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgdm0uc2hvd0VtcHR5U2NyZWVuID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdm0uc2hvd0VtcHR5U2NyZWVuID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdWJtaXRQcm9qZWN0KCkge1xuICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIHdpbmRvd0NsYXNzOiAneHgtZGlhbG9nIGZhZGUgem9vbScsXG4gICAgICAgICAgICBiYWNrZHJvcDogJ3N0YXRpYycsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9zdGF0aWMvYW5ndWxhci9wcm9qZWN0cy9wYXJ0aWFscy9fbW9kYWxzL2FkZC1wcm9qZWN0Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0FkZFByb2plY3RDb250cm9sbGVyIGFzIGFkZFByb2plY3QnLFxuICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKFxuICAgICAgICAgICAgZnVuY3Rpb24gKHByb2plY3QpIHtcbiAgICAgICAgICAgICAgICBnZXRBY3RpdmVQcm9qZWN0cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxufVxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ3Byb2plY3RzJylcbiAgICAuY29udHJvbGxlcignUHJvamVjdENvbnRyb2xsZXInLCBQcm9qZWN0Q29udHJvbGxlcik7XG5cbmZ1bmN0aW9uIFByb2plY3RDb250cm9sbGVyKFByb2plY3RzU2VydmljZSwgQ29tbWVudCwgTm90aWZpY2F0aW9uLCBhbmFseXRpY3MsICRsb2NhdGlvbiwgJG1vZGFsLCAkc2NvcGUsICRzY2UsICRyb290U2NvcGUsICRyb3V0ZVBhcmFtcykge1xuICAgIGFuYWx5dGljcy50cmFja1BhZ2UoJHNjb3BlLCAkbG9jYXRpb24uYWJzVXJsKCksICRsb2NhdGlvbi51cmwoKSk7XG5cbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLnByb2plY3QgPSBudWxsO1xuICAgIHZtLnNob3dTdW1tYXJ5RWRpdCA9IGZhbHNlO1xuICAgIHZtLmNvbW1lbnRzID0gW107XG4gICAgdm0uYWRkQ29tbWVudCA9IGFkZENvbW1lbnQ7XG4gICAgdm0uZWRpdFByb2plY3QgPSBlZGl0UHJvamVjdDtcblxuICAgIGFjdGl2YXRlKCk7XG5cbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgaW5pdGlhbGl6ZU5ld0NvbW1lbnQoKTtcbiAgICAgICAgZ2V0UHJvamVjdCgpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBpbml0aWFsaXplTmV3Q29tbWVudCgpIHtcbiAgICAgICAgdm0ubmV3Q29tbWVudCA9IG5ldyBDb21tZW50KHtjb250ZW50OicnLCBpbmNsdWRlX2luX2RhaWx5X2RpZ2VzdDp0cnVlfSk7XG4gICAgICAgIHZtLm5ld0NvbW1lbnQuZXhwYW5kVGV4dEFyZWEgPSBmYWxzZTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0UHJvamVjdCgpIHtcbiAgICAgICAgUHJvamVjdHNTZXJ2aWNlLmdldFByb2plY3QoJHJvdXRlUGFyYW1zLnByb2plY3RJZClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdm0ucHJvamVjdCA9IGRhdGE7XG4gICAgICAgICAgICAgICAgdm0uY29tbWVudHMgPSB2bS5wcm9qZWN0LmNvbW1lbnRzO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3Ipe1xuICAgICAgICAgICAgICAgICAgICBOb3RpZmljYXRpb24uZXJyb3IoXCJTb3JyeSB3ZSBoYWQgYSBwcm9ibGVtIG9wZW5pbmcgdGhpcyBwcm9qZWN0LlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRDb21tZW50KGZvcm0pIHtcbiAgICAgICAgaWYgKGZvcm0uJGludmFsaWQpIHJldHVybjtcbiAgICAgICAgQ29tbWVudC5hZGRUb1Byb2plY3QoeyBpZDokcm91dGVQYXJhbXMucHJvamVjdElkfSwgdm0ubmV3Q29tbWVudCwgZnVuY3Rpb24oY29tbWVudCkge1xuICAgICAgICAgICAgaW5pdGlhbGl6ZU5ld0NvbW1lbnQoKTtcbiAgICAgICAgICAgIHZtLmNvbW1lbnRzLnB1c2goY29tbWVudCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBlZGl0UHJvamVjdCgpIHtcbiAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG4gICAgICAgICAgICBhbmltYXRpb246IHRydWUsXG4gICAgICAgICAgICB3aW5kb3dDbGFzczogJ3h4LWRpYWxvZyBmYWRlIHpvb20nLFxuICAgICAgICAgICAgYmFja2Ryb3A6ICdzdGF0aWMnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvc3RhdGljL2FuZ3VsYXIvcHJvamVjdHMvcGFydGlhbHMvX21vZGFscy9hZGQtcHJvamVjdC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBZGRQcm9qZWN0Q29udHJvbGxlciBhcyBhZGRQcm9qZWN0JyxcbiAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZtLnByb2plY3RcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIChwcm9qZWN0KSB7XG4gICAgICAgICAgICAgICAgZ2V0UHJvamVjdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cbn1cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9qZWN0cycpXG4gICAgLmNvbnRyb2xsZXIoJ0FkZFByb2plY3RDb250cm9sbGVyJywgQWRkUHJvamVjdENvbnRyb2xsZXIpO1xuXG5mdW5jdGlvbiBBZGRQcm9qZWN0Q29udHJvbGxlcihwcm9qZWN0LCBQcm9qZWN0c1NlcnZpY2UsIE5vdGlmaWNhdGlvbiwgRW1wbG95ZWVTZWFyY2gsICRtb2RhbEluc3RhbmNlKSB7XG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5wcm9qZWN0ID0ge1xuICAgICAgICBuYW1lOiBudWxsLFxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgIG93bmVyczogW10sXG4gICAgICAgIHNwb25zb3JzOiBbXSxcbiAgICAgICAgdGVhbV9tZW1iZXJzOiBbXSxcbiAgICAgICAgc2NvcmVzOiBbXVxuICAgIH1cbiAgICB2bS5zZWxlY3RlZE93bmVycyA9IFtdO1xuICAgIHZtLnNlbGVjdGVkU3BvbnNvcnMgPSBbXTtcbiAgICB2bS5zZWxlY3RlZFRlYW1NZW1iZXJzID0gW107XG4gICAgdm0uZW1wbG95ZWVzID0gW107XG4gICAgdm0uc3RlcE5leHQgPSBzdGVwTmV4dDtcbiAgICB2bS5zdGVwQmFjayA9IHN0ZXBCYWNrO1xuICAgIHZtLmNhbmNlbCA9IGNhbmNlbDtcbiAgICB2bS5zYXZlID0gc2F2ZTtcbiAgICB2bS5wYW5lbF9pbmRleCA9IDA7XG4gICAgdm0ucnVsZVNldCA9IFtdO1xuXG4gICAgYWN0aXZhdGUoKVxuXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgIGlmIChwcm9qZWN0KSB7XG4gICAgICAgICAgICBsb2FkUHJvamVjdCgpO1xuICAgICAgICB9XG4gICAgICAgIGdldEVtcGxveWVlcygpO1xuICAgICAgICBnZXRDcml0ZXJpYSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvYWRQcm9qZWN0KCkge1xuICAgICAgICB2bS5wcm9qZWN0ID0gYW5ndWxhci5jb3B5KHByb2plY3QpO1xuICAgICAgICB2bS5zZWxlY3RlZE93bmVycyA9IGFuZ3VsYXIuY29weShwcm9qZWN0Lm93bmVycyk7XG4gICAgICAgIHZtLnNlbGVjdGVkU3BvbnNvcnMgPSBhbmd1bGFyLmNvcHkocHJvamVjdC5zcG9uc29ycyk7XG4gICAgICAgIHZtLnNlbGVjdGVkVGVhbU1lbWJlcnMgPSBhbmd1bGFyLmNvcHkocHJvamVjdC50ZWFtX21lbWJlcnMpO1xuICAgICAgICB2bS5wcm9qZWN0Lm93bmVycyA9IFtdO1xuICAgICAgICB2bS5wcm9qZWN0LnNwb25zb3JzID0gW107XG4gICAgICAgIHZtLnByb2plY3QudGVhbV9tZW1iZXJzID0gW107XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Q3JpdGVyaWEoKSB7XG4gICAgICAgIFByb2plY3RzU2VydmljZS5nZXRDdXJyZW50Q3JpdGVyaWEoKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2bS5ydWxlU2V0ID0gZGF0YS5jcml0ZXJpYTtcbiAgICAgICAgICAgICAgICBpZiAodm0ucHJvamVjdC5zY29yZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLnJ1bGVTZXQsIGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0ucHJvamVjdC5zY29yZXMsIGZ1bmN0aW9uIChzY29yZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChydWxlLmlkID09IHNjb3JlLmNyaXRlcmlhX2lkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJ1bGUuc2VsZWN0ZWQgPSBzY29yZS5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHZtLnByb2plY3Quc2NvcmVzID0gW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB2bS5ydWxlU2V0O1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRFbXBsb3llZXMoKSB7XG4gICAgICAgIEVtcGxveWVlU2VhcmNoLnF1ZXJ5KGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2bS5lbXBsb3llZXMgPSBkYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdGVwTmV4dCgpIHtcbiAgICAgICAgdm0ucGFuZWxfaW5kZXgrKztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdGVwQmFjaygpIHtcbiAgICAgICAgdm0ucGFuZWxfaW5kZXgtLTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzYXZlKCkge1xuICAgICAgICBmb3IodmFyIGk9MDsgaSA8IHZtLnNlbGVjdGVkT3duZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcGsgPSB2bS5zZWxlY3RlZE93bmVyc1tpXS5wayA/IHZtLnNlbGVjdGVkT3duZXJzW2ldLnBrIDogdm0uc2VsZWN0ZWRPd25lcnNbaV0uaWQ7XG4gICAgICAgICAgICB2bS5wcm9qZWN0Lm93bmVycy5wdXNoKHBrKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IodmFyIGk9MDsgaSA8IHZtLnNlbGVjdGVkU3BvbnNvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBwayA9IHZtLnNlbGVjdGVkU3BvbnNvcnNbaV0ucGsgPyB2bS5zZWxlY3RlZFNwb25zb3JzW2ldLnBrIDogdm0uc2VsZWN0ZWRTcG9uc29yc1tpXS5pZFxuICAgICAgICAgICAgdm0ucHJvamVjdC5zcG9uc29ycy5wdXNoKHBrKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IodmFyIGk9MDsgaSA8IHZtLnNlbGVjdGVkVGVhbU1lbWJlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBwayA9IHZtLnNlbGVjdGVkVGVhbU1lbWJlcnNbaV0ucGsgPyB2bS5zZWxlY3RlZFRlYW1NZW1iZXJzW2ldLnBrIDogdm0uc2VsZWN0ZWRUZWFtTWVtYmVyc1tpXS5pZDtcbiAgICAgICAgICAgIHZtLnByb2plY3QudGVhbV9tZW1iZXJzLnB1c2gocGspO1xuICAgICAgICB9XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5ydWxlU2V0LCBmdW5jdGlvbiAocnVsZSkge1xuICAgICAgICAgICAgaWYgKHJ1bGUuc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICB2bS5wcm9qZWN0LnNjb3Jlcy5wdXNoKHJ1bGUuc2VsZWN0ZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHZtLnByb2plY3QuaWQpIHtcbiAgICAgICAgICAgIFByb2plY3RzU2VydmljZS51cGRhdGUodm0ucHJvamVjdClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocHJvamVjdCkge1xuICAgICAgICAgICAgICAgICAgICBOb3RpZmljYXRpb24uc3VjY2Vzcyhwcm9qZWN0Lm5hbWUgKyAnIHdhcyBzYXZlZC4nKVxuICAgICAgICAgICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZShwcm9qZWN0KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgUHJvamVjdHNTZXJ2aWNlLnNhdmUodm0ucHJvamVjdClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocHJvamVjdCkge1xuICAgICAgICAgICAgICAgICAgICBOb3RpZmljYXRpb24uc3VjY2Vzcyhwcm9qZWN0Lm5hbWUgKyAnIHdhcyBjcmVhdGVkLicpXG4gICAgICAgICAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKHByb2plY3QpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiOyhmdW5jdGlvbigpIHtcblwidXNlIHN0cmljdFwiO1xuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgncHJvamVjdHMnLCBbJ25nUm91dGUnLCAndWktbm90aWZpY2F0aW9uJ10pO1xuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgncHJvamVjdHMnKVxuICAgIC5mYWN0b3J5KCdQcm9qZWN0c1NlcnZpY2UnLCBQcm9qZWN0c1NlcnZpY2UpO1xuXG5mdW5jdGlvbiBQcm9qZWN0c1NlcnZpY2UoJGh0dHAsICRsb2csIFByb2plY3RzUmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRQcm9qZWN0OiBnZXRQcm9qZWN0LFxuICAgICAgICBnZXRBY3RpdmVQcm9qZWN0czogZ2V0QWN0aXZlUHJvamVjdHMsXG4gICAgICAgIGdldEN1cnJlbnRDcml0ZXJpYTogZ2V0Q3VycmVudENyaXRlcmlhLFxuICAgICAgICBzYXZlOiBzYXZlLFxuICAgICAgICB1cGRhdGU6IHVwZGF0ZVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRDdXJyZW50Q3JpdGVyaWEoKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdjEvcHJvamVjdHMvY3JpdGVyaWEvJylcbiAgICAgICAgICAgIC50aGVuKHN1Y2Nlc3MpXG4gICAgICAgICAgICAuY2F0Y2goZmFpbCk7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdnZXRDdXJyZW50Q3JpdGVyaWEgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQcm9qZWN0KHByb2plY3RJZCkge1xuICAgICAgICByZXR1cm4gUHJvamVjdHNSZXNvdXJjZS5nZXQoe2lkOiBwcm9qZWN0SWR9LCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWlsKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkbG9nLmVycm9yKCdnZXRQcm9qZWN0IGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QWN0aXZlUHJvamVjdHMoKSB7XG4gICAgICAgIHJldHVybiBQcm9qZWN0c1Jlc291cmNlLmdldEFjdGl2ZVByb2plY3RzKG51bGwsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ2dldFByb2plY3QgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzYXZlKHByb2plY3QpIHtcbiAgICAgICAgcmV0dXJuIFByb2plY3RzUmVzb3VyY2Uuc2F2ZShwcm9qZWN0LCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcblxuICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZhaWwocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ3NhdmUgZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGUocHJvamVjdCkge1xuICAgICAgICBjb25zb2xlLmxvZyhwcm9qZWN0KTtcbiAgICAgICAgcmV0dXJuIFByb2plY3RzUmVzb3VyY2UudXBkYXRlKHtpZDogcHJvamVjdC5pZH0sIHByb2plY3QsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFpbChyZXNwb25zZSkge1xuICAgICAgICAgICAgJGxvZy5lcnJvcigndXBkYXRlIGZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgfVxufVxuYW5ndWxhclxuICAgIC5tb2R1bGUoJ3Byb2plY3RzJylcbiAgICAuZmFjdG9yeSgnUHJvamVjdHNSZXNvdXJjZScsIFByb2plY3RzUmVzb3VyY2UpO1xuXG5mdW5jdGlvbiBQcm9qZWN0c1Jlc291cmNlKCRyZXNvdXJjZSkge1xuICAgIHZhciBhY3Rpb25zID0ge1xuICAgICAgICAnZ2V0Jzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJ1xuICAgICAgICB9LFxuICAgICAgICAnZ2V0UHJvamVjdHNCeU93bmVyJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvcHJvamVjdHMvb3duZWQvOmlkLycsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRQcm9qZWN0c0lPd24nOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9wcm9qZWN0cy9vd25lZC9teS8nLFxuICAgICAgICAgICAgaXNBcnJheTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICAnZ2V0UHJvamVjdHNCeVNwb25zb3InOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9wcm9qZWN0cy9zcG9uc29yZWQvOmlkLycsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRQcm9qZWN0c0lTcG9uc29yJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEvcHJvamVjdHMvc3BvbnNvcmVkL215LycsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRQcm9qZWN0c0J5VGVhbU1lbWJlcic6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3Byb2plY3RzL3RlYW0tbWVtYmVyLzppZC8nLFxuICAgICAgICAgICAgaXNBcnJheTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICAnZ2V0UHJvamVjdHNJQW1BVGVhbU1lbWJlcic6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3Byb2plY3RzL3RlYW0tbWVtYmVyL215LycsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdnZXRBY3RpdmVQcm9qZWN0cyc6IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICBpc0FycmF5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICdzYXZlJzoge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxL3Byb2plY3RzL2FkZC8nXG4gICAgICAgIH0sXG4gICAgICAgICd1cGRhdGUnOiB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS9wcm9qZWN0cy86aWQvdXBkYXRlLydcbiAgICAgICAgfSxcbiAgICAgICAgJ2RlbGV0ZSc6IHtcbiAgICAgICAgICAgICdtZXRob2QnOiAnREVMRVRFJ1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gJHJlc291cmNlKCcvYXBpL3YxL3Byb2plY3RzLzppZC8nLCBudWxsLCBhY3Rpb25zKTtcbn1cblxuYW5ndWxhclxuICAgIC5tb2R1bGUoJ3Byb2plY3RzJylcbiAgICAuY29udHJvbGxlcignUHJvamVjdHNDb250cm9sbGVyJywgUHJvamVjdHNDb250cm9sbGVyKTtcblxuZnVuY3Rpb24gUHJvamVjdHNDb250cm9sbGVyKFByb2plY3RzU2VydmljZSwgTm90aWZpY2F0aW9uLCBhbmFseXRpY3MsICRsb2NhdGlvbiwgJG1vZGFsLCAkc2NvcGUsICRzY2UsICRyb290U2NvcGUpIHtcbiAgICAvKiBTaW5jZSB0aGlzIHBhZ2UgY2FuIGJlIHRoZSByb290IGZvciBzb21lIHVzZXJzIGxldCdzIG1ha2Ugc3VyZSB3ZSBjYXB0dXJlIHRoZSBjb3JyZWN0IHBhZ2UgKi9cbiAgICB2YXIgbG9jYXRpb25fdXJsID0gJGxvY2F0aW9uLnVybCgpLmluZGV4T2YoJy9wcm9qZWN0cycpIDwgMCA/ICcvcHJvamVjdHMnIDogJGxvY2F0aW9uLnVybCgpO1xuICAgIGFuYWx5dGljcy50cmFja1BhZ2UoJHNjb3BlLCAkbG9jYXRpb24uYWJzVXJsKCksIGxvY2F0aW9uX3VybCk7XG5cbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLmFjdGl2ZVByb2plY3RzID0gW107XG4gICAgdm0uYWN0aXZlUHJvamVjdHNMb2FkZWQgPSBmYWxzZTtcbiAgICB2bS5zaG93RW1wdHlTY3JlZW4gPSBmYWxzZTtcbiAgICB2bS53ZWxjb21lID0gJHNjZS50cnVzdEFzSHRtbCgkcm9vdFNjb3BlLmN1c3RvbWVyLnByb2plY3RzX3dlbGNvbWUpO1xuICAgIHZtLnN1Ym1pdFByb2plY3QgPSBzdWJtaXRQcm9qZWN0O1xuXG4gICAgYWN0aXZhdGUoKTtcblxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICBnZXRBY3RpdmVQcm9qZWN0cygpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRBY3RpdmVQcm9qZWN0cygpIHtcbiAgICAgICAgUHJvamVjdHNTZXJ2aWNlLmdldEFjdGl2ZVByb2plY3RzKClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdm0uYWN0aXZlUHJvamVjdHMgPSBkYXRhO1xuICAgICAgICAgICAgICAgIHZtLmFjdGl2ZVByb2plY3RzTG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjaGVja0lzRW1wdHkoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdm0uYWN0aXZlUHJvamVjdHM7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGVja0lzRW1wdHkoKSB7XG4gICAgICAgIGlmICh2bS5hY3RpdmVQcm9qZWN0c0xvYWRlZCkge1xuICAgICAgICAgICAgaWYgKHZtLmFjdGl2ZVByb2plY3RzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgdm0uc2hvd0VtcHR5U2NyZWVuID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdm0uc2hvd0VtcHR5U2NyZWVuID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdWJtaXRQcm9qZWN0KCkge1xuICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIHdpbmRvd0NsYXNzOiAneHgtZGlhbG9nIGZhZGUgem9vbScsXG4gICAgICAgICAgICBiYWNrZHJvcDogJ3N0YXRpYycsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9zdGF0aWMvYW5ndWxhci9wcm9qZWN0cy9wYXJ0aWFscy9fbW9kYWxzL2FkZC1wcm9qZWN0Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0FkZFByb2plY3RDb250cm9sbGVyIGFzIGFkZFByb2plY3QnLFxuICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKFxuICAgICAgICAgICAgZnVuY3Rpb24gKHByb2plY3QpIHtcbiAgICAgICAgICAgICAgICBnZXRBY3RpdmVQcm9qZWN0cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxufVxuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgncHJvamVjdHMnKVxuICAgIC5jb250cm9sbGVyKCdQcm9qZWN0Q29udHJvbGxlcicsIFByb2plY3RDb250cm9sbGVyKTtcblxuZnVuY3Rpb24gUHJvamVjdENvbnRyb2xsZXIoUHJvamVjdHNTZXJ2aWNlLCBDb21tZW50LCBOb3RpZmljYXRpb24sIGFuYWx5dGljcywgJGxvY2F0aW9uLCAkbW9kYWwsICRzY29wZSwgJHNjZSwgJHJvb3RTY29wZSwgJHJvdXRlUGFyYW1zKSB7XG4gICAgYW5hbHl0aWNzLnRyYWNrUGFnZSgkc2NvcGUsICRsb2NhdGlvbi5hYnNVcmwoKSwgJGxvY2F0aW9uLnVybCgpKTtcblxuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0ucHJvamVjdCA9IG51bGw7XG4gICAgdm0uc2hvd1N1bW1hcnlFZGl0ID0gZmFsc2U7XG4gICAgdm0uY29tbWVudHMgPSBbXTtcbiAgICB2bS5hZGRDb21tZW50ID0gYWRkQ29tbWVudDtcbiAgICB2bS5lZGl0UHJvamVjdCA9IGVkaXRQcm9qZWN0O1xuXG4gICAgYWN0aXZhdGUoKTtcblxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICBpbml0aWFsaXplTmV3Q29tbWVudCgpO1xuICAgICAgICBnZXRQcm9qZWN0KCk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGluaXRpYWxpemVOZXdDb21tZW50KCkge1xuICAgICAgICB2bS5uZXdDb21tZW50ID0gbmV3IENvbW1lbnQoe2NvbnRlbnQ6JycsIGluY2x1ZGVfaW5fZGFpbHlfZGlnZXN0OnRydWV9KTtcbiAgICAgICAgdm0ubmV3Q29tbWVudC5leHBhbmRUZXh0QXJlYSA9IGZhbHNlO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRQcm9qZWN0KCkge1xuICAgICAgICBQcm9qZWN0c1NlcnZpY2UuZ2V0UHJvamVjdCgkcm91dGVQYXJhbXMucHJvamVjdElkKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2bS5wcm9qZWN0ID0gZGF0YTtcbiAgICAgICAgICAgICAgICB2bS5jb21tZW50cyA9IHZtLnByb2plY3QuY29tbWVudHM7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICAgICAgICAgIE5vdGlmaWNhdGlvbi5lcnJvcihcIlNvcnJ5IHdlIGhhZCBhIHByb2JsZW0gb3BlbmluZyB0aGlzIHByb2plY3QuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZENvbW1lbnQoZm9ybSkge1xuICAgICAgICBpZiAoZm9ybS4kaW52YWxpZCkgcmV0dXJuO1xuICAgICAgICBDb21tZW50LmFkZFRvUHJvamVjdCh7IGlkOiRyb3V0ZVBhcmFtcy5wcm9qZWN0SWR9LCB2bS5uZXdDb21tZW50LCBmdW5jdGlvbihjb21tZW50KSB7XG4gICAgICAgICAgICBpbml0aWFsaXplTmV3Q29tbWVudCgpO1xuICAgICAgICAgICAgdm0uY29tbWVudHMucHVzaChjb21tZW50KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGVkaXRQcm9qZWN0KCkge1xuICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIHdpbmRvd0NsYXNzOiAneHgtZGlhbG9nIGZhZGUgem9vbScsXG4gICAgICAgICAgICBiYWNrZHJvcDogJ3N0YXRpYycsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9zdGF0aWMvYW5ndWxhci9wcm9qZWN0cy9wYXJ0aWFscy9fbW9kYWxzL2FkZC1wcm9qZWN0Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0FkZFByb2plY3RDb250cm9sbGVyIGFzIGFkZFByb2plY3QnLFxuICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm0ucHJvamVjdFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKFxuICAgICAgICAgICAgZnVuY3Rpb24gKHByb2plY3QpIHtcbiAgICAgICAgICAgICAgICBnZXRQcm9qZWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgncHJvamVjdHMnKVxuICAgIC5jb250cm9sbGVyKCdBZGRQcm9qZWN0Q29udHJvbGxlcicsIEFkZFByb2plY3RDb250cm9sbGVyKTtcblxuZnVuY3Rpb24gQWRkUHJvamVjdENvbnRyb2xsZXIocHJvamVjdCwgUHJvamVjdHNTZXJ2aWNlLCBOb3RpZmljYXRpb24sIEVtcGxveWVlU2VhcmNoLCAkbW9kYWxJbnN0YW5jZSkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0ucHJvamVjdCA9IHtcbiAgICAgICAgbmFtZTogbnVsbCxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBvd25lcnM6IFtdLFxuICAgICAgICBzcG9uc29yczogW10sXG4gICAgICAgIHRlYW1fbWVtYmVyczogW10sXG4gICAgICAgIHNjb3JlczogW11cbiAgICB9XG4gICAgdm0uc2VsZWN0ZWRPd25lcnMgPSBbXTtcbiAgICB2bS5zZWxlY3RlZFNwb25zb3JzID0gW107XG4gICAgdm0uc2VsZWN0ZWRUZWFtTWVtYmVycyA9IFtdO1xuICAgIHZtLmVtcGxveWVlcyA9IFtdO1xuICAgIHZtLnN0ZXBOZXh0ID0gc3RlcE5leHQ7XG4gICAgdm0uc3RlcEJhY2sgPSBzdGVwQmFjaztcbiAgICB2bS5jYW5jZWwgPSBjYW5jZWw7XG4gICAgdm0uc2F2ZSA9IHNhdmU7XG4gICAgdm0ucGFuZWxfaW5kZXggPSAwO1xuICAgIHZtLnJ1bGVTZXQgPSBbXTtcblxuICAgIGFjdGl2YXRlKClcblxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICBpZiAocHJvamVjdCkge1xuICAgICAgICAgICAgbG9hZFByb2plY3QoKTtcbiAgICAgICAgfVxuICAgICAgICBnZXRFbXBsb3llZXMoKTtcbiAgICAgICAgZ2V0Q3JpdGVyaWEoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2FkUHJvamVjdCgpIHtcbiAgICAgICAgdm0ucHJvamVjdCA9IGFuZ3VsYXIuY29weShwcm9qZWN0KTtcbiAgICAgICAgdm0uc2VsZWN0ZWRPd25lcnMgPSBhbmd1bGFyLmNvcHkocHJvamVjdC5vd25lcnMpO1xuICAgICAgICB2bS5zZWxlY3RlZFNwb25zb3JzID0gYW5ndWxhci5jb3B5KHByb2plY3Quc3BvbnNvcnMpO1xuICAgICAgICB2bS5zZWxlY3RlZFRlYW1NZW1iZXJzID0gYW5ndWxhci5jb3B5KHByb2plY3QudGVhbV9tZW1iZXJzKTtcbiAgICAgICAgdm0ucHJvamVjdC5vd25lcnMgPSBbXTtcbiAgICAgICAgdm0ucHJvamVjdC5zcG9uc29ycyA9IFtdO1xuICAgICAgICB2bS5wcm9qZWN0LnRlYW1fbWVtYmVycyA9IFtdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldENyaXRlcmlhKCkge1xuICAgICAgICBQcm9qZWN0c1NlcnZpY2UuZ2V0Q3VycmVudENyaXRlcmlhKClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdm0ucnVsZVNldCA9IGRhdGEuY3JpdGVyaWE7XG4gICAgICAgICAgICAgICAgaWYgKHZtLnByb2plY3Quc2NvcmVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5ydWxlU2V0LCBmdW5jdGlvbiAocnVsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLnByb2plY3Quc2NvcmVzLCBmdW5jdGlvbiAoc2NvcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocnVsZS5pZCA9PSBzY29yZS5jcml0ZXJpYV9pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBydWxlLnNlbGVjdGVkID0gc2NvcmUuaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB2bS5wcm9qZWN0LnNjb3JlcyA9IFtdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdm0ucnVsZVNldDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RW1wbG95ZWVzKCkge1xuICAgICAgICBFbXBsb3llZVNlYXJjaC5xdWVyeShmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgdm0uZW1wbG95ZWVzID0gZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RlcE5leHQoKSB7XG4gICAgICAgIHZtLnBhbmVsX2luZGV4Kys7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RlcEJhY2soKSB7XG4gICAgICAgIHZtLnBhbmVsX2luZGV4LS07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2F2ZSgpIHtcbiAgICAgICAgZm9yKHZhciBpPTA7IGkgPCB2bS5zZWxlY3RlZE93bmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHBrID0gdm0uc2VsZWN0ZWRPd25lcnNbaV0ucGsgPyB2bS5zZWxlY3RlZE93bmVyc1tpXS5wayA6IHZtLnNlbGVjdGVkT3duZXJzW2ldLmlkO1xuICAgICAgICAgICAgdm0ucHJvamVjdC5vd25lcnMucHVzaChwayk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yKHZhciBpPTA7IGkgPCB2bS5zZWxlY3RlZFNwb25zb3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcGsgPSB2bS5zZWxlY3RlZFNwb25zb3JzW2ldLnBrID8gdm0uc2VsZWN0ZWRTcG9uc29yc1tpXS5wayA6IHZtLnNlbGVjdGVkU3BvbnNvcnNbaV0uaWRcbiAgICAgICAgICAgIHZtLnByb2plY3Quc3BvbnNvcnMucHVzaChwayk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yKHZhciBpPTA7IGkgPCB2bS5zZWxlY3RlZFRlYW1NZW1iZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcGsgPSB2bS5zZWxlY3RlZFRlYW1NZW1iZXJzW2ldLnBrID8gdm0uc2VsZWN0ZWRUZWFtTWVtYmVyc1tpXS5wayA6IHZtLnNlbGVjdGVkVGVhbU1lbWJlcnNbaV0uaWQ7XG4gICAgICAgICAgICB2bS5wcm9qZWN0LnRlYW1fbWVtYmVycy5wdXNoKHBrKTtcbiAgICAgICAgfVxuICAgICAgICBhbmd1bGFyLmZvckVhY2godm0ucnVsZVNldCwgZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgICAgICAgIGlmIChydWxlLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgdm0ucHJvamVjdC5zY29yZXMucHVzaChydWxlLnNlbGVjdGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh2bS5wcm9qZWN0LmlkKSB7XG4gICAgICAgICAgICBQcm9qZWN0c1NlcnZpY2UudXBkYXRlKHZtLnByb2plY3QpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHByb2plY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgTm90aWZpY2F0aW9uLnN1Y2Nlc3MocHJvamVjdC5uYW1lICsgJyB3YXMgc2F2ZWQuJylcbiAgICAgICAgICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2UocHJvamVjdClcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFByb2plY3RzU2VydmljZS5zYXZlKHZtLnByb2plY3QpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHByb2plY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgTm90aWZpY2F0aW9uLnN1Y2Nlc3MocHJvamVjdC5uYW1lICsgJyB3YXMgY3JlYXRlZC4nKVxuICAgICAgICAgICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZShwcm9qZWN0KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxufSgpKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
