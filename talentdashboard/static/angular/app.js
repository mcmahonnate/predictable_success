angular.module('tdb', ['tdb.services', 'tdb.controllers', 'tdb.directives', 'angular-carousel']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/employees', {templateUrl: '/static/angular/partials/employee-list.html',   controller: controllers.EmployeeListCtrl}).
      when('/employees/:id', {templateUrl: '/static/angular/partials/employee-detail.html', controller: controllers.EmployeeDetailCtrl}).
      otherwise({redirectTo: '/employees'});
}]);