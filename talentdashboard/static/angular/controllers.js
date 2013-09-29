
function EmployeeListCtrl($scope, Employee) {
    $scope.employees = Employee.query();
}

function EmployeeDetailCtrl($scope, $routeParams, Employee, Mentorship, $http) {
    $scope.employee = Employee.get({id: $routeParams.id}, function(data) {
        $http.get(data.team.leader).success(function(data) {
            $scope.team_lead = data;
        });
    });
    $scope.mentorships = Mentorship.get({mentee__id: $routeParams.id});
}

function EmployeeCompSummariesCtrl($scope, $routeParams, CompSummary) {
    $scope.compSummaries = CompSummary.get({employee__id: $routeParams.id});
}

function EmployeePvpEvaluationsCtrl($scope, $routeParams, PvpEvaluation) {
    $scope.pvp = PvpEvaluation.get({employee__id: $routeParams.id});
}
