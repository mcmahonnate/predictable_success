angular.module('tdb.controllers', [])

.controller('EvaluationListCtrl', ['$scope', '$routeParams', 'PvpEvaluation', 'Team', function($scope, $routeParams, PvpEvaluation, Team) {
	$scope.showNoResults = false;
	$scope.init = function(id)
	{
		$scope.team_id = id;
	    $scope.evaluations = PvpEvaluation.getCurrentEvaluationsForTalentCategory($routeParams.talent_category, $scope.team_id);
	}
	$scope.team_id = $routeParams.team_id;
    $scope.evaluations = PvpEvaluation.getCurrentEvaluationsForTalentCategory($routeParams.talent_category, $scope.team_id);
	$scope.intialQuery ={};
	$scope.intialQuery.teamId = $routeParams.team_id;
    $scope.talentCategory = $routeParams.talent_category;
	$scope.byTeam = { };
	$scope.byTeam.employee = { };
	$scope.byTeam.employee.team = { };
	$scope.showNoResults = false;
	$scope.byTeam.employee.team.name = "";
	$scope.byTeam.employee.team.id = "";
	if ($routeParams.team_id){
		Team.get(
			{id: $routeParams.team_id},
			function(data) {
				$scope.byTeam.employee.team.name = data.name
				$scope.byTeam.employee.team.id = data.id
			}
		);
	}
	$scope.filterList = function(){
		var found = false;
		$scope.showNoResults = false;
	    angular.forEach($scope.evaluations, function(evaluation) {
			if (evaluation.employee.team.name == $scope.byTeam.employee.team.name) {
				found=true;
			}
		});
		if (!found) {
			$scope.showNoResults = true;
		} 
	}
	$scope.menu = {show: false};
}])

.controller('TeamLeadsCtrl', ['$scope', '$routeParams', 'TeamLeads', function($scope, $routeParams, TeamLeads) {
    $scope.team_id = $routeParams.id;
    $scope.teamLeads = TeamLeads.getCurrentEvaluationsForTeamLeads($scope.team_id)
}])

.controller('EmployeeListCtrl', ['$scope', 'Employee', function($scope, Employee) {
    $scope.employees = Employee.query();
	$scope.employeeMenu = {show: false};
	$scope.teamMenu = {show: false};
	$scope.startsWith  = function(expected, actual){
		if(expected && actual){
			return expected.toLowerCase().indexOf(actual.toLowerCase()) == 0;
		}
		return true;
	}
}])

.controller('TeamListCtrl', ['$scope', 'Team', function($scope, Team) {
    $scope.teams = Team.query();
    $scope.teamQuery = $scope.teams[0];
	$scope.teamMenu = {show: false};
	$scope.startsWith  = function(expected, actual){
		if(expected && actual){
			return expected.toLowerCase().indexOf(actual.toLowerCase()) == 0;
		}
		return true;
	}
}])

.controller('EmployeeDetailCtrl', ['$scope', '$routeParams', 'Employee', 'Mentorship', 'Leadership', 'Attribute', 'CompSummary', '$http', function($scope, $routeParams, Employee, Mentorship, Leadership, Attribute, CompSummary, $http) {
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
	$scope.leaderships = Leadership.getLeadershipsForEmployee($routeParams.id);
    $scope.passions = Attribute.getAttributtesForEmployee($routeParams.id, 1);
    $scope.super_powers = Attribute.getAttributtesForEmployee($routeParams.id, 2);
	$scope.skills = Attribute.getAttributtesForEmployee($routeParams.id, 3);
}])

.controller('EmployeeCompSummariesCtrl', ['$scope', '$routeParams', 'CompSummary', function($scope, $routeParams, CompSummary) {
    $scope.compSummaries = CompSummary.getAllSummariesForEmployee($routeParams.id);
}])

.controller('EmployeePvpEvaluationsCtrl', ['$scope', '$routeParams', 'PvpEvaluation', function($scope, $routeParams, PvpEvaluation) {
	$scope.pvpIndex = 0;
    PvpEvaluation.getAllEvaluationsForEmployee($routeParams.id).$then(function(response) {
		$scope.pvps = response.data;
		$scope.currentPvP = $scope.pvps[$scope.pvpIndex];
	});

	$scope.selectPvP = function(index) {
        $scope.pvpIndex = index;
		$scope.currentPvP = $scope.pvps[$scope.pvpIndex];
    }
}])

.controller('CompanyOverviewCtrl', ['$scope', '$routeParams', 'TalentCategoryReport', 'SalaryReport', function($scope, $routeParams, TalentCategoryReport, SalaryReport) {
    TalentCategoryReport.getReportForCompany(function(data) {
        $scope.talentCategoryReport = data;
    });
    SalaryReport.getReportForCompany(function(data) {
        $scope.salaryReport = data;
    });
}])

.controller('TeamOverviewCtrl', ['$scope', '$routeParams', 'TalentCategoryReport', 'SalaryReport', 'Team', function($scope, $routeParams, TalentCategoryReport, SalaryReport, Team) {
    $scope.teamId = $routeParams.id;
    SalaryReport.getReportForTeam($routeParams.id, function(data) {
        $scope.salaryReport = data;
    });

    TalentCategoryReport.getReportForTeam($routeParams.id, function(data) {
        $scope.talentCategoryReport = data;
    });
	
    Team.get(
        {id: $routeParams.id},
        function(data) {
            $scope.team = data;
        }
    );
   
}])

.controller('EmployeeCommentsCtrl', ['$scope', '$routeParams', 'EmployeeComments', 'Comment', function($scope, $routeParams, EmployeeComments, Comment) {
    $scope.employeeId = $routeParams.id;
    $scope.commentIndex = 0; 
	$scope.$watch('commentIndex', function() {
		if ($scope.comments) {
			$scope.currentComment = $scope.comments[$scope.commentIndex];
		}
	});
	
    EmployeeComments.query({ id: $scope.employeeId }).$then(function(response) {
        $scope.comments = response.data;
        $scope.originalComments = angular.copy($scope.comments);
        $scope.currentComment = $scope.comments[$scope.commentIndex];
    });

    $scope.selectComment = function(index) {
        $scope.commentIndex = index;
    }

    $scope.getAuthorName = function() {
        var name = "";
        if ($scope.currentComment.owner) {
            if ($scope.currentComment.owner.first_name) {
                name = $scope.currentComment.owner.first_name + " ";
            }
             if ($scope.currentComment.owner.last_name) {
                name += $scope.currentComment.owner.last_name;
            }
            return name.trim() || $scope.currentComment.owner.username || "Unknown";
        }
        return "No Owner";
    }

    $scope.isClean = function() {
        return angular.equals($scope.comments[$scope.commentIndex], $scope.originalComments[$scope.commentIndex]);
    }

    $scope.startEdit = function(e) {
        $scope.currentComment.isEditing = true;
    }

    $scope.cancelEdit = function(e) {
        $scope.currentComment.isEditing = false;
        $scope.currentComment.content = $scope.originalComments[$scope.commentIndex].content;
    }

    $scope.addComment = function(equals) {
        var newComment = {};
        newComment.id = -1;
        newComment.isEditing = true;
        newComment.content = "new comment #" + ($scope.comments.length+1);
        newComment.modified_date = new Date().toJSON();
        newComment.owner = {};
        newComment.owner.username = "admin";  // Fill in later with auth service.
        $scope.comments.push(newComment);
        $scope.originalComments.push(angular.copy(newComment));
        $scope.selectComment($scope.comments.length-1);
    }

    $scope.deleteComment = function(e) {
        var comment = $scope.currentComment;
        var data = {id: comment.id};

        var deleteSuccess = function() {
            $scope.currentComment.isEditing = false;
            $scope.comments.splice($scope.commentIndex, 1);
            $scope.originalComments.splice($scope.commentIndex, 1);
            $scope.selectComment(0);
        }

        if (data.id != -1) { 
            Comment.remove(data, function() {
                deleteSuccess();
            });
        }
        else { // never saved.
           deleteSuccess();
        }
    }

    $scope.saveComment = function(e) {
        var comment = $scope.currentComment;
        var data = {id: comment.id, _content: comment.content};

        if (data.id != -1) {
            Comment.update(data, function() {
                $scope.currentComment.isEditing = false;
                $scope.originalComments[$scope.commentIndex].content = $scope.currentComment.content;
            });
        }   
        else {
            data.id = $scope.employeeId;
            EmployeeComments.save(data, function(response) {
                $scope.currentComment.isEditing = false;
                $scope.currentComment.id = response.id;
                $scope.originalComments[$scope.commentIndex].content = $scope.currentComment.content;
            });
        }
    }
}]);