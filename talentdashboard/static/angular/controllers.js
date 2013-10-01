
function EmployeeListCtrl($scope, Employee) {
    $scope.employees = Employee.query();
}

function EmployeeDetailCtrl($scope, $routeParams, Employee, Mentorship, CompSummary, $http) {
    $scope.employee = Employee.get(
        {id: $routeParams.id},
        function(data) {
            if(data.team && data.team.leader) {
                $http.get(data.team.leader).success(function(data) {
                    $scope.team_lead = data;
                });
            }
        }
    );
    $scope.mentorships = Mentorship.getMentorshipsForMentee($routeParams.id);
}

function EmployeeCompSummariesCtrl($scope, $routeParams, CompSummary) {
    $scope.compSummaries = CompSummary.getAllSummariesForEmployee($routeParams.id);
}

function EmployeePvpEvaluationsCtrl($scope, $routeParams, PvpEvaluation) {
    $scope.pvp = PvpEvaluation.getAllEvaluationsForEmployee($routeParams.id);
}
