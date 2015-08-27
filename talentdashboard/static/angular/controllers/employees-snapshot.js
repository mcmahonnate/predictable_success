angular.module('tdb.controllers.employeesSnapshot', [])

    .controller('EmployeesSnapshotCtrl', ['$scope', 'Events', '$rootScope', '$location', '$routeParams', 'User', 'Employee', 'Coachees', 'TalentReport', '$http', 'analytics', 'Engagement', 'TalentCategories', function ($scope, Events, $rootScope, $location, $routeParams, User, Employee, Coachees, TalentReport, $http, analytics, Engagement, TalentCategories) {
        $scope.busy = true;

        // For coaches view    
        if ($scope.view == 'coach-view') {
            Coachees.query({ id: $routeParams.id }).$promise.then(function (response) {
                $scope.employees = response;
            });
        }

        $scope.filteredZoneType = '';
        $scope.filteredHappinessType = '';
        $scope.sortorder = 'last_checkin_date';
        $scope.busy = false;
    }]);