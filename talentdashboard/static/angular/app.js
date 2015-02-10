var app = angular.module('tdb', ['tdb.services', 'tdb.controllers', 'tdb.directives', 'tdb.filters', 'angular-carousel', 'analytics', 'ui.bootstrap', 'ngCsv'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
          when('/', {templateUrl: '/static/angular/partials/company-overview.html', controller: 'CompanyOverviewCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
          when('/people-report', {templateUrl: '/static/angular/partials/people-reports.html', controller: 'PeopleReportCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
          when('/reports', {templateUrl: '/static/angular/partials/reports.html', controller: 'ReportsCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
          when('/evaluations/my-team', {templateUrl: '/static/angular/partials/evaluation-list.html', controller: 'MyTeamEvaluationListCtrl', resolve: {authorizeRoute: authorizeRoute}}).
          when('/evaluations/current', {templateUrl: '/static/angular/partials/evaluation-list.html', controller: 'EvaluationListCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
          when('/teams/:id/', {templateUrl: '/static/angular/partials/team-overview.html', controller: 'TeamOverviewCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
          when('/employees', {templateUrl: '/static/angular/partials/employee-list.html', controller: 'EmployeeListCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
          when('/employees/:id', {templateUrl: '/static/angular/partials/employee-detail.html', controller: 'EmployeeDetailCtrl', resolve: {authorizeRoute: authorizeRoute}}).
          when('/coach', {templateUrl: '/static/angular/partials/coach-detail.html', controller: 'CoachDetailCtrl', resolve: {authorizeRoute: authorizeRoute}}).
          when('/discussions', {templateUrl: '/static/angular/partials/discussion-overview.html', controller: 'DiscussionOverviewCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
          when('/discussions/:id', {templateUrl: '/static/angular/partials/discussion-detail.html', controller: 'DiscussionDetailCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
          when('/employees/:id/discussions', {templateUrl: '/static/angular/partials/employee-discussion-overview.html', controller: 'EmployeeDetailCtrl', resolve: {authorizeRoute: authorizeRoute}}).
          when('/leaders/:id', {templateUrl: '/static/angular/partials/leader-detail.html', controller: 'LeaderDetailCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
          when('/pvp/todo', {templateUrl: '/static/angular/partials/pvp-todo.html', controller: 'PvpEvaluationTodosCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
          when('/team-lead', {templateUrl: '/static/angular/partials/leader-overview.html', controller: 'LeaderOverviewCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).

          otherwise({redirectTo: '/'});
    }])
    .run(function($rootScope, User) {
       User.get(function(data) {
               $rootScope.currentUser = data;
           }
       );
    });
    
var authorizeRoute = function($http) {
    return $http.get("/api/v1/user-status/");
}

var reRoute = function($q, $rootScope, $location, User) {
       User.get(function(data) {
               $rootScope.currentUser = data;
                if ($rootScope.currentUser.can_view_company_dashboard) {
                    return true;
                } else if ($rootScope.currentUser.is_team_lead) {
                    $location.path('/team-lead');
                } else if ($rootScope.currentUser.can_coach_employees) {
                    $location.path('/coach');
                } else if ($rootScope.currentUser.can_evaluate_employees) {
                    $location.path('/pvp/todo');
                } else {
                    return false;
                }
           }
       );

}