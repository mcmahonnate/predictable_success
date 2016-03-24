app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/', {template: '<div ng-include src="templateUrl"></div>', controller: 'CompanyOverviewCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/upload-data', {templateUrl: '/static/angular/partials/upload-data.html', controller: 'UploadDataCtrl'}).
      when('/engagement-survey/:employeeId/:surveyId', {templateUrl: '/static/angular/partials/engagement-survey.html', controller: 'EngagementSurveyCtrl'}).
      when('/team-survey/:employeeId/:surveyId', {templateUrl: '/static/angular/partials/team-survey.html'}).
      when('/reports', {templateUrl: '/static/angular/partials/reports.html', controller: 'ReportsCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/teams/:teamId/', {template: '<div ng-include src="templateUrl"></div>', controller: 'TeamOverviewCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/id/meetings/:meetingId', {templateUrl: '/static/angular/devzones/partials/meeting.html', controller: 'MeetingController as meeting', resolve: {authorizeRoute: authorizeRoute}}).
      when('/employees/:id/discussions', {templateUrl: '/static/angular/partials/employee-discussion-overview.html', controller: 'EmployeeDetailCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/employees/my-team', {templateUrl: '/static/angular/partials/employee-list.html', controller: 'EmployeeSearchCtrl', resolve: {authorizeRoute: authorizeRoute, view: function() {return 'my-team';}}}).
      when('/employees/team-lead/:id', {templateUrl: '/static/angular/partials/employee-list.html', controller: 'EmployeeSearchCtrl', resolve: {authorizeRoute: authorizeRoute, view: function() {return 'team-lead';}}}).
      when('/employees/my-coachees', {templateUrl: '/static/angular/partials/employee-list.html', controller: 'EmployeeSearchCtrl', resolve: {authorizeRoute: authorizeRoute, view: function() {return 'my-coachees';}}}).
      when('/employees/:id', {templateUrl: '/static/angular/partials/employee-detail.html', controller: 'EmployeeDetailCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/employees', {templateUrl: '/static/angular/partials/employee-list.html', controller: 'EmployeeSearchCtrl', resolve: {authorizeRoute: authorizeRoute, view: function() {return '';}}}).
      when('/my-coachees', {templateUrl: '/static/angular/partials/coach-overview.html', controller: 'CoachDetailCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/pvp/todo', {templateUrl: '/static/angular/partials/pvp-todo.html', controller: 'PvpEvaluationTodosCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/pvp/todos', {templateUrl: '/static/angular/partials/pvp-todo-list.html', controller: 'PvpTodoListCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/my-team', {template: '<div ng-include src="templateUrl"></div>', controller: 'MyTeamOverviewCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/team-lead/:id', {templateUrl: '/static/angular/partials/leader-overview-default.html', controller: 'LeaderOverviewCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/reports/self-assess', {templateUrl: '/static/angular/partials/self-assess-report.html', controller: 'SelfAssessReportCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/reports/timespan', {templateUrl: '/static/angular/partials/timespan-report.html', controller: 'TimespanReportCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/reports/activity', {templateUrl: '/static/angular/partials/activity-report.html', controller: 'ReportsCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/reports/id', {templateUrl: '/static/angular/devzones/partials/report.html', controller: 'DevZonesReportController as devzonesReport', resolve: {authorizeRoute: authorizeRoute}}).
      when('/reports/feedback', {templateUrl: '/static/angular/partials/feedback/report.html', controller: 'FeedbackReportController as feedbackReport', resolve: {authorizeRoute: authorizeRoute}}).
      when('/reports/checkins', {templateUrl: '/static/angular/checkins/partials/report.html', controller: 'CheckInsReportController as checkinsReport', resolve: {authorizeRoute: authorizeRoute}}).
      when('/tasks', {templateUrl: '/static/angular/partials/tasks.html', controller: 'TasksCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/checkin/:id', {templateUrl: '/static/angular/checkins/partials/checkin.html', controller: 'CheckInController as viewCheckin', resolve: {authorizeRoute: authorizeRoute}}).
      when('/checkin', {templateUrl: '/static/angular/checkins/partials/checkin.html', controller: 'CheckInController as viewCheckin', resolve: {authorizeRoute: authorizeRoute}}).
      otherwise({redirectTo: '/'});
}]);