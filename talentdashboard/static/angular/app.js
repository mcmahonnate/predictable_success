var app = angular.module('tdb', [
        'tdb.services', 'tdb.search.controllers', 'tdb.search.services', 'tdb.services.tasks', 'tdb.controllers', 'tdb.controllers.tasks', 'tdb.controllers.comments', 'tdb.directives', 'tdb.filters', 'angular-carousel', 'analytics', 'ui.bootstrap', 'ngCsv','ngRoute','ui-notification'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
          when('/', {templateUrl: '/static/angular/partials/company-overview.html', controller: 'CompanyOverviewCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
          when('/upload-data', {templateUrl: '/static/angular/partials/upload-data.html', controller: 'UploadDataCtrl'}).
          when('/people-report', {templateUrl: '/static/angular/partials/people-reports.html', controller: 'PeopleReportCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
          when('/engagement-survey/:employeeId/:surveyId', {templateUrl: '/static/angular/partials/engagement-survey.html', controller: 'EngagementSurveyCtrl'}).
          when('/team-survey/:employeeId/:surveyId', {templateUrl: '/static/angular/partials/team-survey.html'}).
          when('/reports', {templateUrl: '/static/angular/partials/reports.html', controller: 'ReportsCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
          when('/teams/:id/', {templateUrl: '/static/angular/partials/team-overview.html', controller: 'TeamOverviewCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
          when('/employees/:id/discussions', {templateUrl: '/static/angular/partials/employee-discussion-overview.html', controller: 'EmployeeDetailCtrl', resolve: {authorizeRoute: authorizeRoute}}).
          when('/employees/:id', {templateUrl: '/static/angular/partials/employee-detail.html', controller: 'EmployeeDetailCtrl', resolve: {authorizeRoute: authorizeRoute}}).
          when('/employees', {templateUrl: '/static/angular/partials/employee-search.html', controller: 'EmployeeSearchCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
          when('/coach', {templateUrl: '/static/angular/partials/coach-overview.html', controller: 'CoachDetailCtrl', resolve: {authorizeRoute: authorizeRoute}}).
          when('/pvp/todo', {templateUrl: '/static/angular/partials/pvp-todo.html', controller: 'PvpEvaluationTodosCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
          when('/team-lead', {templateUrl: '/static/angular/partials/leader-overview.html', controller: 'LeaderOverviewCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
          when('/feedback/', {templateUrl: '/static/angular/partials/feedback/index.html', controller: 'RequestFeedbackCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
          otherwise({redirectTo: '/'});
    }])
    .run(['$rootScope', 'User', 'TalentCategories', 'Customers', function($rootScope, User, TalentCategories, Customers) {
        User.get(function(data) {
            $rootScope.currentUser = data;
        });
        Customers.get(function(data) {
            $rootScope.customer = data;
        });
        $rootScope.talentCategories = TalentCategories.categories;
    }]);

app.config(function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
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