var app = angular.module('tdb', ['tdb.services', 'tdb.controllers', 'tdb.directives', 'tdb.filters', 'angular-carousel', 'analytics'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
          when('/', {templateUrl: '/static/angular/partials/company-overview.html', controller: 'CompanyOverviewCtrl'}).
          when('/evaluations/current', {templateUrl: '/static/angular/partials/evaluation-list.html', controller: 'EvaluationListCtrl'}).
          when('/teams/:id/', {templateUrl: '/static/angular/partials/team-overview.html', controller: 'TeamOverviewCtrl'}).
          when('/employees', {templateUrl: '/static/angular/partials/employee-list.html', controller: 'EmployeeListCtrl'}).
          when('/employees/:id', {templateUrl: '/static/angular/partials/employee-detail.html', controller: 'EmployeeDetailCtrl'}).
          when('/leaders/:id', {templateUrl: '/static/angular/partials/leader-detail.html', controller: 'LeaderDetailCtrl'}).          
          otherwise({redirectTo: '/'});
    }]);