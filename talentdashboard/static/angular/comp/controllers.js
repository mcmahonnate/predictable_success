angular.module('tdb.comp.controllers', [])
    .controller('EmployeeCompSummariesCtrl', ['$scope', '$routeParams', 'CompSummary', function ($scope, $routeParams, CompSummary) {
        $scope.compSummaries = CompSummary.getAllSummariesForEmployee($routeParams.id);
    }])
;