angular.module('tdb.controllers', [])

.controller('EvaluationListCtrl', ['$scope', '$routeParams', 'PvpEvaluation', function($scope, $routeParams, PvpEvaluation) {
    $scope.evaluations = PvpEvaluation.getCurrentEvaluationsForTalentCategory($routeParams.talent_category);
}])

.controller('EvaluationListCtrl', ['$scope', '$routeParams', 'PvpEvaluation', function($scope, $routeParams, PvpEvaluation) {
    $scope.evaluations = PvpEvaluation.getCurrentEvaluationsForTalentCategory($routeParams.talent_category, $routeParams.team_id);
	$scope.byTeam = { };
	$scope.byTeam.employee = { };
	$scope.byTeam.employee.team = { };
	$scope.byTeam.employee.team.name = { };
	$scope.menu = {show: false};
}])

.controller('EmployeeListCtrl', ['$scope', 'Employee', function($scope, Employee) {
    $scope.employees = Employee.query();
	$scope.employeeMenu = {show: false};
	$scope.teamMenu = {show: false};
}])

.controller('EmployeeDetailCtrl', ['$scope', '$routeParams', 'Employee', 'Mentorship', 'CompSummary', '$http', function($scope, $routeParams, Employee, Mentorship, CompSummary, $http) {
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
}])

.controller('EmployeeCompSummariesCtrl', ['$scope', '$routeParams', 'CompSummary', function($scope, $routeParams, CompSummary) {
    $scope.compSummaries = CompSummary.getAllSummariesForEmployee($routeParams.id);
}])

.controller('EmployeePvpEvaluationsCtrl', ['$scope', '$routeParams', 'PvpEvaluation', function($scope, $routeParams, PvpEvaluation) {
    $scope.pvp = PvpEvaluation.getAllEvaluationsForEmployee($routeParams.id);
}])

.controller('CompanyOverviewCtrl', ['$scope', '$routeParams', 'TalentCategoryReport', 'SalaryReport', function($scope, $routeParams, TalentCategoryReport, SalaryReport) {
    TalentCategoryReport.getReportForCompany(function(data) {
        $scope.talentCategoryReport = data;
    });
    SalaryReport.getReportForCompany(function(data) {
        $scope.salaryReport = data;
    });
}])

.controller('TeamOverviewCtrl', ['$scope', '$routeParams', 'TalentCategoryReport', 'SalaryReport', function($scope, $routeParams, TalentCategoryReport, SalaryReport) {
    $scope.teamId = $routeParams.id;
    SalaryReport.getReportForTeam($routeParams.id, function(data) {
        $scope.salaryReport = data;
    });

    TalentCategoryReport.getReportForTeam($routeParams.id, function(data) {
        $scope.talentCategoryReport = data;
    });
}])

.controller('EmployeeCommentsCtrl', ['$scope', '$routeParams', 'EmployeeComments', function($scope, $routeParams, EmployeeComments) {
    $scope.employeeId = $routeParams.id;
    $scope.commentIndex = 0; 
    EmployeeComments.query({ id: $scope.employeeId }).$then(function(response) {
        $scope.comments = response.data;
        $scope.currentComment = $scope.comments[$scope.commentIndex];
    });

    $scope.selectComment = function(index) {
        $scope.commentIndex = index;
        $scope.currentComment = $scope.comments[$scope.commentIndex];
    }

    $scope.getAuthorName = function() {
        var name;
        if ($scope.currentComment.owner) {
            name = $scope.currentComment.owner.first_name + " " + $scope.currentComment.owner.last_name;
            return name.trim() || $scope.currentComment.owner.username || "Unknown";
        }
        return "Unknown";
    }
}]);
