angular.module('tdb.preferences.services', [])
    .factory('TemplatePreferences', ['$q', 'User', function ($q, User) {
        var DISCUSSION_FOCUSED = '1';
        var templates = {
            'company-overview': {
                '1': "/static/angular/partials/company-overview-default.html",
                '2': "/static/angular/partials/company-overview-stats-focused.html"
            },
            'team-overview': {
                '1': "/static/angular/partials/team-overview-default.html",
                '2': "/static/angular/partials/team-overview-stats-focused.html"
            },
            'team-lead-overview': {
                '1': '/static/angular/partials/leader-overview-default.html',
                '2': '/static/angular/partials/leader-overview-stats-focused.html'
            }
        };

        var user;

        var getPreference = function() {
            if(user && user.preferences) return user.preferences.dashboard_view;

            var deferred = $q.defer();
            User.get({},
                function(data) {
                    if(data.preferences) {
                        deferred.resolve(data.preferences.dashboard_view);
                    } else {
                        deferred.resolve(DISCUSSION_FOCUSED);
                    }
                },
                function() {
                    deferred.resolve(DISCUSSION_FOCUSED);
                }
            );
            return deferred.promise;
        };

        var service = {};

        service.getPreferredTemplate = function(templateName) {
            var deferred = $q.defer();
            getPreference().then(function(preference) {
               var template = templates[templateName][preference.toString()];
                deferred.resolve(template);
            });
            return deferred.promise;
        };

        return service;
    }])
;