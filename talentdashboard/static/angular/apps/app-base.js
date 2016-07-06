var app = angular.module('tdb', [
        'tdb.services', 'tdb.controllers', 'tdb.directives', 'tdb.filters',
        'tdb.activity.controllers', 'tdb.activity.services',
        'tdb.comments.controllers', 'tdb.comments.services',
        'tdb.comp.services',
        'tdb.customers.services',
        'tdb.engagement.controllers', 'tdb.engagement.services',
        'tdb.import.controllers', 'tdb.import.services',
        'tdb.insights.controllers', 'tdb.insights.services',
        'tdb.kpi.services',
        'tdb.org.controllers', 'tdb.org.services',
        'tdb.preferences.services',
        'tdb.pvp.controllers', 'tdb.pvp.services',
        'tdb.search.controllers', 'tdb.search.services',
        'tdb.tasks.controllers', 'tdb.tasks.services',
        'angular.filter',
        'checkins', 'devzones', 'feedback', 'profile', 'projects', 'qualities',
        'angular-carousel', 'analytics', 'ui.bootstrap', 'ngCsv','ngImgCrop', 'ngRoute', 'ngAnimate', 'ui-notification', 'ngMessages', 'readMore', 'ngCookies', 'ui.select', 'selectize','ngTouch'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/', {templateUrl: '/static/angular/profile/partials/profile.html', controller: 'ProfileController as profile', resolve: {authorizeRoute: authorizeRoute}}).
            when('/checkins/:checkinId', {templateUrl: '/static/angular/checkins/partials/checkin-detail.html', controller: 'CheckInController as viewCheckin', resolve: {authorizeRoute: authorizeRoute}}).
            when('/checkins', {templateUrl: '/static/angular/checkins/partials/checkins.html', controller: 'CheckInsController as myCheckins', resolve: {authorizeRoute: authorizeRoute}}).
            when('/id', {templateUrl: '/static/angular/devzones/partials/index.html', controller: 'DevZonesController as devzones', resolve: {authorizeRoute: authorizeRoute}}).
            when('/id/:conversationId', {templateUrl: '/static/angular/devzones/partials/conversation.html', controller: 'ConversationController as conversation', resolve: {authorizeRoute: authorizeRoute}}).
            when('/engagement-survey/:employeeId/:surveyId', {templateUrl: '/static/angular/partials/engagement-survey.html', controller: 'EngagementSurveyCtrl'}).
            when('/feedback/request/:id/reply', {templateUrl: '/static/angular/feedback/partials/respond_to_request.html', controller: 'RespondToFeedbackRequestController as submitFeedback', resolve: {authorizeRoute: authorizeRoute}}).
            when('/feedback/submit', {templateUrl: '/static/angular/feedback/partials/unsolicited_feedback.html', controller: 'UnsolicitedFeedbackController as submitFeedback', resolve: {authorizeRoute: authorizeRoute}}).
            when('/feedback/submit/:employeeId', {templateUrl: '/static/angular/feedback/partials/unsolicited_feedback.html', controller: 'UnsolicitedFeedbackController as submitFeedback', resolve: {authorizeRoute: authorizeRoute}}).
            when('/feedback/submission/:id', {templateUrl: '/static/angular/feedback/partials/feedback_submission.html', controller: 'ProcessSubmissionController as processFeedback', resolve: {authorizeRoute: authorizeRoute}}).
            when('/feedback/submission/:id/process', {templateUrl: '/static/angular/feedback/partials/process_feedback.html', controller: 'ProcessSubmissionController as processFeedback', resolve: {authorizeRoute: authorizeRoute}}).
            when('/feedback', {templateUrl: '/static/angular/feedback/partials/index.html', controller: 'FeedbackController as feedback', resolve: {authorizeRoute: authorizeRoute}}).
            when('/feedback/:id/worksheet', {templateUrl: '/static/angular/feedback/partials/feedback_worksheet.html', controller: 'FeedbackWorksheetController as feedbackWorksheet', resolve: {authorizeRoute: authorizeRoute}}).
            when('/feedback/digest/:id', {templateUrl: '/static/angular/feedback/partials/feedback_digest_for_coaches.html', controller: 'FeedbackDigestController as feedbackWorksheet', resolve: {authorizeRoute: authorizeRoute}}).
            when('/feedback/:id', {templateUrl: '/static/angular/feedback/partials/my_feedback.html', controller: 'FeedbackDigestController as feedback', resolve: {authorizeRoute: authorizeRoute}}).
            when('/profile', {templateUrl: '/static/angular/profile/partials/profile.html', controller: 'ProfileController as profile', resolve: {authorizeRoute: authorizeRoute}}).
            when('/profile/:id', {templateUrl: '/static/angular/profile/partials/profile.html', controller: 'ProfileController as profile', resolve: {authorizeRoute: authorizeRoute}}).
            when('/projects/:projectId', {templateUrl: '/static/angular/projects/partials/project-detail.html', controller: 'ProjectController as viewProject', resolve: {authorizeRoute: authorizeRoute}}).
            when('/projects', {templateUrl: '/static/angular/projects/partials/projects.html', controller: 'ProjectsController as projects', resolve: {authorizeRoute: authorizeRoute}}).
            when('/qualities/perception/request/:requestId/reply', {templateUrl: '/static/angular/qualities/partials/submission.html', controller: 'AssessQualitiesController as assessQualities', resolve: {authorizeRoute: authorizeRoute}}).
            when('/qualities/perception/submission', {templateUrl: '/static/angular/qualities/partials/submission.html', controller: 'AssessQualitiesController as assessQualities', resolve: {authorizeRoute: authorizeRoute}}).
            when('/qualities/perception/submission/:categoryId/:employeeId', {templateUrl: '/static/angular/qualities/partials/submission.html', controller: 'AssessQualitiesController as assessQualities', resolve: {authorizeRoute: authorizeRoute}}).
            when('/qualities/perception/my', {templateUrl: '/static/angular/qualities/partials/strengths-report.html', controller: 'QualitiesReportController as qualitiesReport', resolve: {authorizeRoute: authorizeRoute}}).
            otherwise({redirectTo: '/'});
    }])
    .run(['$document', '$rootScope', 'User', 'TalentCategories', 'Customers', 'privacyMode', function($document, $rootScope, User, TalentCategories, Customers, privacyMode) {
        $rootScope.customer = Customers.get();
        $rootScope.currentUser = User.get();
        $rootScope.talentCategories = TalentCategories.categories;

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
    return $http.get("/api/v1/user-status/");
}