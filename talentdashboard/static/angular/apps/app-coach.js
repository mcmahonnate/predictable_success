app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/', {templateUrl: '/static/angular/partials/coach-overview.html', controller: 'CoachDetailCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/engagement-survey/:employeeId/:surveyId', {templateUrl: '/static/angular/partials/engagement-survey.html', controller: 'EngagementSurveyCtrl'}).
      when('/employees/my-coachees', {templateUrl: '/static/angular/partials/employee-list.html', controller: 'EmployeeSearchCtrl', resolve: {authorizeRoute: authorizeRoute, view: function() {return 'my-coachees';}}}).
      when('/employees/:id', {templateUrl: '/static/angular/partials/employee-detail.html', controller: 'EmployeeDetailCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/coach', {templateUrl: '/static/angular/partials/coach-overview.html', controller: 'CoachDetailCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/tasks', {templateUrl: '/static/angular/partials/tasks.html', controller: 'TasksCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/checkin/:id', {templateUrl: '/static/angular/partials/checkin.html', controller: 'AddEditCheckInCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/checkin', {templateUrl: '/static/angular/partials/checkin.html', controller: 'AddEditCheckInCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/checkins/:id', {templateUrl: '/static/angular/partials/checkin-detail.html', controller: 'AddEditCheckInCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      otherwise({redirectTo: '/'});
}]);