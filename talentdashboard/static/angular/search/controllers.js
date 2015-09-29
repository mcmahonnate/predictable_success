angular.module('tdb.search.controllers', [])

    .controller('SearchCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$modal', 'Employee', 'Customers', 'Team', function ($scope, $rootScope, $routeParams, $location, $modal, Employee, Customers, Team) {

        //clear search
        $scope.navQuery = '';

        if (!$scope.employees) {
            $scope.employees = Employee.query(); //!important browser cache buster
        }

        Customers.get(function (data) {
            $scope.customer = data;
        });

        if (!$scope.employees && $rootScope.currentUser.can_view_company_dashboard) {
            $scope.employees = Employee.query();
        }
 	}])

    .controller('EmployeeSearchCtrl', ['$scope', '$routeParams', '$location', '$filter', 'HappinessOptions', 'EmployeeSearch', 'TalentCategories', 'Team', 'view', function ($scope, $routeParams, $location, $filter, HappinessOptions, EmployeeSearch, TalentCategories, Team, view) {
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
                    $scope.categoryName = 'My Coachees';
                    $scope.employees = EmployeeSearch.myCoachees(query);
                    break;
                case 'my-team':
                    $scope.categoryName = 'My Team';
                    $scope.employees = EmployeeSearch.myTeam(query);
                    break;
                case 'team-lead':
                    $scope.categoryName = 'Team';
                    $scope.employees = EmployeeSearch.leadEmployees(query);
                    break;
                default:
                    $scope.employees = EmployeeSearch.query(query);
            }
        };
        $scope.search();
    }])
;