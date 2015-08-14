var app = angular.module('tdb', [
        'tdb.services', 'tdb.controllers', 'tdb.directives', 'tdb.filters',
        'tdb.preferences.services',
        'tdb.search.controllers', 'tdb.search.services',
        'tdb.services.tasks', 'tdb.controllers.tasks',
        'tdb.controllers.comments',
        'tdb.controllers.search',
        'tdb.controllers.employeesSnapshot',
        'tdb.services.activity', 'tdb.controllers.activity',
        'tdb.checkins.services', 'tdb.checkins.controllers',
        'tdb.engagement.services', 'angular.filter',
        'angular-carousel', 'analytics', 'ui.bootstrap', 'ngCsv','ngImgCrop', 'ngRoute','ui-notification', 'ngMessages'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
          when('/', {template: '<div ng-include src="templateUrl"></div>', controller: 'CompanyOverviewCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
          when('/upload-data', {templateUrl: '/static/angular/partials/upload-data.html', controller: 'UploadDataCtrl'}).
          when('/engagement-survey/:employeeId/:surveyId', {templateUrl: '/static/angular/partials/engagement-survey.html', controller: 'EngagementSurveyCtrl'}).
          when('/team-survey/:employeeId/:surveyId', {templateUrl: '/static/angular/partials/team-survey.html'}).
          when('/reports', {templateUrl: '/static/angular/partials/reports.html', controller: 'ReportsCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
          when('/teams/:id/', {template: '<div ng-include src="templateUrl"></div>', controller: 'TeamOverviewCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
          when('/employees/:id/discussions', {templateUrl: '/static/angular/partials/employee-discussion-overview.html', controller: 'EmployeeDetailCtrl', resolve: {authorizeRoute: authorizeRoute}}).
          when('/employees/my-team', {templateUrl: '/static/angular/partials/employee-list.html', controller: 'EmployeeSearchCtrl', resolve: {authorizeRoute: authorizeRoute, view: function() {return 'my-team';}}}).
          when('/employees/my-coachees', {templateUrl: '/static/angular/partials/employee-list.html', controller: 'EmployeeSearchCtrl', resolve: {authorizeRoute: authorizeRoute, view: function() {return 'my-coachees';}}}).
          when('/employees/:id', {templateUrl: '/static/angular/partials/employee-detail.html', controller: 'EmployeeDetailCtrl', resolve: {authorizeRoute: authorizeRoute}}).
          when('/employees', {templateUrl: '/static/angular/partials/employee-list.html', controller: 'EmployeeSearchCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute, view: function() {return '';}}}).
          when('/coach', {templateUrl: '/static/angular/partials/coach-overview.html', controller: 'CoachDetailCtrl', resolve: {authorizeRoute: authorizeRoute}}).
          when('/pvp/todo', {templateUrl: '/static/angular/partials/pvp-todo.html', controller: 'PvpEvaluationTodosCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
          when('/pvp/todos', {templateUrl: '/static/angular/partials/pvp-todo-list.html', controller: 'PvpTodoListCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
          when('/team-lead', {template: '<div ng-include src="templateUrl"></div>', controller: 'LeaderOverviewCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
          when('/feedback/', {templateUrl: '/static/angular/partials/feedback/index.html', controller: 'RequestFeedbackCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
          when('/reports/self-assess', {templateUrl: '/static/angular/partials/self-assess-report.html', controller: 'SelfAssessReportCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
          when('/reports/timespan', {templateUrl: '/static/angular/partials/timespan-report.html', controller: 'TimespanReportCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
          when('/reports/activity', {templateUrl: '/static/angular/partials/activity-report.html', controller: 'ReportsCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
          when('/tasks', {templateUrl: '/static/angular/partials/tasks.html', controller: 'TasksCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
          when('/checkin/:id', {templateUrl: '/static/angular/partials/checkin.html', controller: 'AddEditCheckInCtrl', resolve: {authorizeRoute: authorizeRoute}}).       
          when('/checkin', {templateUrl: '/static/angular/partials/checkin.html', controller: 'AddEditCheckInCtrl', resolve: {authorizeRoute: authorizeRoute}}).
          when('/checkins/:id', {templateUrl: '/static/angular/partials/checkin-detail.html', controller: 'AddEditCheckInCtrl', resolve: {authorizeRoute: authorizeRoute}}).
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