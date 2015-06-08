angular.module('tdb.search.controllers', [])

    .controller('EmployeeSearchCtrl', ['$scope', '$routeParams', '$location', '$filter', 'Happiness', 'EmployeeSearch', 'TalentCategories', 'Team', function ($scope, $routeParams, $location, $filter, Happiness, EmployeeSearch, TalentCategories, Team) {
        $scope.filters = {
            talentCategory: $routeParams.talent_category,
            happiness: $routeParams.happiness,
            team_id: $routeParams.team_id,
            vops: $routeParams.vops
        };

        $scope.happinessOptions = Happiness.query();
        if($scope.filters.happiness) {
            var filtered = $filter('filter')($scope.happinessOptions, {id: $scope.filters.happiness});
            $scope.currentHappiness = filtered.length ? filtered[0] : null;
        }

        Team.query({}, function(results) {
            $scope.teams = results;
            if($scope.filters.team_id) {
                var filteredTeams = $filter('filter')($scope.teams, {id: $scope.filters.team_id});
                $scope.currentTeam = filteredTeams.length ? filteredTeams[0] : null;
            }
        });

        $scope.categoryName  = TalentCategories.getLabelByTalentCategory($scope.filters.talentCategory);
        $scope.setSynergistStyle = function(style) {
            $scope.synergistStyle = style;
            $location.search('vops', style.toLowerCase());
        };

        $scope.setTeamFilter = function(teamId) {
            $location.search('team_id', teamId);
        };

        $scope.setHappyFilter = function(happiness) {
            $location.search('happiness', happiness);
        };

        $scope.search = function() {
            var query = {};
            if($scope.filters.talentCategory) {
                query['talent_category'] = $scope.filters.talentCategory;
            }
            if($scope.filters.team_id) {
                query['team_id'] = $scope.filters.team_id;
            }
            if($scope.filters.happiness) {
                query['happiness'] = $scope.filters.happiness;
            }
            if($scope.filters.vops) {
                query['vops'] = $scope.filters.vops.toLowerCase();
                $scope.synergistStyle = $scope.filters.vops;
            }
            $scope.employees = EmployeeSearch.query(query);
        };
        $scope.search();
    }])
;