var app = angular.module('tdb', [
        'tdb.services', 'tdb.controllers', 'tdb.directives', 'tdb.filters',
        'tdb.activity.controllers', 'tdb.activity.services',
        'tdb.comments.controllers', 'tdb.comments.services',
        'tdb.comp.services',
        'tdb.customers.services',
        'tdb.import.controllers', 'tdb.import.services',
        'tdb.org.controllers', 'tdb.org.services',
        'tdb.preferences.services',
        'tdb.search.controllers', 'tdb.search.services',
        'angular.filter',
        'leadership-style', 'profile', 'qualities',
        'angular-carousel', 'analytics', 'ui.bootstrap', 'ngCsv','ngImgCrop', 'ngRoute', 'ngAnimate', 'ui-notification', 'ngMessages', 'readMore', 'ngCookies', 'ui.select', 'selectize','ngTouch'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/', {templateUrl: '/static/angular/leadership-style/partials/index.html' , controller: 'LeadershipStyleController as index', resolve: {authorizeRoute: authorizeRoute}}).
            when('/qualities/perception/request/:requestId/reply', {templateUrl: '/static/angular/qualities/partials/submission.html', controller: 'AssessQualitiesController as assessQualities', resolve: {authorizeRoute: authorizeRoute}}).
            when('/qualities/perception/submission', {templateUrl: '/static/angular/qualities/partials/submission.html', controller: 'AssessQualitiesController as assessQualities', resolve: {authorizeRoute: authorizeRoute}}).
            when('/qualities/perception/submission/:categoryId/:employeeId', {templateUrl: '/static/angular/qualities/partials/submission.html', controller: 'AssessQualitiesController as assessQualities', resolve: {authorizeRoute: authorizeRoute}}).
            when('/qualities/perception/my', {templateUrl: '/static/angular/qualities/partials/strengths-report.html', controller: 'QualitiesReportController as qualitiesReport', resolve: {authorizeRoute: authorizeRoute}}).
            otherwise({redirectTo: '/'});
    }])
    .run(['$document', '$rootScope', 'User', 'Customers', 'privacyMode', function($document, $rootScope, User, Customers, privacyMode) {
        $rootScope.customer = Customers.get();
        $rootScope.currentUser = User.get();

        $rootScope.$on('$routeChangeStart', function () {
            //Remove any lingering modal backdrops
            $document.find('.modal-backdrop').remove();
        });

        $rootScope.$on('$routeChangeSuccess', function () {
            privacyMode($rootScope);
        });

    }]);

app.config(function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
});

var authorizeRoute = function($http) {
    return $http.get("/api/v1/org/user/");
}