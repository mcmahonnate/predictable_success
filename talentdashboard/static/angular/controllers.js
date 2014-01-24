angular.module('tdb.controllers', [])

.controller('BaseAppCtrl', ['$rootScope', '$location', 'User', function($rootScope, $location, User) {
    $rootScope.$on("$routeChangeError", function() {
        window.location = '/login?next=' + $location.path();
    })
    $rootScope.currentUser = User.get();
}])

.controller('EvaluationListCtrl', ['$scope', '$location', '$routeParams', 'PvpEvaluation', 'Team', 'analytics', function($scope, $location, $routeParams, PvpEvaluation, Team, analytics) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());
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
    $scope.settingsMenu = {show: false};
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

.controller('EmployeeDetailCtrl', ['$scope', '$location', '$routeParams', 'Employee', 'Mentorship', 'Leadership', 'Attribute', 'CompSummary', '$http', 'analytics', function($scope, $location, $routeParams, Employee, Mentorship, Leadership, Attribute, CompSummary, $http, analytics) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());
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

.controller('LeaderDetailCtrl', ['$scope', '$location', '$routeParams', 'Employee', 'Leadership', 'TalentCategoryReport', '$http', 'analytics', function($scope, $location, $routeParams, Employee, Leadership, TalentCategoryReport, $http, analytics) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());
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
    $scope.leaderships = Leadership.getLeadershipsForLeader($routeParams.id);
    TalentCategoryReport.getReportForCompany(function(data) {
        $scope.talentCategoryReport = data;
    });
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

.controller('EmployeeNavigationCtrl', ['$scope', '$routeParams', 'PvpEvaluation', 'Employee', function($scope, $routeParams, PvpEvaluation, Employee) {
	
    if($routeParams.talent_category) {
        $scope.employees = PvpEvaluation.getCurrentEvaluationsForTalentCategory($routeParams.talent_category, $scope.team_id);
    } else {
        $scope.employees = Employee.query();    
    }

}])

.controller('ReportsCtrl', ['$scope', '$location', '$routeParams', 'PvpEvaluation', 'analytics', function($scope, $location, $routeParams, PvpEvaluation, analytics) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());
    $scope.evaluations = PvpEvaluation.query({current_round: true});

}])

.controller('CompanyOverviewCtrl', ['$scope', '$location', '$routeParams', 'TalentCategoryReport', 'SalaryReport', 'analytics', function($scope, $location, $routeParams, TalentCategoryReport, SalaryReport, analytics) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());
    TalentCategoryReport.getReportForCompany(function(data) {
        $scope.talentCategoryReport = data;
    });
    SalaryReport.getReportForCompany(function(data) {
        $scope.salaryReport = data;
    });
}])

.controller('TeamOverviewCtrl', ['$scope', '$location', '$routeParams', 'TalentCategoryReport', 'SalaryReport', 'Team', 'analytics', function($scope, $location, $routeParams, TalentCategoryReport, SalaryReport, Team, analytics) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());
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

.controller('DiscussionDetailCtrl', ['$scope', '$location', '$filter', '$routeParams', '$window', 'EmployeeComments', 'Employee', 'Comment', 'SubComments', 'User', 'analytics', function($scope, $location, $filter, $routeParams, $window, EmployeeComments, Employee, Comment, SubComments, User, analytics) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());
    $scope.commentId = $routeParams.id;
    $scope.comment="";
    $scope.employee="";
    $scope.comment.subcomments = [];

    Comment.get({ id: $scope.commentId }).$then(function(response) {
        $scope.comment = response.data;
        $scope.comment.newSubCommentText = "";
        SubComments.query({ id: $scope.comment.id }).$then(function(response) {
                $scope.comment.subcomments = response.data;
            }
        );
        Employee.get(
            {id: $scope.comment.object_id},
            function(data) {
                $scope.employee = data;
            }
        );
    });

    $scope.addSubComment = function() {
        var newComment = {};
        newComment.id = -1;
        newComment.content = $scope.comment.newSubCommentText;
        newComment.modified_date = new Date().toJSON();
        newComment.owner = User.get();

        $scope.comment.subcomments.push(newComment);

        var data = {id: newComment.id, _model_name: "comment", _object_id: $scope.comment.id,_content: newComment.content};

        data.id = $scope.employee.id;
        EmployeeComments.save(data, function(response) {
            newComment.id = response.id;
            $scope.comment.newSubCommentText = "";
        });
    }

    $scope.deleteComment = function(comment_id, index) {
        if ($window.confirm('Are you sure you want to delete this comment?')) {
            var data = {id: comment_id};
            var deleteSuccess = function() {
                $location.path('/employees/' + $scope.employee.id);
            };

            Comment.remove(data, function() {
                    deleteSuccess();
                });
        }
    }

    $scope.deleteSubComment = function(comment_id, index) {
        if ($window.confirm('Are you sure you want to delete this comment?')) {
            var data = {id: comment_id};
            var deleteSuccess = function() {
                $scope.comment.subcomments.splice(index, 1);
            };

            Comment.remove(data, function() {
                    deleteSuccess();
                });
        }
    }

}])

.controller('DiscussionOverviewCtrl', ['$scope', '$location', '$filter', '$routeParams', '$window', 'EmployeeComments', 'Employee', 'Comment', 'SubComments', 'User', 'analytics', function($scope, $location, $filter, $routeParams, $window, EmployeeComments, Employee, Comment, SubComments, User, analytics) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());
    Comment.query().$then(function(response) {
        $scope.comments = response.data;
        $scope.originalComments = angular.copy($scope.comments);
        angular.forEach($scope.comments, function(comment) {
            var index = $scope.comments.indexOf(comment);
            var original_comment = $scope.originalComments[index];
            comment.subcomments = [];
            original_comment.subcomments = [];
            SubComments.query({ id: comment.id }).$then(function(response) {
                    comment.subcomments = response.data;
                    original_comment.subcomments = angular.copy(comment.subcomments);
                }
            );
            comment.newSubCommentText = "";
        });

        $scope.CreateHeader = function(date) {
            date=$filter('date')(date,"MM/dd/yyyy");
            showHeader = (date!=$scope.currentGroup);
            $scope.currentGroup = date;
            return showHeader;
        }
    });

    $scope.saveComment = function(comment) {
        var index = $scope.comments.indexOf(comment);
        var data = {id: comment.id, _content: comment.content};

        Comment.update(data, function() {
            $scope.originalComments[index].content = comment.content;
        });
    }

    $scope.cancelEditComment = function(comment) {
        var index = $scope.comments.indexOf(comment);
        comment.content = $scope.originalComments[index].content;
    }

     $scope.saveSubComment = function(subcomment, comment) {
        var parent_index = $scope.comments.indexOf(comment);
        var subcomment_index = $scope.comments[parent_index].subcomments.indexOf(subcomment);
        var data = {id: subcomment.id, _content: subcomment.content};

        Comment.update(data, function() {
            $scope.originalComments[parent_index].subcomments[subcomment_index].content = subcomment.content;
        });
    }

    $scope.cancelEditSubComment = function(subcomment, comment) {
        var parent_index = $scope.comments.indexOf(comment);
        var subcomment_index = $scope.comments[parent_index].subcomments.indexOf(subcomment);
        subcomment.content = $scope.originalComments[parent_index].subcomments[subcomment_index].content;
    }


    $scope.addComment = function(equals) {
        var newComment = {};
        newComment.id = -1;
        newComment.content = $scope.newCommentText;
        newComment.modified_date = new Date().toJSON();
        newComment.owner = User.get();
        newComment.newSubCommentText="";
        newComment.subcomments=[];

        $scope.comments.push(newComment);
        $scope.originalComments.push(angular.copy(newComment));

        var data = {id: newComment.id, _model_name: "employee", _object_id: 0, _content: newComment.content};

        data.id = $scope.employeeId;
        EmployeeComments.save(data, function(response) {
            newComment.id = response.id;
            $scope.newCommentText = "";
        });
    }

    $scope.addSubComment = function(comment) {
        var newComment = {};
        newComment.id = -1;
        newComment.content = comment.newSubCommentText;
        newComment.modified_date = new Date().toJSON();
        newComment.owner = User.get();

        comment.subcomments.push(newComment);
        var index = $scope.comments.indexOf(comment);
        $scope.originalComments[index].subcomments.push(angular.copy(newComment));

        var data = {id: newComment.id, _model_name: "comment", _object_id: comment.id,_content: newComment.content};

        data.id = comment.associated_object.id;
        EmployeeComments.save(data, function(response) {
            newComment.id = response.id;
            comment.newSubCommentText = "";
        });
    }

    $scope.deleteComment = function(comment) {
        if ($window.confirm('Are you sure you want to delete this comment?')) {
            var data = {id: comment.id};
            var index = $scope.comments.indexOf(comment);
            var deleteSuccess = function() {
                $scope.comments.splice(index, 1);
            };

            Comment.remove(data, function() {
                    deleteSuccess();
                });
        }
    };

    $scope.deleteSubComment = function(comment, subcomment) {
        if ($window.confirm('Are you sure you want to delete this comment?')) {
            var data = {id: subcomment.id};
            var comment_index = $scope.comments.indexOf(comment);
            var subcomment_index = $scope.comments[comment_index].subcomments.indexOf(subcomment);
            var deleteSuccess = function() {
                $scope.comments[comment_index].subcomments.splice(subcomment_index, 1);
                $scope.originalComments[comment_index].subcomments.splice(subcomment_index, 1);
            };

            Comment.remove(data, function() {
                    deleteSuccess();
                });
        }
    };
}])

.controller('EmployeeToDoListCtrl', ['$scope', '$routeParams', 'EmployeeToDo','ToDo', function($scope, $routeParams, EmployeeToDo,ToDo) {
    EmployeeToDo.query({ id: $routeParams.id }).$then(function(response) {
            $scope.todos = response.data;
        }
    );
    $scope.saveToDo = function(todo) {
        var data = {id: todo.id, _description: todo.description};

        ToDo.update(data, function() {

        });
    }
    $scope.addToDo = function(equals) {
        var newToDo = {};
        newToDo.id = -1;
        newToDo.description = "";
        newToDo.created_by =

        $scope.comments.push(newComment);
        $scope.originalComments.push(angular.copy(newComment));

        var data = {id: newComment.id, _model_name: "employee", _object_id: 0, _content: newComment.content};

        data.id = $scope.employeeId;
        EmployeeComments.save(data, function(response) {
            newComment.id = response.id;
            $scope.newCommentText = "";
        });
    }
}])

.controller('EmployeeCommentsCtrl', ['$scope', '$filter', '$routeParams', '$window', 'EmployeeComments', 'SubComments','Comment', 'User', function($scope, $filter, $routeParams, $window, EmployeeComments, SubComments, Comment, User) {
    $scope.employeeId = $routeParams.id;
    $scope.newCommentText = "";

    EmployeeComments.query({ id: $scope.employeeId }).$then(function(response) {
        $scope.comments = response.data;
        $scope.originalComments = angular.copy($scope.comments);
        angular.forEach($scope.comments, function(comment) {
            var index = $scope.comments.indexOf(comment);
            var original_comment = $scope.originalComments[index];
            comment.subcomments = [];
            original_comment.subcomments = [];
            SubComments.query({ id: comment.id }).$then(function(response) {
                    comment.subcomments = response.data;
                    original_comment.subcomments = angular.copy(comment.subcomments);
                }
            );
            comment.newSubCommentText = "";
        });

        $scope.CreateHeader = function(date) {
            date=$filter('date')(date,"MM/dd/yyyy");
            showHeader = (date!=$scope.currentGroup);
            $scope.currentGroup = date;
            return showHeader;
        }
    });

    $scope.saveComment = function(comment) {
        var index = $scope.comments.indexOf(comment);
        var data = {id: comment.id, _content: comment.content};

        Comment.update(data, function() {
            $scope.originalComments[index].content = comment.content;
        });
    }

    $scope.cancelEditComment = function(comment) {
        var index = $scope.comments.indexOf(comment);
        comment.content = $scope.originalComments[index].content;
    }

     $scope.saveSubComment = function(subcomment, comment) {
        var parent_index = $scope.comments.indexOf(comment);
        var subcomment_index = $scope.comments[parent_index].subcomments.indexOf(subcomment);
        var data = {id: subcomment.id, _content: subcomment.content};

        Comment.update(data, function() {
            $scope.originalComments[parent_index].subcomments[subcomment_index].content = subcomment.content;
        });
    }

    $scope.cancelEditSubComment = function(subcomment, comment) {
        var parent_index = $scope.comments.indexOf(comment);
        var subcomment_index = $scope.comments[parent_index].subcomments.indexOf(subcomment);
        subcomment.content = $scope.originalComments[parent_index].subcomments[subcomment_index].content;
    }


    $scope.addComment = function(equals) {
        var newComment = {};
        newComment.id = -1;
        newComment.content = $scope.newCommentText;
        newComment.modified_date = new Date().toJSON();
        newComment.owner = User.get();
        newComment.newSubCommentText="";
        newComment.subcomments=[];

        $scope.comments.push(newComment);
        $scope.originalComments.push(angular.copy(newComment));

        var data = {id: newComment.id, _model_name: "employee", _object_id: 0, _content: newComment.content};

        data.id = $scope.employeeId;
        EmployeeComments.save(data, function(response) {
            newComment.id = response.id;
            $scope.newCommentText = "";
        });
    }

    $scope.addSubComment = function(comment) {
        var newComment = {};
        newComment.id = -1;
        newComment.content = comment.newSubCommentText;
        newComment.modified_date = new Date().toJSON();
        newComment.owner = User.get();

        comment.subcomments.push(newComment);
        var index = $scope.comments.indexOf(comment);
        $scope.originalComments[index].subcomments.push(angular.copy(newComment));

        var data = {id: newComment.id, _model_name: "comment", _object_id: comment.id,_content: newComment.content};

        data.id = $scope.employeeId;
        EmployeeComments.save(data, function(response) {
            newComment.id = response.id;
            comment.newSubCommentText = "";
        });
    }

    $scope.deleteComment = function(comment) {
        if ($window.confirm('Are you sure you want to delete this comment?')) {
            var data = {id: comment.id};
            var index = $scope.comments.indexOf(comment);
            var deleteSuccess = function() {
                $scope.comments.splice(index, 1);
            };

            Comment.remove(data, function() {
                    deleteSuccess();
                });
        }
    };

    $scope.deleteSubComment = function(comment, subcomment) {
        if ($window.confirm('Are you sure you want to delete this comment?')) {
            var data = {id: subcomment.id};
            var comment_index = $scope.comments.indexOf(comment);
            var subcomment_index = $scope.comments[comment_index].subcomments.indexOf(subcomment);
            var deleteSuccess = function() {
                $scope.comments[comment_index].subcomments.splice(subcomment_index, 1);
                $scope.originalComments[comment_index].subcomments.splice(subcomment_index, 1);
            };

            Comment.remove(data, function() {
                    deleteSuccess();
                });
        }
    };
}]);