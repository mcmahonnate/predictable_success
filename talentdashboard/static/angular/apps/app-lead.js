app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/', {templateUrl: '/static/angular/profile/partials/profile.html', controller: 'ProfileController as profile', resolve: {authorizeRoute: authorizeRoute}}).
      when('/employees/my-team', {templateUrl: '/static/angular/partials/employee-list.html', controller: 'EmployeeSearchCtrl', resolve: {authorizeRoute: authorizeRoute, view: function() {return 'my-team';}}}).
      when('/employees/team-lead/:id', {templateUrl: '/static/angular/partials/employee-list.html', controller: 'EmployeeSearchCtrl', resolve: {authorizeRoute: authorizeRoute, view: function() {return 'team-lead';}}}).
      when('/employees/:id', {templateUrl: '/static/angular/partials/employee-detail.html', controller: 'EmployeeDetailCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/devzones/meetings/:meetingId', {templateUrl: '/static/angular/devzones/partials/conversations.html', controller: 'MeetingController as meeting', resolve: {authorizeRoute: authorizeRoute}}).
      when('/id/meetings/:meetingId', {templateUrl: '/static/angular/devzones/partials/meeting.html', controller: 'MeetingController as meeting', resolve: {authorizeRoute: authorizeRoute}}).
      when('/my-team', {template: '<div ng-include src="templateUrl"></div>', controller: 'MyTeamOverviewCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/tasks', {templateUrl: '/static/angular/partials/tasks.html', controller: 'TasksCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/team-lead/:id', {templateUrl: '/static/angular/partials/leader-overview-default.html', controller: 'LeaderOverviewCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/checkin/:id', {templateUrl: '/static/angular/checkins/partials/checkin.html', controller: 'CheckInController as viewCheckin', resolve: {authorizeRoute: authorizeRoute}}).
      when('/checkin', {templateUrl: '/static/angular/checkins/partials/checkin.html', controller: 'CheckInController as viewCheckin', resolve: {authorizeRoute: authorizeRoute}}).
      otherwise({redirectTo: '/'});
}]);