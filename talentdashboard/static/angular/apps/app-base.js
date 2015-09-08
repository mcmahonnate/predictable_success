var app = angular.module('tdb', [
        'tdb.services', 'tdb.controllers', 'tdb.directives', 'tdb.filters',
        'tdb.preferences.services',
        'tdb.search.controllers', 'tdb.search.services',
        'tdb.services.tasks', 'tdb.controllers.tasks',
        'tdb.controllers.comments',
        'tdb.controllers.search',
        'tdb.controllers.employeesSnapshot',
        'tdb.controllers.reports',
        'tdb.services.activity', 'tdb.controllers.activity',
        'tdb.checkins.services', 'tdb.checkins.controllers',
        'tdb.engagement.services', 'angular.filter',
        'angular-carousel', 'analytics', 'ui.bootstrap', 'ngCsv','ngImgCrop', 'ngRoute','ui-notification', 'ngMessages'
]);

app.run(['$rootScope', 'User', 'TalentCategories', 'Customers', function($rootScope, User, TalentCategories, Customers) {
    User.get(function(data) {
        $rootScope.currentUser = data;
    });
    Customers.get(function(data) {
        $rootScope.customer = data;
    });
    $rootScope.talentCategories = TalentCategories.categories;
}]);

app.config(function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
});

var authorizeRoute = function($http) {
    return $http.get("/api/v1/user-status/");
}