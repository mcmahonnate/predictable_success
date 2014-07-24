var app = angular.module('tdb', ['tdb.services', 'tdb.controllers', 'tdb.directives', 'tdb.filters', 'angular-carousel', 'analytics', 'ui.bootstrap'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
          when('/', {templateUrl: '/static/angular/partials/company-overview.html', controller: 'CompanyOverviewCtrl', resolve: {authorizeRoute: authorizeRoute}}).
          when('/people-report', {templateUrl: '/static/angular/partials/people-reports.html', controller: 'PeopleReportCtrl', resolve: {authorizeRoute: authorizeRoute}}).
          when('/reports', {templateUrl: '/static/angular/partials/reports.html', controller: 'ReportsCtrl', resolve: {authorizeRoute: authorizeRoute}}).
          when('/evaluations/current', {templateUrl: '/static/angular/partials/evaluation-list.html', controller: 'EvaluationListCtrl', resolve: {authorizeRoute: authorizeRoute}}).
          when('/teams/:id/', {templateUrl: '/static/angular/partials/team-overview.html', controller: 'TeamOverviewCtrl', resolve: {authorizeRoute: authorizeRoute}}).
          when('/employees', {templateUrl: '/static/angular/partials/employee-list.html', controller: 'EmployeeListCtrl', resolve: {authorizeRoute: authorizeRoute}}).
          when('/employees/:id', {templateUrl: '/static/angular/partials/employee-detail.html', controller: 'EmployeeDetailCtrl', resolve: {authorizeRoute: authorizeRoute}}).
          when('/discussions', {templateUrl: '/static/angular/partials/discussion-overview.html', controller: 'DiscussionOverviewCtrl', resolve: {authorizeRoute: authorizeRoute}}).
          when('/discussions/:id', {templateUrl: '/static/angular/partials/discussion-detail.html', controller: 'DiscussionDetailCtrl', resolve: {authorizeRoute: authorizeRoute}}).
          when('/employees/:id/discussions', {templateUrl: '/static/angular/partials/employee-discussion-overview.html', controller: 'EmployeeDetailCtrl', resolve: {authorizeRoute: authorizeRoute}}).
          when('/leaders/:id', {templateUrl: '/static/angular/partials/leader-detail.html', controller: 'LeaderDetailCtrl', resolve: {authorizeRoute: authorizeRoute}}).
          when('/org-chart', {templateUrl: '/static/angular/partials/org-chart.html', controller: 'orgDiagramCtrl', resolve: {authorizeRoute: authorizeRoute}}).
          otherwise({redirectTo: '/'});
    }]);
    
var authorizeRoute = function($http) {
    return $http.get("/api/v1/user-status/");
}    