app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/', {template: '<div ng-include src="templateUrl"></div>', controller: 'CompanyOverviewCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/upload-data', {templateUrl: '/static/angular/partials/upload-data.html', controller: 'UploadDataCtrl'}).
      when('/engagement-survey/:employeeId/:surveyId', {templateUrl: '/static/angular/partials/engagement-survey.html', controller: 'EngagementSurveyCtrl'}).
      when('/team-survey/:employeeId/:surveyId', {templateUrl: '/static/angular/partials/team-survey.html'}).
      when('/reports', {templateUrl: '/static/angular/partials/reports.html', controller: 'ReportsCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/teams/:id/', {template: '<div ng-include src="templateUrl"></div>', controller: 'TeamOverviewCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/employees/:id/discussions', {templateUrl: '/static/angular/partials/employee-discussion-overview.html', controller: 'EmployeeDetailCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/employees/my-team', {templateUrl: '/static/angular/partials/employee-list.html', controller: 'EmployeeSearchCtrl', resolve: {authorizeRoute: authorizeRoute, view: function() {return 'my-team';}}}).
      when('/employees/my-coachees', {templateUrl: '/static/angular/partials/employee-list.html', controller: 'EmployeeSearchCtrl', resolve: {authorizeRoute: authorizeRoute, view: function() {return 'my-coachees';}}}).
      when('/employees/:id', {templateUrl: '/static/angular/partials/employee-detail.html', controller: 'EmployeeDetailCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/employees', {templateUrl: '/static/angular/partials/employee-list.html', controller: 'EmployeeSearchCtrl', resolve: {authorizeRoute: authorizeRoute, view: function() {return '';}}}).
      when('/my-coachees', {templateUrl: '/static/angular/partials/coach-overview.html', controller: 'CoachDetailCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/pvp/todo', {templateUrl: '/static/angular/partials/pvp-todo.html', controller: 'PvpEvaluationTodosCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/pvp/todos', {templateUrl: '/static/angular/partials/pvp-todo-list.html', controller: 'PvpTodoListCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/my-team', {template: '<div ng-include src="templateUrl"></div>', controller: 'LeaderOverviewCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/feedback/', {templateUrl: '/static/angular/partials/feedback/index.html', controller: 'RequestFeedbackCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/feedback/request', {templateUrl: '/static/angular/partials/feedback/request.html', controller: 'RequestFeedbackController as request', resolve: {authorizeRoute: authorizeRoute}}).
      when('/reports/self-assess', {templateUrl: '/static/angular/partials/self-assess-report.html', controller: 'SelfAssessReportCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/reports/timespan', {templateUrl: '/static/angular/partials/timespan-report.html', controller: 'TimespanReportCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/reports/activity', {templateUrl: '/static/angular/partials/activity-report.html', controller: 'ReportsCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/tasks', {templateUrl: '/static/angular/partials/tasks.html', controller: 'TasksCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/checkin/:id', {templateUrl: '/static/angular/partials/checkin.html', controller: 'AddEditCheckInCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/checkin', {templateUrl: '/static/angular/partials/checkin.html', controller: 'AddEditCheckInCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/checkins/:id', {templateUrl: '/static/angular/partials/checkin-detail.html', controller: 'AddEditCheckInCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      otherwise({redirectTo: '/'});
}]);