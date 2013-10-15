var controllers = angular.module('tdb.controllers', []);

controllers.controller('EvaluationListCtrl', ['$scope', '$routeParams', 'PvpEvaluation', function($scope, $routeParams, PvpEvaluation) {
    $scope.evaluations = PvpEvaluation.getCurrentEvaluationsForTalentCategory($routeParams.talent_category);
}]);

controllers.controller('EvaluationListCtrl', ['$scope', '$routeParams', 'PvpEvaluation', function($scope, $routeParams, PvpEvaluation) {
    $scope.evaluations = PvpEvaluation.getCurrentEvaluationsForTalentCategory($routeParams.talent_category, $routeParams.team_id);
}]);

controllers.controller('EmployeeListCtrl', ['$scope', 'Employee', function($scope, Employee) {
    $scope.employees = Employee.query();
}]);

controllers.controller('EmployeeDetailCtrl', ['$scope', '$routeParams', 'Employee', 'Mentorship', 'CompSummary', '$http', function($scope, $routeParams, Employee, Mentorship, CompSummary, $http) {
    Employee.get(
        {id: $routeParams.id},
        function(data) {
            $scope.employee = data;
            if(data.team && data.team.leader) {
                $http.get(data.team.leader).success(function(data) {
                    $scope.team_lead = data;
                });
            }
        }
    );
    $scope.mentorships = Mentorship.getMentorshipsForMentee($routeParams.id);
}]);

controllers.controller('EmployeeCompSummariesCtrl', ['$scope', '$routeParams', 'CompSummary', function($scope, $routeParams, CompSummary) {
    $scope.compSummaries = CompSummary.getAllSummariesForEmployee($routeParams.id);
}]);

controllers.controller('EmployeePvpEvaluationsCtrl', ['$scope', '$routeParams', 'PvpEvaluation', function($scope, $routeParams, PvpEvaluation) {
    $scope.pvp = PvpEvaluation.getAllEvaluationsForEmployee($routeParams.id);
}]);

controllers.controller('CompanyOverviewCtrl', ['$scope', '$routeParams', 'TalentCategoryReport', function($scope, $routeParams, TalentCategoryReport) {
    TalentCategoryReport.getReportForEntireCompany(function(data) {
        $scope.talentCategoryReport = data;
    });
}]);

controllers.controller('TeamOverviewCtrl', ['$scope', '$routeParams', 'TalentCategoryReport', 'SalaryReport', function($scope, $routeParams, TalentCategoryReport, SalaryReport) {
    $scope.teamId = $routeParams.id;
    SalaryReport.getReportForTeam($routeParams.id, function(data) {
        $scope.salaryReport = data;
    });

    TalentCategoryReport.getReportForTeam($routeParams.id, function(data) {
        $scope.talentCategoryReport = data;
    });
}]);
