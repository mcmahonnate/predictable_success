angular.module('tdb.search.controllers', [])

    .controller('SearchCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$modal', 'EmployeeSearch', 'Customers', function ($scope, $rootScope, $routeParams, $location, $modal, EmployeeSearch) {
        //clear search
        $scope.navQuery = '';

        $scope.employees = EmployeeSearch.query();
 	}])

    .controller('EmployeeSearchCtrl', ['$scope', '$routeParams', '$location', '$filter', 'Employee', 'HappinessOptions', 'EmployeeSearch', 'TalentCategories', 'Team', 'view', 'analytics', function ($scope, $routeParams, $location, $filter, Employee, HappinessOptions, EmployeeSearch, TalentCategories, Team, view, analytics) {
        analytics.trackPage($scope, $location.absUrl(), $location.url());
        $scope.group = null;
        $scope.filters = {
            talentCategory: $routeParams.talent_category ,
            happiness: $routeParams.happiness,
            team_id: $routeParams.team_id,
            vops: $routeParams.vops,
        };
        $scope.talentCategories = TalentCategories.categories;
        $scope.happinessOptions = HappinessOptions.query();
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
            if (style) {
                $location.search('vops', style.toLowerCase());
            } else {
                $location.search('vops', null);
            }
        };

        $scope.setZoneFilter = function(categoryId) {
            console.log(categoryId);
            $location.search('talent_category', categoryId);
        };

        $scope.setTeamFilter = function(teamId) {
            $location.search('team_id', teamId);
        };

        $scope.setHappyFilter = function(happiness) {
            if (happiness == 0) {happiness="0"}
            $location.search('happiness', happiness);
        };

        $scope.search = function() {
            var query = {};

            if($scope.filters.talentCategory || $scope.filters.talentCategory===0) {
                query['talent_category'] = $scope.filters.talentCategory;
            }
            if($scope.filters.team_id) {
                query['team_id'] = $scope.filters.team_id;
            }
            if($scope.filters.happiness) {
                query['happiness'] = $scope.filters.happiness;
            }
            if($scope.filters.vops) {
                query['vops'] = $scope.filters.vops;
                $scope.synergistStyle = $scope.filters.vops;
            }
            if($routeParams.id) {
                query['id'] = $routeParams.id;
            }
            switch(view) {
                case 'my-coachees':
                    $scope.group = 'My Coachees';
                    $scope.employees = EmployeeSearch.myCoachees(query);
                    break;
                case 'my-team':
                    $scope.group = 'My Team';
                    $scope.employees = EmployeeSearch.myTeamDescendants(query);
                    break;
                case 'team-lead':
                    Employee.get(
                        {id: $routeParams.id},
                        function (data) {
                            $scope.group = data.full_name + "'s Team";
                        }
                    );

                    $scope.employees = EmployeeSearch.leadEmployees(query);
                    break;
                default:
                    $scope.employees = EmployeeSearch.query(query);
            }
        };
        $scope.search();
    }])
;