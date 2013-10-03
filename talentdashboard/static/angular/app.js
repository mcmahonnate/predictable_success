angular.module('tdb', ['tdb.services', 'tdb.directives']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/employees', {templateUrl: '/static/angular/partials/employee-list.html',   controller: EmployeeListCtrl}).
      when('/employees/:id', {templateUrl: '/static/angular/partials/employee-detail.html', controller: EmployeeDetailCtrl}).
      otherwise({redirectTo: '/employees'});
}]);