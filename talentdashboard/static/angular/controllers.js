angular.module('tdb.controllers', [])

.controller('BaseAppCtrl', ['$rootScope', '$location', 'User', function($rootScope, $location, User) {
    $rootScope.$on("$routeChangeError", function() {
        window.location = '/login?next=' + $location.path();
    })
   User.get(function(data) {
            $rootScope.currentUser = data;
       }
   );
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

.controller('EmployeeListCtrl', ['$scope', '$window', 'Employee', function($scope, $window, Employee) {
    $scope.$window = $window;
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
    $scope.toggleEmployeeMenu = function () {
        $scope.openEmployeeMenu = !$scope.openEmployeeMenu;
        if ($scope.openEmployeeMenu ) {
            $scope.openTeamMenu = false;
            $scope.openSettingsMenu  = false;
            $scope.$window.onclick = function (event) {
                closeEmployeeMenu(event, $scope.toggleEmployeeMenu);
            };
        } else {
            $scope.openEmployeeMenu  = false;
            $scope.$window.onclick = null;
            $scope.$apply(); //--> trigger digest cycle and make angular aware.
        }
    };
    function closeEmployeeMenu(event, callbackOnClose) {
        var clickedElement = event.target;
        if (!clickedElement) return;
        var elementClasses = clickedElement.classList;
        var clickedOnEmployeeMenu = elementClasses.contains('employee_menu');
        if (!clickedOnEmployeeMenu) {
            callbackOnClose();
        }
    }
    $scope.toggleTeamMenu = function () {
        $scope.openTeamMenu = !$scope.openTeamMenu;
        if ($scope.openTeamMenu ) {
            $scope.openEmployeeMenu  = false;
            $scope.openSettingsMenu  = false;
            $scope.$window.onclick = function (event) {
                closeTeamMenu(event, $scope.toggleTeamMenu);
            };
        } else {
            $scope.openTeamMenu  = false;
            $scope.$window.onclick = null;
            $scope.$apply(); //--> trigger digest cycle and make angular aware.
        }
    };
    function closeTeamMenu(event, callbackOnClose) {
        var clickedElement = event.target;
        if (!clickedElement) return;
        var elementClasses = clickedElement.classList;
        var clickedOnTeamMenu = elementClasses.contains('team_menu');
        if (!clickedOnTeamMenu) {
            callbackOnClose();
        }
    }
    $scope.toggleSettingsMenu = function () {
        $scope.openSettingsMenu = !$scope.openSettingsMenu;
        if ($scope.openSettingsMenu ) {
            $scope.openEmployeeMenu  = false;
            $scope.openTeamMenu  = false;
            $scope.$window.onclick = function (event) {
                closeSettingsMenu(event, $scope.toggleSettingsMenu);
            };
        } else {
            $scope.openSettingsMenu  = false;
            $scope.$window.onclick = null;
            $scope.$apply(); //--> trigger digest cycle and make angular aware.
        }
    };
    function closeSettingsMenu(event, callbackOnClose) {
        var clickedElement = event.target;
        if (!clickedElement) return;
        var elementClasses = clickedElement.classList;
        var clickedOnSettingsMenu = elementClasses.contains('settings_menu');
        if (!clickedOnSettingsMenu) {
            callbackOnClose();
        }
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

.controller('EmployeeDetailCtrl', ['$scope', '$location', '$routeParams', 'User', 'Employee', 'Engagement', 'Mentorship', 'Leadership', 'Attribute', 'CompSummary', '$http', 'analytics', function($scope, $location, $routeParams, User, Employee, Engagement, Mentorship, Leadership, Attribute, CompSummary, $http, analytics) {
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
    Engagement.query(
        {id:$routeParams.id},
        function(data) {
            $scope.happys = data;
        }
    );
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
    $scope.comment=[];
    $scope.originalComment=[];
    $scope.comment.subcomments = [];
    $scope.originalComment.subcomments = [];
    $scope.employee=[];

    Comment.get({ id: $scope.commentId }).$then(function(response) {
        $scope.comment = response.data;
        $scope.originalComment = angular.copy($scope.comment);
        SubComments.query({ id: $scope.comment.id }).$then(function(response) {
                $scope.comment.subcomments = response.data;
                $scope.originalComment.subcomments = angular.copy($scope.comment.subcomments);
            }
        );
        $scope.comment.newSubCommentText = "";
        Employee.get(
            {id: $scope.comment.object_id},
            function(data) {
                $scope.employee = data;
                $scope.employeeId = $scope.employee.id;
            }
        );
    });

    $scope.saveComment = function(comment) {
        var data = {id: comment.id, _content: comment.content};

        Comment.update(data, function() {
            $scope.originalComment.content = comment.content;
        });
    }

    $scope.cancelEditComment = function(comment) {
        comment.content = $scope.originalComment.content;
    }

     $scope.saveSubComment = function(subcomment, comment) {
        var subcomment_index = comment.subcomments.indexOf(subcomment);
        var data = {id: subcomment.id, _content: subcomment.content};

        Comment.update(data, function() {
            $scope.originalComment.subcomments[subcomment_index].content = subcomment.content;
        });
    }

    $scope.cancelEditSubComment = function(subcomment, comment) {
        var subcomment_index = comment.subcomments.indexOf(subcomment);
        subcomment.content = $scope.originalComment.subcomments[subcomment_index].content;
    }

    $scope.addSubComment = function(comment) {
        var newComment = {};
        newComment.id = -1;
        newComment.content = comment.newSubCommentText;
        newComment.modified_date = new Date().toJSON();
        newComment.owner = User.get();

        comment.subcomments.push(newComment);
        $scope.originalComment.subcomments.push(angular.copy(newComment));

        var data = {id: newComment.id, _model_name: "comment", _object_id: comment.id,_content: newComment.content};

        data.id = $scope.employeeId;
        EmployeeComments.save(data, function(response) {
            newComment.id = response.id;
            comment.newSubCommentText = "";
        });
    }

    $scope.deleteSubComment = function(comment, subcomment) {
        if ($window.confirm('Are you sure you want to delete this comment?')) {
            var data = {id: subcomment.id};
            var subcomment_index = comment.subcomments.indexOf(subcomment);
            var deleteSuccess = function() {
                comment.subcomments.splice(subcomment_index, 1);
                $scope.originalComment.subcomments.splice(subcomment_index, 1);
            };

            Comment.remove(data, function() {
                    deleteSuccess();
                });
        }
    };

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

.controller('MyToDoListCtrl', ['$scope', '$rootScope', '$routeParams', '$window', 'ToDo', 'MyToDos', 'User', function($scope, $rootScope, $routeParams, $window, ToDo, MyToDos, User) {
    $scope.todos = MyToDos.query();
    $scope.deleteToDo = function(todo) {
        if ($window.confirm('Are you sure you want to delete this To Do?')) {
            var data = {id: todo.id};
            var todo_index = $scope.todos.indexOf(todo);
            var deleteSuccess = function() {
                $scope.todos.splice(todo_index, 1);
            };

            ToDo.remove(data, function() {
                    deleteSuccess();
                });
        }
    }
}])

.controller('EmployeeToDoListCtrl', ['$scope', '$routeParams', '$window', 'EmployeeToDo', 'ToDo', 'User', function($scope, $routeParams, $window, EmployeeToDo, ToDo, User) {
    EmployeeToDo.query({ id: $routeParams.id }).$then(function(response) {
            $scope.todos = response.data;
        }
    );
    $scope.addToDo = function(id) {
        var newToDo = {};
        newToDo.id = -1;
        newToDo.description = "";
        newToDo.assigned_to_id = -1;
        newToDo.employee_id = id;
        newToDo.due_date = null;
        newToDo.completed = "";
        newToDo.edit = true;
        newToDo.created_by = User.get();
        $scope.todos.push(newToDo);
    }
    $scope.deleteToDo = function(todo) {
        if ($window.confirm('Are you sure you want to delete this To Do?')) {
            var data = {id: todo.id};
            var todo_index = $scope.todos.indexOf(todo);
            var deleteSuccess = function() {
                $scope.todos.splice(todo_index, 1);
            };

            ToDo.remove(data, function() {
                    deleteSuccess();
                });
        }
    }
    $scope.scrubToDo = function(todo) {
        if (!todo.description) {
            var todo_index = $scope.todos.indexOf(todo);
            $scope.todos.splice(todo_index, 1);
        }
    }
}])

.controller('EmployeeToDoCtrl', ['$scope', '$window', 'Employee', 'ToDo', 'EmployeeToDo', 'Coach', function($scope, $window, Employee, ToDo, EmployeeToDo, Coach) {
    $scope.currentToDo = {due_date:null};
    $scope.$window = $window;
    $scope.$watch('currentToDo.due_date', function(newVal, oldVal){
        if (newVal != oldVal) {
            $scope.saveToDo();
        }
    },true);
    $scope.offsetTop=0;
    $scope.scrollIntoView=false;
    $scope.toggleAssigneeMenu = function () {
        $scope.openAssigneeMenu = !$scope.openAssigneeMenu;
        $scope.scrollIntoView = $scope.openAssigneeMenu;
        if ($scope.openAssigneeMenu ) {
            $scope.$window.onclick = function (event) {
                closeAssigneeWindow(event, $scope.toggleAssigneeMenu);
            };
        } else {
            $scope.openAssigneeMenu = false;
            $scope.$window.onclick = null;
            $scope.$apply(); //--> trigger digest cycle and make angular aware.
        }
    };
    $scope.closeAssigneeMenu = function() {
        $scope.openAssigneeMenu  = false;
        $scope.$window.onclick = null;
    };
    function closeAssigneeWindow(event, callbackOnClose) {
        var clickedElement = event.target;
        if (!clickedElement) return;

        var elementClasses = clickedElement.classList;
        var clickedOnAssigneeMenu = elementClasses.contains('assignee_menu');
        if (!clickedOnAssigneeMenu) {
            callbackOnClose();
        }
    }
    $scope.saveToDo = function() {
        $scope.currentToDo.edit = false;
        var assigned_to_id = null;
        if ($scope.currentToDo.assigned_to) {
            assigned_to_id = $scope.currentToDo.assigned_to.id;
        }
        var due_date = null;
        if ($scope.currentToDo.due_date) {
            date = new Date($scope.currentToDo.due_date);
            var day = date.getDate();
            var month = date.getMonth() + 1; //Months are zero based
            var year = date.getFullYear();
            due_date = year + "-" + month + "-" +  day;
        }

        var data = {id: $scope.currentToDo.id, _description: $scope.currentToDo.description, _completed: $scope.currentToDo.completed, _assigned_to_id: assigned_to_id, _due_date: due_date, _employee_id: $scope.currentToDo.employee_id, _owner_id: $scope.currentToDo.created_by.id};
        if ($scope.currentToDo.id != -1) {
            ToDo.update(data);
        } else {
            if ($scope.currentToDo.description) {
                data.id = $scope.currentToDo.employee_id;
                EmployeeToDo.addNew(data, function(response) {
                    $scope.currentToDo.id = response.id;
                });
            } else {

            }
        }
    }
    $scope.assigneeMenu = {show: false};
    $scope.assignees = Coach.query();
	$scope.startsWith  = function(expected, actual){
		if(expected && actual){
			return expected.toLowerCase().indexOf(actual.toLowerCase()) == 0;
		}
		return true;
	}

    $scope.today = function() {
        $scope.dt = new Date();
    };

    $scope.showWeeks = false;
    $scope.toggleWeeks = function () {
        $scope.showWeeks = ! $scope.showWeeks;
    };

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
        $scope.minDate = ( $scope.minDate ) ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
        if (!$scope.opened) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
            $scope.scrollIntoView = true;
        } else {
            $scope.opened = false;
            $scope.scrollIntoView = false;
        }

    };

    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
    $scope.format = $scope.formats[0];
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