app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/', {templateUrl: '/static/angular/leadership-style/partials/index.html' , controller: 'LeadershipStyleController as index', resolve: {authorizeRoute: authorizeRoute}}).
      when('/leadership-style/request/:requestId/reply', {templateUrl: '/static/angular/leadership-style/partials/index.html', controller: 'LeadershipStyleController as index', resolve: {authorizeRoute: authorizeRoute}}).
      when('/upload-data', {templateUrl: '/static/angular/import/partials/upload-data.html', controller: 'UploadDataCtrl'}).
      when('/employees/:id', {templateUrl: '/static/angular/partials/employee-detail.html', controller: 'EmployeeDetailCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/employees', {templateUrl: '/static/angular/partials/employee-list.html', controller: 'EmployeeSearchCtrl', resolve: {authorizeRoute: authorizeRoute, view: function() {return '';}}}).
      otherwise({redirectTo: '/'});
}]);