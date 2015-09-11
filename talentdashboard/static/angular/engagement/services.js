angular.module('tdb.engagement.services', ['ngResource'])

    .factory('Happiness', ['$resource', function ($resource) {
        return $resource('/api/v1/happiness/:id/', {id: '@id'});
    }])

    .factory('SendEngagementSurvey', ['$resource', '$http', function($resource, $http) {
        var actions = {
            'addNew': { method:'POST', data:{id: '@id', _sent_from_id: '@sent_from_id', _override: '@override'}, isArray: false }
        }
        var SendEngagementSurvey = $resource('/api/v1/send-engagement-survey/:id/', {id:'@id'}, actions);

        return SendEngagementSurvey;
    }])

    .factory('HappinessOptions', [function() {
        var HappinessOptions = {
            options: [
                {id: 0, name: 'No Happiness'},
                {id: 1, name: 'Very Unhappy'},
                {id: 2, name: 'Unhappy'},
                {id: 3, name: 'Indifferent'},
                {id: 4, name: 'Happy'},
                {id: 5, name: 'Very Happy'}
            ],
            query: function() {
                return this.options;
            }
        };
        return HappinessOptions;
    }])

    .factory('EngagementSurvey', ['$resource', '$http', function($resource, $http) {
        var actions = {
            'addNew': { method:'POST', data:{survey:'@survey_id', assessment: '@assessment', content: '@content'}, isArray: false },
        }

        var Engagement = $resource('/api/v1/engagement-survey/:id/:survey/', {id:'@id', survey:'@survey_id'}, actions);
        Engagement.getSurvey = function(id, survey_id, success, failure) {return this.get({ id: id, survey: survey_id }, success, failure); };

        return Engagement;
    }])

    .factory('Engagement', ['$resource', '$http', function($resource, $http) {
        var actions = {
            'addNew': { method:'POST', data:{assessed_by_id: '@assessed_by_id', assessment: '@assessment'}, isArray: false },
            'update': { method:'PUT', data:{assessed_by_id: '@assessed_by_id', assessment: '@assessment'}, isArray: false },
            'remove': { method:'DELETE' },
        }

        var Engagement = $resource('/api/v1/engagement/employees/:id/', {id:'@id'}, actions);
        Engagement.getCurrentEngagement = function(id, success, failure) { return this.get({ id: id, current: true }, success, failure); };

        return Engagement;
    }])

    .factory('AnnotationChart', ['$resource', '$http', function($resource, $http) {
        var AnnotationChart = $resource('/api/v1/annotation-chart/:id/');

        AnnotationChart.getData = function(id) {
            return this.get({id: id});
        };

        return AnnotationChart;
    }])
;
