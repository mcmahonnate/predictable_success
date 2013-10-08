angular.module('tdb', ['tdb.services', 'tdb.controllers', 'tdb.directives', 'angular-carousel']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/evaluations/current', {templateUrl: '/static/angular/partials/evaluation-list.html', controller: 'EvaluationListCtrl'}).
      when('/overview', {templateUrl: '/static/angular/partials/company-detail.html'}).
      when('/employees', {templateUrl: '/static/angular/partials/employee-list.html', controller: 'EmployeeListCtrl'}).
      when('/employees/:id', {templateUrl: '/static/angular/partials/employee-detail.html', controller: 'EmployeeDetailCtrl'}).
      otherwise({redirectTo: '/overview'});
}]);