app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/', {template: '<div ng-include src="templateUrl"></div>', controller: 'CompanyOverviewCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/upload-data', {templateUrl: '/static/angular/import/partials/upload-data.html', controller: 'UploadDataCtrl'}).
      when('/employees/:id', {templateUrl: '/static/angular/partials/employee-detail.html', controller: 'EmployeeDetailCtrl', resolve: {authorizeRoute: authorizeRoute}}).
      when('/employees', {templateUrl: '/static/angular/partials/employee-list.html', controller: 'EmployeeSearchCtrl', resolve: {authorizeRoute: authorizeRoute, view: function() {return '';}}}).
      otherwise({redirectTo: '/'});
}]);