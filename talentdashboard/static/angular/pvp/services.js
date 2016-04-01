angular.module('tdb.pvp.services', ['ngResource'])

    .factory('TalentCategories', [function() {
        var TalentCategories = {
            categories: {
                "0":{color:'#2c3e50',label:'No Data',description:''},
                "1":{color:'#0f9d58',label:'Unleash',description:''},
                "2":{color:'#8ad367',label:'Challenge',description:''},
                "3":{color:'#d5d466',label:'Push',description:''},
                "4":{color:'#5a9bed',label:'Discover',description:''},
                "5":{color:'#f59705',label:'Shift',description:''},
                "6":{color:'#ab1600',label:'Worry',description:''},
                "7":{color:'#95a5a6',label:'Onboard',description:''}
            },
            getColorByTalentCategory: function(category) {
                return this.categories[category].color;
            },
            getLabelByTalentCategory: function(category) {
                if (category  || category===0) {
                    return this.categories[category].label;
                } else {
                    return null;
                }
            }
        };

        return TalentCategories;
    }])

    .factory('PvpDescriptions', ['$resource', '$http', function($resource, $http) {
        var res = $resource('/api/v1/pvp/descriptions/');
        return res;
    }])

    .factory('PvpEvaluation', ['$resource', '$http', function($resource, $http) {
        var actions = {
            'update': { method: 'PUT' }
        };

        var PvpEvaluation = $resource('/api/v1/pvp/evaluations/:path/:employee_id/', {path: '@id' }, actions);

        PvpEvaluation.getAllEvaluationsForEmployee = function(id) {
            return this.query({ path:'employees', employee_id: id });
        };

        PvpEvaluation.getCurrentEvaluations = function() {
            var params = { current_round: true };
            return this.query(params);
        };

        PvpEvaluation.getCurrentEvaluationsForTalentCategory = function(talent_category, team_id) {
            var params = { talent_category: talent_category, current_round: true };
            if(team_id) {
                params['team_id'] = team_id;
            }
            return this.query(params);
        };

        PvpEvaluation.getToDos = function(team_id) {
            if (team_id != 0) {
                return this.query({ path: 'todo', team_id: team_id });
            } else {
                return this.query({ path: 'todo' });
            }
        };

        return PvpEvaluation;
    }])
;