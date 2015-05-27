angular.module('tdb.search.controllers', [])

    .controller('EmployeeSearchCtrl', ['$scope', '$routeParams', '$location', '$filter', 'Happiness', 'EmployeeSearch', 'TalentCategories', 'Team', function ($scope, $routeParams, $location, $filter, Happiness, EmployeeSearch, TalentCategories, Team) {
        $scope.filters = {
            talentCategory: $routeParams.talent_category,
            happiness: $routeParams.happiness,
            teamId: $routeParams.team_id
        };

        $scope.happinessOptions = Happiness.query();
        if($scope.filters.happiness) {
            var filtered = $filter('filter')($scope.happinessOptions, {id: $scope.filters.happiness});
            $scope.currentHappiness = filtered.length ? filtered[0] : null;
        }

        Team.query({}, function(results) {
            $scope.teams = results;
            if($scope.filters.teamId) {
                var filteredTeams = $filter('filter')($scope.teams, {id: $scope.filters.teamId});
                $scope.currentTeam = filteredTeams.length ? filteredTeams[0] : null;
            }
        });

        $scope.categoryName  = TalentCategories.getLabelByTalentCategory($scope.filters.talentCategory);

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
            if($scope.filters.teamId) {
                query['team_id'] = $scope.filters.teamId;
            }
            if($scope.filters.happiness) {
                query['happiness'] = $scope.filters.happiness;
            }
            $scope.employees = EmployeeSearch.query(query);
        };

        $scope.search();
    }])
;