angular.module('tdb.controllers', [])

.controller('BaseAppCtrl', ['$rootScope', '$location', 'User', 'Site', function($rootScope, $location, User, Site) {
    $rootScope.$on("$routeChangeError", function() {
        window.location = '/login?next=' + $location.path();
    })
   Site.get(function(data) {
            $rootScope.currentSite = data;
       }
   );
   // parse a date in yyyy-mm-dd format
    $rootScope.parseDate = function (input) {
      if (input) {
          var parts = input.match(/(\d+)/g);
          // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
          return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
      }
      return input;
    };
    $rootScope.scrubDate = function (input, display) {
        date = new Date(input);
        var day = date.getDate();
        var month = date.getMonth() + 1; //Months are zero based
        var year = date.getFullYear();
        if (display) {
            scrubbed_Date = month + "/" +  day + "/" + year;
        } else {
            scrubbed_Date = year + "-" + month + "-" +  day;
        }
        return scrubbed_Date;
    };
    $rootScope.now = function () {
        return new Date();
    };
    $rootScope.engagement_choices = [
        {id: 5, title: 'Very Happy', css: 'veryhappy'},
        {id: 4, title: 'Happy', css: 'happy'},
        {id: 3, title: 'Indifferent', css: 'indifferent'},
        {id: 2, title: 'Unhappy', css: 'unhappy'},
        {id: 1, title: 'Very Unhappy', css: 'veryunhappy'},
    ];
    $rootScope.lazyround = function (num) {
        return Math.abs(Number(num)) >= 1.0e+9

        ? Math.abs(Number(num)) / 1.0e+9 + "B"
        // Six Zeroes for Millions
        : Math.abs(Number(num)) >= 1.0e+6

        ? Math.abs(Number(num)) / 1.0e+6 + "M"
        // Three Zeroes for Thousands
        : Math.abs(Number(num)) >= 1.0e+3

        ? Math.abs(Number(num)) / 1.0e+3 + "K"

        : Math.abs(Number(num));

    };
}])

.controller('MyTeamEvaluationListCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'MyTeamPvpEvaluation', 'Team', 'analytics', function($scope, $rootScope, $location, $routeParams, MyTeamPvpEvaluation, Team, analytics) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());
    $scope.hideTeamMenu = true;
    $scope.kolbe_values=[0,1,2,3];
    $scope.vops_values=[0,320,6400,960];
    $scope.kolbe_fact_finder_labels=['simplify','explain','specify'];
    $scope.kolbe_follow_thru_labels=['adapt','maintain','systemize'];
    $scope.kolbe_quick_start_labels=['improvise','modify','stabilize'];
    $scope.kolbe_implementor_labels=['imagine','restore','build'];
    $scope.vops_labels=['low','medium','high'];
    $scope.evaluations = MyTeamPvpEvaluation.getCurrentEvaluations();
	$scope.teamId = $routeParams.team_id;
    $scope.talentCategory = $routeParams.talent_category;
    $scope.happy = $routeParams.happy;
    $scope.days_since_happy = $routeParams.days_since_happy;
    $scope.fact_finder = $routeParams.fact_finder;
    $scope.follow_thru = $routeParams.follow_thru;
    $scope.quick_start = $routeParams.quick_start;
    $scope.implementor = $routeParams.implementor;
    $scope.vops = [];
    $scope.teamName='';
    $scope.staleDays=360;
    $scope.staleDate = new Date();
    $scope.staleDate.setDate($scope.staleDate.getDate() - $scope.staleDays);
	if ($routeParams.team_id){
		Team.get(
			{id: $routeParams.team_id},
			function(data) {
				$scope.teamName = data.name
				$scope.teamId = data.id
			}
		);
	}
	$scope.menu = {show: false};
    $scope.setTeamFilter = function(id, name) {
        $scope.teamId=id;
        $scope.teamName=name;
    };

    $scope.staleHappy = function(date) {
        return ($rootScope.parseDate(date) < $scope.staleDate)
    };
    $scope.sortHappy = function(evaluation) {
        if (evaluation.employee.happiness && $rootScope.parseDate(evaluation.employee.happiness_date) > $scope.staleDate) {
            return -evaluation.employee.happiness;
        } else {
            return -1;
        }
    }
}])

.controller('EvaluationListCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'PvpEvaluation', 'Team', 'analytics', function($scope, $rootScope, $location, $routeParams, PvpEvaluation, Team, analytics) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());
    $scope.hideTeamMenu = false;
    $scope.kolbe_values=[0,1,2,3];
    $scope.vops_values=[0,320,6400,960];
    $scope.kolbe_fact_finder_labels=['simplify','explain','specify'];
    $scope.kolbe_follow_thru_labels=['adapt','maintain','systemize'];
    $scope.kolbe_quick_start_labels=['improvise','modify','stabilize'];
    $scope.kolbe_implementor_labels=['imagine','restore','build'];
    $scope.vops_labels=['low','medium','high'];
    $scope.evaluations = PvpEvaluation.getCurrentEvaluations();
	$scope.teamId = $routeParams.team_id;
    $scope.talentCategory = $routeParams.talent_category;
    $scope.happy = $routeParams.happy;
    $scope.days_since_happy = $routeParams.days_since_happy;
    $scope.fact_finder = $routeParams.fact_finder;
    $scope.follow_thru = $routeParams.follow_thru;
    $scope.quick_start = $routeParams.quick_start;
    $scope.implementor = $routeParams.implementor;
    $scope.vops = [];
    $scope.teamName='';
    $scope.staleDays=360;
    $scope.staleDate = new Date();
    $scope.staleDate.setDate($scope.staleDate.getDate() - $scope.staleDays);
	if ($routeParams.team_id){
		Team.get(
			{id: $routeParams.team_id},
			function(data) {
				$scope.teamName = data.name
				$scope.teamId = data.id
			}
		);
	}
	$scope.menu = {show: false};
    $scope.setTeamFilter = function(id, name) {
        $scope.teamId=id;
        $scope.teamName=name;
    };

    $scope.staleHappy = function(date) {
        return ($rootScope.parseDate(date) < $scope.staleDate)
    };
    $scope.sortHappy = function(evaluation) {
        if (evaluation.employee.happiness && $rootScope.parseDate(evaluation.employee.happiness_date) > $scope.staleDate) {
            return -evaluation.employee.happiness;
        } else {
            return -1;
        }
    }
}])

.controller('TeamLeadsCtrl', ['$scope', '$routeParams', 'TeamLeads', function($scope, $routeParams, TeamLeads) {
    $scope.team_id = $routeParams.id;
    $scope.teamLeads = TeamLeads.getCurrentEvaluationsForTeamLeads($scope.team_id)
}])

.controller('EmployeeListCtrl', ['$scope', '$routeParams', '$window', '$location', 'Employee', function($scope, $routeParams, $window, $location, Employee) {
    $scope.$window = $window;
    if (!$scope.employees)
    {
        $scope.employees = Employee.query({random:Math.floor((Math.random()*1000000000))}); //!important browser cache buster
    }

	$scope.employeeMenu = {show: false};
    $scope.filterMenu = {show: false};
	$scope.teamMenu = {show: false};
    $scope.settingsMenu = {show: false};
    $scope.showAddEmployee = false;
    $scope.addEmployee = [];
    if ($routeParams.id=='add'){
        $scope.showAddEmployee = true;
    }
	$scope.startsWith  = function(expected, actual){
		if(expected && actual){
			return expected.toLowerCase().indexOf(actual.toLowerCase()) == 0;
		}
		return true;
	}
    $scope.addNewEmployee = function(firstname, lastname) {
        var newEmployee = {};
        newEmployee.full_name = firstname + ' ' + lastname;
        var data = {id: 0,_full_name: newEmployee.full_name};

        Employee.addNew(data, function(response) {
            newEmployee.id = response.id;
            $scope.employees.push(newEmployee);
            $scope.showAddEmployee = false;
            changeLocation('employees/' + newEmployee.id, false);
        });
    }
    //be sure to inject $scope and $location somewhere before this
    var changeLocation = function(url, force) {
      //this will mark the URL change
      $location.path(url); //use $location.path(url).replace() if you want to replace the location instead
      $scope = $scope || angular.element(document).scope();
      if(force || !$scope.$$phase) {
        //this will kickstart angular if to notice the change
        $scope.$apply();
      }
    };
    $scope.cancelAddNewEmployee = function() {
        $scope.showAddEmployee= false;
    }
    $scope.navQuery='';
    $scope.toggleNavQuery = function () {
        $scope.openFilterMenu = false;
        $scope.openEmployeeMenu  = false;
        $scope.openTeamMenu = false;
        $scope.openSettingsMenu  = false;
        $scope.$window.onclick = function (event) {
            closeNavQuery(event);
        };
    };
    function closeNavQuery(event) {
        var clickedElement = event.target;
        if (!clickedElement) return;
        var elementClasses = clickedElement.classList;
        var clickedOnNavQuery = elementClasses.contains('nav_query');
        if (!clickedOnNavQuery) {
            $scope.navQuery='';
            $scope.$apply();
        }
    }
    $scope.toggleFilterMenu = function () {
        $scope.openFilterMenu = !$scope.openFilterMenu;
        if ($scope.openFilterMenu) {
            $scope.navQuery='';
            $scope.openEmployeeMenu  = false;
            $scope.openTeamMenu = false;
            $scope.openSettingsMenu  = false;
            $scope.$window.onclick = function (event) {
                closeFilterMenu(event, $scope.toggleFilterMenu);
            };
        } else {
            $scope.openFilterMenu  = false;
            $scope.$window.onclick = null;
            $scope.$$phase || $scope.$apply(); //--> trigger digest cycle and make angular aware.
        }
    };
    function closeFilterMenu(event, callbackOnClose) {
        var clickedElement = event.target;
        if (!clickedElement) return;
        var elementClasses = clickedElement.classList;
        var clickedOnFilterMenu = elementClasses.contains('filter_menu');
        if (!clickedOnFilterMenu) {
            callbackOnClose();
        }
    }
    $scope.toggleEmployeeMenu = function () {
        $scope.openEmployeeMenu = !$scope.openEmployeeMenu;
        if ($scope.openEmployeeMenu ) {
            $scope.navQuery='';
            $scope.openFilterMenu = false;
            $scope.openTeamMenu = false;
            $scope.openSettingsMenu  = false;
            $scope.$window.onclick = function (event) {
                closeEmployeeMenu(event, $scope.toggleEmployeeMenu);
            };
        } else {
            $scope.openEmployeeMenu  = false;
            $scope.$window.onclick = null;
            $scope.$$phase || $scope.$apply(); //--> trigger digest cycle and make angular aware.
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
            $scope.navQuery='';
            $scope.openFilterMenu = false;
            $scope.openEmployeeMenu  = false;
            $scope.openSettingsMenu  = false;
            $scope.$window.onclick = function (event) {
                closeTeamMenu(event, $scope.toggleTeamMenu);
            };
        } else {
            $scope.openTeamMenu  = false;
            $scope.$window.onclick = null;
            $scope.$$phase || $scope.$apply(); //--> trigger digest cycle and make angular aware.
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
            $scope.navQuery='';
            $scope.openFilterMenu = false;
            $scope.openEmployeeMenu  = false;
            $scope.openTeamMenu  = false;
            $scope.$window.onclick = function (event) {
                closeSettingsMenu(event, $scope.toggleSettingsMenu);
            };
        } else {
            $scope.openSettingsMenu  = false;
            $scope.$window.onclick = null;
            $scope.$$phase || $scope.$apply(); //--> trigger digest cycle and make angular aware.
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

.controller('EmployeeDetailCtrl', ['$rootScope', '$scope', '$location', '$routeParams', '$window', 'User', 'Employee', 'Engagement', 'EmployeeLeader', 'Attribute', 'CompSummary', 'PhotoUpload', '$http', 'analytics', 'fileReader','Assessment','EmployeeMBTI', function($rootScope, $scope, $location, $routeParams, $window, User, Employee, Engagement, EmployeeLeader, Attribute, CompSummary, PhotoUpload, $http, analytics, fileReader, Assessment, EmployeeMBTI) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());
    if ($routeParams.id=='add') {
        $scope.addNew = true;
    }
    $scope.show_bio = true;
    $scope.show_discussions = false;
    $scope.show_vops = false;
    $scope.show_kolbe = false;
    $scope.show_myers_briggs = false;
    $scope.show_todos = false;
    $scope.click_discussions= function() {
        $scope.show_bio = false;
        $scope.show_discussions = true;
        $scope.show_vops = false;
        $scope.show_kolbe = false;
        $scope.show_myers_briggs = false;
        $scope.show_todos = false;
    };
    $scope.click_bio= function() {
        $scope.show_bio = true;
        $scope.show_discussions = false;
        $scope.show_vops = false;
        $scope.show_kolbe = false;
        $scope.show_myers_briggs = false;
        $scope.show_todos = false;
    };
    $scope.click_todos= function() {
        $scope.show_bio = false;
        $scope.show_discussions = false;
        $scope.show_vops = false;
        $scope.show_kolbe = false;
        $scope.show_myers_briggs = false;
        $scope.show_todos = true;
    };
    $scope.click_vops= function() {
        $scope.show_bio = false;
        $scope.show_discussions = false;
        $scope.show_vops = true;
        $scope.show_kolbe = false;
        $scope.show_myers_briggs = false;
        $scope.show_todos = false;
    };
    $scope.click_kolbe= function() {
        $scope.show_bio = false;
        $scope.show_discussions = false;
        $scope.show_vops = false;
        $scope.show_kolbe = true;
        $scope.show_myers_briggs = false;
        $scope.show_todos = false;
    };
    $scope.click_myers_briggs= function() {
        $scope.show_bio = false;
        $scope.show_discussions = false;
        $scope.show_vops = false;
        $scope.show_kolbe = false;
        $scope.show_myers_briggs = true;
        $scope.show_todos = false;
    };
    $scope.leadership=[];
    $scope.edit_leadership=[];
    $scope.edit_leadership.leader=[];
    $scope.edit_leadership.leader.full_name='';
    $scope.employees = Employee.query();
    Employee.get(
        {id: $routeParams.id},
        function(data) {
            $scope.employee = data;
            $scope.edit_leadership.employee=data;
            $scope.employee.hire_date = $rootScope.parseDate($scope.employee.hire_date);
            $scope.editEmployee = angular.copy($scope.employee);
            $scope.preview=$scope.employee.avatar;
        }
    );

    EmployeeLeader.get(
       {id: $routeParams.id},
       function(data) {
            $scope.leadership = data;
            $scope.showCompensation = false;
            if ($scope.leadership.leader.id == $rootScope.currentUser.employee.id){
                $scope.showCompensation = true;
            }
            $scope.edit_leadership = angular.copy($scope.leadership);
        }
    );
    $scope.happyIndex=0;
    Engagement.query(
        {id:$routeParams.id},
        function(data) {
            $scope.happys = data;
        }
    );

    Assessment.query(
        {id:$routeParams.id},
        function(data) {
            $scope.assessments = data;
        }
    )

    EmployeeMBTI.get(
        {id: $routeParams.id},
        function(data) {
            $scope.mbti = data;
        }
    )

    $scope.selected=0;
    $scope.set_choice = function(value) {
        $scope.selected=value;
    };
    $scope.is_selected = function(value) {
        return $scope.selected==value;
    };
    $scope.disable_save_engagement = function() {
        return $scope.selected==0;
    };
    $scope.editEngagement=false;
    $scope.currentHappy=null;
    $scope.open_edit_engagement = function(happy) {
        $scope.editEngagement=true;
        $scope.selected=happy.assessment;
        $scope.currentHappy=happy;
    }
    $scope.save_engagement = function() {
        var data = {id: $scope.employee.id, _assessment: $scope.selected, _assessed_by_id: $rootScope.currentUser.employee.id};
        Engagement.addNew(data, function() {
            var happy = [];
            happy.assessment = $scope.selected;
            happy.assessed_date = Date.now();
            $scope.happys.unshift(happy);
            $scope.selected=0;
        });
    };
    $scope.update_engagement = function() {
        if ($scope.currentHappy) {
            var data = {id: $scope.employee.id, _assessment_id: $scope.currentHappy.id, _assessment: $scope.selected, _assessed_by_id: $rootScope.currentUser.employee.id};
            Engagement.update(data, function() {
                var index = $scope.happys.indexOf($scope.currentHappy);
                $scope.happys[index].assessment = $scope.selected;
            });
        }
    };
    $scope.delete_happy = function(happy, parentScope) {
        if ($window.confirm('Are you sure you want to delete this engagement?')) {
            var data = {id: happy.id };
            var index = $scope.happys.indexOf(happy);
            var deleteSuccess = function() {
                $scope.happys.splice(index, 1);
                parentScope.happyIndex=0;
            };

            Engagement.remove(data, function() {
                deleteSuccess();
            });
        }
    };
    $scope.cancel_engagement = function() {
        $scope.selected=0;
        $scope.currentHappy=null;
        $scope.editEngagement=false;
    };
    $scope.cancel_photo = function(){
        $scope.files = [];
        $scope.preview=$scope.employee.avatar;
    };
    $scope.files = [];
    $scope.uploadFile = function(files){
        $scope.files = files;
        fileReader.readAsDataUrl($scope.files[0], $scope)
                      .then(function(result) {
                          $scope.preview = result;
                      });
    };

    $scope.model = {
        name: "",
        comments: ""
    };

    //the save method
    $scope.save_photo = function() {
        var upload_data = {id: $scope.employee.id};
        PhotoUpload($scope.model, $scope.files).update(upload_data, function(data) {
          $scope.employee.avatar = data.avatar;
        });
    };
    $scope.scrollIntoView = false;
    $scope.popup = [];
    $scope.popup.top = 0;
    $scope.popup.left = 0;
    $scope.super_powers = Attribute.getAttributtesForEmployee($routeParams.id, 2);
	$scope.skills = Attribute.getAttributtesForEmployee($routeParams.id, 3);
    $scope.employeeEdit = false;
    $scope.cancelEdit = function (){
        $scope.editEmployee = angular.copy($scope.employee);
        $scope.edit_leadership = angular.copy($scope.leadership);
    };
    $scope.saveName = function (){
        var data = {id: $scope.employee.id, _full_name: $scope.editEmployee.full_name};

        Employee.update(data, function() {
            $scope.employee.full_name = $scope.editEmployee.full_name;
        });
    };
    $scope.saveStartDate  = function (){
        var hire_date = $rootScope.scrubDate($scope.editEmployee.hire_date ,false);
        var data = {id: $scope.employee.id, _hire_date: hire_date};
        Employee.update(data, function() {
            $scope.employee.hire_date = $scope.editEmployee.hire_date;
        });
    };
    $scope.clearStartDate  = function (){
        var hire_date = null;
        $scope.editEmployee.hire_date = hire_date;
        var data = {id: $scope.employee.id, _hire_date: hire_date};
        Employee.update(data, function() {
            $scope.employee.hire_date = $scope.editEmployee.hire_date;
        });
    };
    $scope.saveDepartureDate  = function (){
        var departure_date = $rootScope.scrubDate($scope.editEmployee.departure_date, false);
        var data = {id: $scope.employee.id, _departure_date: departure_date};
        Employee.update(data, function() {
            $scope.employee.departure_date = $scope.editEmployee.departure_date;
        });
    };
    $scope.clearDepartureDate  = function (){
        var departure_date = null;
        $scope.editEmployee.departure_date = departure_date;
        var data = {id: $scope.employee.id, _departure_date: departure_date};
        Employee.update(data, function() {
            $scope.employee.departure_date = $scope.editEmployee.departure_date;
        });
    };
    $scope.saveLeader  = function (){
        var data = {id: $scope.employee.id, _leader_id: $scope.edit_leadership.leader.id};
        EmployeeLeader.addNew(data, function(response) {
            $scope.edit_leadership = response;
            $scope.leadership = angular.copy($scope.edit_leadership);
        });
    };
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
        } else {
            $scope.opened = false;
        }
    };

    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
    };

    $scope.formats = ['yyyy-mm-dd', 'mm/dd/yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
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

.controller('CoachDetailCtrl', ['$scope', '$location', '$routeParams', 'Employee', 'Coachees', '$http', 'analytics', function($scope, $location, $routeParams, Employee, Coachees, $http, analytics) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());

    Coachees.query({ id: $routeParams.id }).$then(function(response) {
        $scope.coachees = response.data;
        var i = 0;
        angular.forEach($scope.coachees, function (employee) {
            employee.index = i;
            i = i + 1;
        })
        $scope.coachees_sort = angular.copy($scope.coachees)
    })

    var talentToString = function(talent){
        switch (talent) {
            case 1:
                return 'Top';
                break;
            case 2:
                return 'Strong';
                break;
            case 3:
                return 'Good';
                break;
            case 4:
                return 'Low Potential';
                break;
            case 5:
                return 'Low Performing';
                break;
            case 6:
                return 'Poor';
                break;
        }
    };
    var happyToString = function(happy){
        switch (happy) {
            case 1:
                return 'Very Unhappy';
                break;
            case 2:
                return 'Unhappy';
                break;
            case 3:
                return 'Indifferent';
                break;
            case 4:
                return 'Happy';
                break;
            case 5:
                return 'Very Happy';
                break;
            case -1:
                return 'No Data';
                break;
        }
    };
    $scope.orderValue = '';
    $scope.order = function(orderValue){
        $scope.orderValue = orderValue;
        switch(orderValue) {
            case 'name':
                $scope.coachees_sort.sort(orderByName);
                break;
            case 'talent':
                $scope.coachees_sort.sort(orderByTalent);
                break;
            case 'happy':
                $scope.coachees_sort.sort(orderByHappy);
                break;
            case 'date':
                $scope.coachees_sort.sort(orderByDate);
                break;
            default:
                $scope.coachees_sort.sort(orderByName);
                break;
        }
        var i = 0;
        angular.forEach($scope.coachees_sort, function (employee) {
            $scope.coachees[employee.index].index = i;
            i = i + 1;
        })
    }
    var orderByName = function(a,b){
        var aValue = a.full_name;
        var bValue = b.full_name;
        return ((aValue < bValue) ? -1 : ((aValue > bValue) ? 1 : 0));
    }
    var orderByTalent= function(a,b){
        var aValue = a.talent_category;
        var bValue = b.talent_category;
        var aName = a.full_name;
        var bName = b.full_name;
        if (aValue === bValue) {
            return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
        } else {
            return aValue - bValue;
        }
    }
    var orderByHappy= function(a,b){
        var aValue = a.happiness;
        var bValue = b.happiness;
        var aName = a.full_name;
        var bName = b.full_name;
        if (aValue === bValue) {
            return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
        } else {
            return bValue - aValue;
        }
    }
    var orderByDate= function(a,b){
        var aValue = Date.parse(a.happiness_date) || 0;
        var bValue = Date.parse(b.happiness_date) || 0;
        var aName = a.full_name;
        var bName = b.full_name;
        if (aValue === bValue) {
            return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
        } else {
            return bValue - aValue;
        }
    }

}])


.controller('EmployeeCompSummariesCtrl', ['$scope', '$routeParams', 'CompSummary', function($scope, $routeParams, CompSummary) {
    $scope.compSummaries = CompSummary.getAllSummariesForEmployee($routeParams.id);
}])

.controller('EmployeePvpEvaluationsCtrl', ['$scope', '$routeParams', 'PvpEvaluation', function($scope, $routeParams, PvpEvaluation) {
	$scope.pvpIndex = 0;
    PvpEvaluation.getAllEvaluationsForEmployee($routeParams.id).$then(function(response) {
		$scope.pvps = response.data;
	});

	$scope.selectPvP = function(index) {
        $scope.pvpIndex = index;
    }
}])

.controller('ReportsCtrl', ['$scope', '$location', '$routeParams', 'PvpEvaluation', 'analytics', function($scope, $location, $routeParams, PvpEvaluation, analytics) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());

    PvpEvaluation.query({current_round: true}).$then(function(response) {
            $scope.evaluations = response.data;

            var i = 0;
            angular.forEach($scope.evaluations, function (evaluation) {
                evaluation.index = i;
                i = i + 1;
            })
            $scope.evaluations_sort = angular.copy($scope.evaluations)

            $scope.csv = []
            buildCSV();
        }
    );
    var talentToString = function(talent){
        switch (talent) {
            case 1:
                return 'Top';
                break;
            case 2:
                return 'Strong';
                break;
            case 3:
                return 'Good';
                break;
            case 4:
                return 'Low Potential';
                break;
            case 5:
                return 'Low Performing';
                break;
            case 6:
                return 'Poor';
                break;
        }
    };
    var happyToString = function(happy){
        switch (happy) {
            case 1:
                return 'Very Unhappy';
                break;
            case 2:
                return 'Unhappy';
                break;
            case 3:
                return 'Indifferent';
                break;
            case 4:
                return 'Happy';
                break;
            case 5:
                return 'Very Happy';
                break;
            case -1:
                return 'No Data';
                break;
        }
    };
    $scope.orderValue = '';
    $scope.order = function(orderValue){
        $scope.orderValue = orderValue;
        switch(orderValue) {
            case 'name':
                $scope.evaluations_sort.sort(orderByName);
                break;
            case 'talent':
                $scope.evaluations_sort.sort(orderByTalent);
                break;
            case 'happy':
                $scope.evaluations_sort.sort(orderByHappy);
                break;
            case 'date':
                $scope.evaluations_sort.sort(orderByDate);
                break;
            default:
                $scope.evaluations_sort.sort(orderByName);
                break;
        }

        var i = 0;
        angular.forEach($scope.evaluations_sort, function (evaluation) {
            $scope.evaluations[evaluation.index].index = i;
            i = i + 1;
        })
        buildCSV();
    }
    var buildCSV = function() {
        $scope.csv = []
        angular.forEach($scope.evaluations_sort, function(evaluation) {
            var row = {};
            row.name = evaluation.employee.full_name;
            row.talent = talentToString(evaluation.talent_category);
            row.happy = happyToString(evaluation.employee.happiness);
            row.date = evaluation.employee.happiness_date;
            $scope.csv.push(row);
        });
    }
    var orderByName = function(a,b){
        var aValue = a.employee.full_name;
        var bValue = b.employee.full_name;
        return ((aValue < bValue) ? -1 : ((aValue > bValue) ? 1 : 0));
    }
    var orderByTalent= function(a,b){
        var aValue = a.talent_category;
        var bValue = b.talent_category;
        var aName = a.employee.full_name;
        var bName = b.employee.full_name;
        if (aValue === bValue) {
            return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
        } else {
            return aValue - bValue;
        }
    }
    var orderByHappy= function(a,b){
        var aValue = a.employee.happiness;
        var bValue = b.employee.happiness;
        var aName = a.employee.full_name;
        var bName = b.employee.full_name;
        if (aValue === bValue) {
            return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
        } else {
            return bValue - aValue;
        }
    }
    var orderByDate= function(a,b){
        var aValue = Date.parse(a.employee.happiness_date) || 0;
        var bValue = Date.parse(b.employee.happiness_date) || 0;
        var aName = a.employee.full_name;
        var bName = b.employee.full_name;
        if (aValue === bValue) {
            return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
        } else {
            return bValue - aValue;
        }
    }

}])

.controller('CompanyOverviewCtrl', ['$rootScope', '$scope', '$location', '$routeParams', 'TalentCategoryReport', 'SalaryReport', 'KPIIndicator', 'KPIPerformance', 'analytics', function($rootScope, $scope, $location, $routeParams, TalentCategoryReport, SalaryReport, KPIIndicator, KPIPerformance, analytics) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());
    KPIIndicator.get(function(data) {
            $scope.indicator = data;
       }
    );
    KPIPerformance.get(function(data) {
            $scope.performance = data;
            $scope.performance.value = $rootScope.lazyround($scope.performance.value);
            $scope.performance.date = $rootScope.scrubDate($scope.performance.date, true);
       }
    );
    TalentCategoryReport.getReportForCompany(function(data) {
        $scope.talentCategoryReport = data;
    });
    SalaryReport.getReportForCompany(function(data) {
        $scope.salaryReport = data;
    });
}])

.controller('PeopleReportCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'HappinessReport', 'EngagementReport', 'TalentCategoryReport', 'Engagement', 'analytics', function($scope, $rootScope, $location, $routeParams, HappinessReport, EngagementReport, TalentCategoryReport, Engagement, analytics) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());
    $scope.days_ago = 120;
    EngagementReport.getReportForCompany($scope.days_ago, function(data) {
        $scope.talentCategoryReport = data;
    });

    HappinessReport.getReportForCompany($scope.days_ago, true).$then(function(response) {
        $scope.neglectedEmployees = response.data;
        angular.forEach($scope.neglectedEmployees, function(neglected) {
            neglected.happy = Engagement.getCurrentEngagement(neglected.employee.id);
        });
    });
}])

.controller('ToDoReportCtrl', ['$scope', '$rootScope', '$location', '$routeParams', '$window', 'EmployeeToDo', 'ToDo', function($scope, $rootScope, $location, $routeParams, $window, EmployeeToDo, ToDo) {
    $scope.todos = EmployeeToDo.getReportForCompany(7);
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

.controller('LeaderOverviewCtrl', ['$scope', '$location', '$routeParams', 'TalentCategoryReport', 'SalaryReport', 'TeamLeadEmployees', 'User', 'analytics', function($scope, $location, $routeParams, TalentCategoryReport, SalaryReport, TeamLeadEmployees, User, analytics) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());

    User.get(
        function(data) {
            $scope.lead= data.employee;
            TeamLeadEmployees.getEmployees($scope.lead.id, function(data) {
                    $scope.employees = data;
                }
            );
        }
    );

    TalentCategoryReport.getReportForLead(function(data) {
        $scope.talentCategoryReport = data;
    });

    SalaryReport.getReportForLead(function(data) {
        $scope.salaryReport = data;
    });
}])

.controller('TeamOverviewCtrl', ['$scope', '$location', '$routeParams', 'TalentCategoryReport', 'SalaryReport', 'Team', 'TeamMembers', 'TeamMBTI', 'analytics', function($scope, $location, $routeParams, TalentCategoryReport, SalaryReport, Team, TeamMembers, TeamMBTI, analytics) {
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

    TeamMBTI.get(
        {id: $routeParams.id},
        function(data) {
            $scope.mbti = data;
            angular.forEach($scope.mbti.mbtis, function(mbti_type) {
                if (mbti_type.type=='istj'){ $scope.istj=mbti_type }
                if (mbti_type.type=='isfj'){ $scope.isfj=mbti_type }
                if (mbti_type.type=='infj'){ $scope.infj=mbti_type }
                if (mbti_type.type=='intj'){ $scope.intj=mbti_type }
                if (mbti_type.type=='istp'){ $scope.istp=mbti_type }
                if (mbti_type.type=='isfp'){ $scope.isfp=mbti_type }
                if (mbti_type.type=='infp'){ $scope.infp=mbti_type }
                if (mbti_type.type=='intp'){ $scope.intp=mbti_type }
                if (mbti_type.type=='estp'){ $scope.estp=mbti_type }
                if (mbti_type.type=='esfp'){ $scope.esfp=mbti_type }
                if (mbti_type.type=='enfp'){ $scope.enfp=mbti_type }
                if (mbti_type.type=='entp'){ $scope.entp=mbti_type }
                if (mbti_type.type=='estj'){ $scope.estj=mbti_type }
                if (mbti_type.type=='esfj'){ $scope.esfj=mbti_type }
                if (mbti_type.type=='enfj'){ $scope.enfj=mbti_type }
                if (mbti_type.type=='entj'){ $scope.entj=mbti_type }
            });

        }
    );

    $scope.show_discussions = true;
    $scope.show_vops = false;
    $scope.show_kolbe = false;
    $scope.show_myers_briggs = false;
    $scope.click_discussions= function() {
        $scope.show_discussions = true;
        $scope.show_vops = false;
        $scope.show_kolbe = false;
        $scope.show_myers_briggs = false;
        $scope.show_todos = false;
    };
    $scope.click_bio= function() {
        $scope.show_discussions = false;
        $scope.show_vops = false;
        $scope.show_kolbe = false;
        $scope.show_myers_briggs = false;
        $scope.show_todos = false;
    };
    $scope.click_vops= function() {
        $scope.show_discussions = false;
        $scope.show_vops = true;
        $scope.show_kolbe = false;
        $scope.show_myers_briggs = false;
        $scope.show_todos = false;
    };
    $scope.click_kolbe= function() {
        $scope.show_discussions = false;
        $scope.show_vops = false;
        $scope.show_kolbe = true;
        $scope.show_myers_briggs = false;
        $scope.show_todos = false;
    };
    $scope.click_myers_briggs= function() {
        $scope.show_discussions = false;
        $scope.show_vops = false;
        $scope.show_kolbe = false;
        $scope.show_myers_briggs = true;
        $scope.show_todos = false;
    };
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
            comment.expandChildTextArea=false;
        });

        $scope.CreateHeader = function(date) {
            date=$filter('date')(date,"MM/dd/yyyy");
            showHeader = (date!=$scope.currentGroup);
            $scope.currentGroup = date;
            return showHeader;
        }
    });
    $scope.toggleChildCommentTextExpander = function (comment) {
        $window.onclick = function (event) {
            if (!comment.newSubCommentText) {
                var clickedElement = event.target;
                if (!clickedElement) return;
                var elementClasses = clickedElement.classList;
                var clickedOnTextArea = elementClasses.contains('text');
                if (!clickedOnTextArea) {
                    comment.expandTextArea=false;
                    $scope.$apply();
                }
            }
        };
    };

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
    $scope.completed_todos = MyToDos.query({ completed: true });
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
    $scope.completed_todos = EmployeeToDo.query({ id: $routeParams.id, completed: true });
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

.controller('EmployeeToDoCtrl', ['$rootScope', '$scope', '$window', 'Employee', 'ToDo', 'EmployeeToDo', 'Coach', function($rootScope, $scope, $window, Employee, ToDo, EmployeeToDo, Coach) {
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
            $scope.$$phase || $scope.$apply(); //--> trigger digest cycle and make angular aware.
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
            due_date = $rootScope.scrubDate($scope.currentToDo.due_date, false);
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

.controller('EmployeeCommentsCtrl', ['$scope', '$filter', '$routeParams', '$window', 'Comments', 'EmployeeComments', 'SubComments','Comment', 'User', function($scope, $filter, $routeParams, $window, Comments, EmployeeComments, SubComments, Comment, User) {
    $scope.employeeId = $routeParams.id;
    $scope.newCommentText = "";
    $scope.toggleCommentTextExpander = function (comment) {
        $window.onclick = function (event) {
            if (!$scope.newCommentText) {
                var clickedElement = event.target;
                if (!clickedElement) return;
                var elementClasses = clickedElement.classList;
                var clickedOnTextArea = elementClasses.contains('text');
                if (!clickedOnTextArea) {
                    comment.expandTextArea=false;
                    $scope.$apply();
                }
            }
        };
    };
    $scope.toggleChildCommentTextExpander = function (comment) {
        $window.onclick = function (event) {
            if (!comment.newSubCommentText) {
                var clickedElement = event.target;
                if (!clickedElement) return;
                var elementClasses = clickedElement.classList;
                var clickedOnTextArea = elementClasses.contains('text');
                if (!clickedOnTextArea) {
                    comment.expandChildTextArea=false;
                    $scope.$apply();
                }
            }
        };
    };

    Comments.getEmployeeComments($scope.employeeId, function(data) {
        $scope.comments = data;
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
            comment.expandTextArea = false;
            comment.expandChildTextArea = false;
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
}])

.controller('TeamCommentsCtrl', ['$scope', '$filter', '$routeParams', '$window', 'Comments', 'EmployeeComments','SubComments','Comment', 'User',function($scope, $filter, $routeParams, $window, Comments, EmployeeComments, SubComments, Comment, User) {
    $scope.teamId = $routeParams.id;
    $scope.newCommentText = "";
    $scope.toggleCommentTextExpander = function (comment) {
        $window.onclick = function (event) {
            if (!$scope.newCommentText) {
                var clickedElement = event.target;
                if (!clickedElement) return;
                var elementClasses = clickedElement.classList;
                var clickedOnTextArea = elementClasses.contains('text');
                if (!clickedOnTextArea) {
                    comment.expandTextArea=false;
                    $scope.$apply();
                }
            }
        };
    };
    $scope.toggleChildCommentTextExpander = function (comment) {
        $window.onclick = function (event) {
            if (!comment.newSubCommentText) {
                var clickedElement = event.target;
                if (!clickedElement) return;
                var elementClasses = clickedElement.classList;
                var clickedOnTextArea = elementClasses.contains('text');
                if (!clickedOnTextArea) {
                    comment.expandChildTextArea=false;
                    $scope.$apply();
                }
            }
        };
    };
    TalentCategoryReport.getReportForTeam($routeParams.id, function(data) {
        $scope.talentCategoryReport = data;
    });
    Comments.getTeamComments($routeParams.id, function(data) {
        $scope.comments = data;
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
            comment.expandTextArea = false;
            comment.expandChildTextArea = false;

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

.controller('LeaderCommentsCtrl', ['$scope', '$filter', '$routeParams', '$window', 'Comments', 'EmployeeComments', 'SubComments','Comment', 'User',function($scope, $filter, $routeParams, $window, Comments, EmployeeComments, SubComments, Comment, User) {
     User.get(
        function(data) {
            $scope.lead= data.employee;
            $scope.leadId = $scope.lead.id;

            Comments.getLeadComments($scope.leadId, function(data) {
                $scope.comments = data;
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
                    comment.expandTextArea = false;
                    comment.expandChildTextArea = false;

                });

                $scope.CreateHeader = function(date) {
                    date=$filter('date')(date,"MM/dd/yyyy");
                    showHeader = (date!=$scope.currentGroup);
                    $scope.currentGroup = date;
                    return showHeader;
                }
            });

        }
    );
    $scope.newCommentText = "";
    $scope.toggleCommentTextExpander = function (comment) {
        $window.onclick = function (event) {
            if (!$scope.newCommentText) {
                var clickedElement = event.target;
                if (!clickedElement) return;
                var elementClasses = clickedElement.classList;
                var clickedOnTextArea = elementClasses.contains('text');
                if (!clickedOnTextArea) {
                    comment.expandTextArea=false;
                    $scope.$apply();
                }
            }
        };
    };
    $scope.toggleChildCommentTextExpander = function (comment) {
        $window.onclick = function (event) {
            if (!comment.newSubCommentText) {
                var clickedElement = event.target;
                if (!clickedElement) return;
                var elementClasses = clickedElement.classList;
                var clickedOnTextArea = elementClasses.contains('text');
                if (!clickedOnTextArea) {
                    comment.expandChildTextArea=false;
                    $scope.$apply();
                }
            }
        };
    };

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

        EmployeeComment.update(data, function() {
            $scope.originalComments[parent_index].subcomments[subcomment_index].content = subcomment.content;
        });
    }

    $scope.cancelEditSubComment = function(subcomment, comment) {
        var parent_index = $scope.comments.indexOf(comment);
        var subcomment_index = $scope.comments[parent_index].subcomments.indexOf(subcomment);
        subcomment.content = $scope.originalComments[parent_index].subcomments[subcomment_index].content;
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
}]);