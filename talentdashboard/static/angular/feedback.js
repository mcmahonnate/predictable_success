var app = angular.module('feedback', [
            'ngRoute',
            'ngSanitize',
            'ui.select',
            'tdb.feedback.services',
            'tdb.feedback.controllers',
            'ui-notification'
        ])
        .config(['$routeProvider',
            function ($routeProvider) {
                $routeProvider.
                    when('/request/', {templateUrl: '/static/angular/feedback/partials/request.html', controller: 'RequestFeedbackCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
                    when('/submit/', {templateUrl: '/static/angular/feedback/partials/submit.html', controller: 'FeedbackRequestsCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
                    when('/submit/unsolicited/', {templateUrl: '/static/angular/feedback/partials/unsolicited_feedback.html', controller: 'SubmitFeedbackCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
                    when('/submit/:id', {templateUrl: '/static/angular/feedback/partials/respond_to_request.html', controller: 'ReplyToFeedbackRequestCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
                    when('/my/', {templateUrl: '/static/angular/feedback/partials/mine.html', controller: 'MyFeedbackCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
                    when('/my/:id', {templateUrl: '/static/angular/feedback/partials/read-feedback.html', controller: 'ViewFeedbackCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
                    when('/deliver/', {templateUrl: '/static/angular/feedback/partials/coach_report.html', controller: 'CoacheesReportCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
                    when('/deliver/:id', {templateUrl: '/static/angular/feedback/partials/compiled_feedback.html', controller: 'CoacheeFeedbackCtrl', resolve: {authorizeRoute: authorizeRoute, factory: reRoute}}).
                    otherwise({redirectTo: '/my'});
            }])
        .config(['$resourceProvider', function($resourceProvider) {
            $resourceProvider.defaults.stripTrailingSlashes = false;
        }])
        .run(function ($rootScope, User) {
            User.get(function (data) {
                    $rootScope.currentUser = data;
                }
            );
        })
    ;

app.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function (item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});

var authorizeRoute = function ($http) {
    return $http.get("/api/v1/user-status/");
}

var reRoute = function ($q, $rootScope, $location, User) {
    User.get(function (data) {
            $rootScope.currentUser = data;
            if ($rootScope.currentUser.can_view_company_dashboard) {
                return true;
            } else if ($rootScope.currentUser.is_team_lead) {
                $location.path('/team-lead');
            } else if ($rootScope.currentUser.can_coach_employees) {
                $location.path('/coach');
            } else if ($rootScope.currentUser.can_evaluate_employees) {
                $location.path('/pvp/todo');
            } else {
                return false;
            }
        }
    );
}