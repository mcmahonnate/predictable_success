angular.module('tdb.controllers', [])

.controller('BaseAppCtrl', ['$rootScope', '$location', '$document', 'User', 'Customers', function($rootScope, $location, $document, User, Customers) {
    $rootScope.$on("$routeChangeError", function() {
        window.location = '/account/login?next=' + $location.path();
    });
    Customers.get(function(data) {
            $rootScope.customer = data;
       }
    );
    $document.on('click',function(event){
        element = angular.element(event.target);
        if ((!element.hasClass('nav-item-icon') && !element.hasClass('nav-input')) && $rootScope.activeTab) {
            $rootScope.activeTab = null
            $rootScope.$apply();
        }
    });
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
        var date = new Date(input);
        if (isNaN(date)) { return null};
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
        {id: 1, title: 'Very Unhappy', css: 'veryunhappy'}
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

.controller('MyCoacheesEvaluationListCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'MyCoacheesPvpEvaluation', 'Team', 'Customers', 'TalentCategories', 'analytics', function($scope, $rootScope, $location, $routeParams, MyCoacheesPvpEvaluation, Team, Customers, TalentCategories, analytics) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());
    Customers.get(function (data) {
        $scope.customer = data;
    });
    $scope.hideTeamMenu = true;
    $scope.kolbe_values=[0,1,2,3];
    $scope.vops_values=[0,320,6400,960];
    $scope.kolbe_fact_finder_labels=['simplify','explain','specify'];
    $scope.kolbe_follow_thru_labels=['adapt','maintain','systemize'];
    $scope.kolbe_quick_start_labels=['improvise','modify','stabilize'];
    $scope.kolbe_implementor_labels=['imagine','restore','build'];
    $scope.evaluations = MyCoacheesPvpEvaluation.getCurrentEvaluations();
    $scope.teamId = $routeParams.team_id;
    $scope.talentCategory = $routeParams.talent_category;
    $scope.categoryName  = TalentCategories.getLabelByTalentCategory($scope.talentCategory)
    $scope.happy = $routeParams.happy;
    $scope.days_since_happy = $routeParams.days_since_happy;
    $scope.fact_finder = $routeParams.fact_finder;
    $scope.follow_thru = $routeParams.follow_thru;
    $scope.quick_start = $routeParams.quick_start;
    $scope.implementor = $routeParams.implementor;
    $scope.vops={visionary:false,operator:false,processor:false,synergist:false};
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
    $scope.clearSynegistStyle = function() {
        $scope.vops={visionary:false,operator:false,processor:false,synergist:false};
    };
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

.controller('MyTeamEvaluationListCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'MyTeamPvpEvaluation', 'Team', 'Customers', 'TalentCategories', 'analytics', function($scope, $rootScope, $location, $routeParams, MyTeamPvpEvaluation, Team, Customers, TalentCategories, analytics) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());
    Customers.get(function (data) {
        $scope.customer = data;
    });
    $scope.hideTeamMenu = true;
    $scope.kolbe_values=[0,1,2,3];
    $scope.kolbe_fact_finder_labels=['simplify','explain','specify'];
    $scope.kolbe_follow_thru_labels=['adapt','maintain','systemize'];
    $scope.kolbe_quick_start_labels=['improvise','modify','stabilize'];
    $scope.kolbe_implementor_labels=['imagine','restore','build'];
    $scope.evaluations = MyTeamPvpEvaluation.getCurrentEvaluations();
    $scope.teamId = $routeParams.team_id;
    $scope.talentCategory = $routeParams.talent_category;
    $scope.categoryName  = TalentCategories.getLabelByTalentCategory($scope.talentCategory)
    $scope.happy = $routeParams.happy;
    $scope.days_since_happy = $routeParams.days_since_happy;
    $scope.fact_finder = $routeParams.fact_finder;
    $scope.follow_thru = $routeParams.follow_thru;
    $scope.quick_start = $routeParams.quick_start;
    $scope.implementor = $routeParams.implementor;
    $scope.vops={visionary:false,operator:false,processor:false,synergist:false};
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
    $scope.clearSynegistStyle = function() {
        $scope.vops={visionary:false,operator:false,processor:false,synergist:false};
    };
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

.controller('EvaluationListCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'PvpEvaluation', 'Team', 'Customers', 'TalentCategories', 'analytics', function($scope, $rootScope, $location, $routeParams, PvpEvaluation, Team, Customers, TalentCategories, analytics) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());
    Customers.get(function (data) {
        $scope.customer = data;
    });
    $scope.happiness = '';
    $scope.hideTeamMenu = false;
    $scope.kolbe_values=[0,1,2,3];
    $scope.kolbe_fact_finder_labels=['simplify','explain','specify'];
    $scope.kolbe_follow_thru_labels=['adapt','maintain','systemize'];
    $scope.kolbe_quick_start_labels=['improvise','modify','stabilize'];
    $scope.kolbe_implementor_labels=['imagine','restore','build'];
    $scope.evaluations = PvpEvaluation.getCurrentEvaluations();
    $scope.teamId = $routeParams.team_id;
    $scope.talentCategory = $routeParams.talent_category.toString();
    $scope.categoryName  = TalentCategories.getLabelByTalentCategory($scope.talentCategory);
    $scope.days_since_happy = $routeParams.days_since_happy;
    $scope.fact_finder = angular.copy($scope.kolbe_fact_finder_labels);
    $scope.follow_thru = angular.copy($scope.kolbe_follow_thru_labels);
    $scope.quick_start = angular.copy($scope.kolbe_quick_start_labels);
    $scope.implementor = angular.copy($scope.kolbe_implementor_labels);
    $scope.vops={visionary:false,operator:false,processor:false,synergist:false};
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
    $scope.clearSynegistStyle = function() {
        $scope.vops={visionary:false,operator:false,processor:false,synergist:false};
    };
    $scope.setTeamFilter = function(id, name) {
        $scope.teamId=id;
        $scope.teamName=name;
    };
    $scope.setHappyFilter = function(id, name) {
        $scope.happy=id;
        $scope.happyName=name;
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

.controller('AddEditBioCtrl', ['$scope', '$rootScope', '$routeParams', '$modalInstance', '$location', 'employee', 'leadership', 'employees', 'teams', 'Employee', 'EmployeeLeader', 'fileReader', 'PhotoUpload', function($scope, $rootScope, $routeParams, $modalInstance, $location, employee, leadership, employees, teams, Employee, EmployeeLeader, fileReader, PhotoUpload) {
    $scope.employee = angular.copy(employee);
    $scope.leadership = angular.copy(leadership);
    $scope.teams = teams;
    $scope.employees = employees;
    $scope.preview=$scope.employee.avatar;
    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
    $scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        showWeeks: false
    };
    $scope.datepickers = {
        hire_date: false,
        depart_date: false
    }
    $scope.open = function($event, which) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.datepickers[which] = true;
    };
    $scope.showHireDatePicker = false;
    $scope.showDepartDatePicker = false;
    $scope.toggleHireDatePicker = function(){
        $scope.showDepartDatePicker = false;
        $scope.showHireDatePicker = !$scope.showHireDatePicker;
    };
    $scope.toggleDepartDatePicker = function(){
        $scope.showHireDatePicker = false;
        $scope.showDepartDatePicker = !$scope.showDepartDatePicker;
    };
    $scope.saveEmployee = function() {
        var data = getData();
        console.log(data);
        if ($scope.employee.id > 0) {
            Employee.update(data, function (response) {
                $scope.employee = response;
                saveOtherInfo(false);
            });
        } else {
            Employee.addNew(data, function (response) {
                $scope.employee = response;
                saveOtherInfo(true);
            });
        }
    };
    var saveOtherInfo = function(addNew) {
        if ($scope.preview != $scope.employee.avatar) {
            var upload_data = {id: $scope.employee.id};
            PhotoUpload($scope.model, $scope.files).update(upload_data, function (data) {
                $scope.employee.avatar = data.avatar;
            });
        }
        $modalInstance.close($scope.employee);
        if (addNew) {changeLocation('employees/' + $scope.employee.id, false);}
    };

    var getData = function() {
        var data = {id: $scope.employee.id};
        data._first_name = $scope.employee.first_name;
        data._last_name = $scope.employee.last_name;
        data._email = $scope.employee.email;
        data._hire_date = ($scope.employee.hire_date) ? $rootScope.scrubDate($scope.employee.hire_date, false) : null;
        data._departure_date = ($scope.employee.departure_date) ? $rootScope.scrubDate($scope.employee.departure_date, false) : null;
        data._team_id = ($scope.employee.team && $scope.employee.team.name) ? $scope.employee.team.id : null;
        data._coach_id = ($scope.employee.coach && $scope.employee.coach.full_name) ? $scope.employee.coach.id : null;
        data._leader_id = ($scope.employee.current_leader && $scope.employee.current_leader.full_name) ? $scope.employee.current_leader.id : null;
        return data;
    };
    $scope.uploadFile = function(files){
        $scope.files = files;
        fileReader.readAsDataUrl($scope.files[0], $scope)
                      .then(function(result) {
                          $scope.preview = result;
                      });
    };
    var changeLocation = function(url, force) {
        //this will mark the URL change
        $location.path(url); //use $location.path(url).replace() if you want to replace the location instead
        $scope = $scope || angular.element(document).scope();
    };
}])

.controller('NavigationCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$modal', 'Employee', 'Customers', 'Team', function($scope, $rootScope, $routeParams, $location, $modal, Employee, Customers, Team) {
    //search
    if (!$scope.employees) {
        $scope.employees = Employee.query(); //!important browser cache buster
    }
    Customers.get(function (data) {
        $scope.customer = data;
    });

    if (!$scope.employees && $rootScope.currentUser.can_view_company_dashboard) {
        $scope.employees = Employee.query();
    }

    //teams
    $scope.teams = Team.query();
    $scope.modalEmployeeShown = false;
    $scope.newEmployee = {
        id:0,full_name:'',
        first_name:'',
        last_name:'', 
        email:'', 
        team:{id:null, name:''},
        hire_date:'',
        departure_date:'', 
        avatar:'https://hippoculture.s3.amazonaws.com/media/avatars/geneRick.jpg'
    };

    $scope.newLeadership = {
        id:null,
        leader:{full_name:''}
    };  

    $scope.startsWith  = function(expected, actual){
        if(expected && actual){
            return expected.toLowerCase().indexOf(actual.toLowerCase()) == 0;
        }
        return true;
    }

    //show add employee modal 
    $scope.toggleEmployeeModal = function() {
        $scope.modalEmployeeShown = !$scope.modalEmployeeShown;
    };

    $scope.addEmployee = function (employee, leadership, employees, teams) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: '/static/angular/partials/_modals/edit-bio-modal.html',
            controller: 'AddEditBioCtrl',
            resolve: {
                employee: function () {
                    return employee
                },
                leadership: function () {
                    return leadership
                },
                employees: function () {
                    return employees
                },
                teams: function () {
                    return teams
                }
            }
        });
    };

    //clear search
    $scope.navQuery = '';

    //set active tab
    $rootScope.activeTab = null;

    //tabs
    $scope.zonesTab = 'zones';
    $scope.teamsTab = 'teams';
    $scope.settingsTab = 'settings';
    $scope.searchTab = 'search';

    $scope.setActiveTab = function (tab) {
        if ($rootScope.activeTab == tab) {
            $rootScope.activeTab = null;
        } else {
            $rootScope.activeTab = tab;
        }    
    };
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

.controller('EmployeePvpEvaluationsCtrl', ['$scope', '$routeParams', 'PvpEvaluation', '$modal', function($scope, $routeParams, PvpEvaluation, $modal) {
    $scope.pvpIndex = 0;
    $scope.pvps = null;
    PvpEvaluation.getAllEvaluationsForEmployee($routeParams.id).$promise.then(function(response) {
        $scope.pvps = response;
    });
    $scope.selectPvP = function(index) {
        $scope.pvpIndex = index;
        updateSlidePosition();
    }
    $scope.editPvP = function (pvps, index) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: '/static/angular/partials/_modals/edit-pvp.html',
            controller: 'AddEditPvPCtrl',
            resolve: {
                pvp: function () {
                    return pvps[index]
                }
            }
        });
        modalInstance.result.then(
            function (pvp) {
                $scope.pvps[index].performance = pvp.performance;
                $scope.pvps[index].potential = pvp.potential;
                $scope.pvps[index].talent_category = pvp.talent_category;
            }
        );
    };
}])

.controller('AddEditPvPCtrl', ['$scope', '$modalInstance', 'pvp', 'Prospect', 'PvpEvaluation', 'PvpDescriptions', 'TalentCategories', function($scope, $modalInstance, pvp, Prospect, PvpEvaluation, PvpDescriptions, TalentCategories) {
    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
    $scope.pvp = angular.copy(pvp);
    Prospect.get({email: $scope.pvp.employee.email}, function(response) {
        $scope.selfAssessment = response;
        switch ($scope.selfAssessment.engagement) {
            case 1:
                $scope.selfAssessment.engagement = 5
                break;
            case 2:
                $scope.selfAssessment.engagement = 4
                break;
            case 4:
                $scope.selfAssessment.engagement = 2
                break;
            case 5:
                $scope.selfAssessment.engagement = 1
                break;
        }
        $scope.selfAssessment.talent_category_label = TalentCategories.getLabelByTalentCategory($scope.selfAssessment.talent_category);
    });
    $scope.showSelfAssessment=false;
    $scope.pvp.label = TalentCategories.getLabelByTalentCategory(pvp.talent_category);
    $scope.$watch('pvp.talent_category', function(newVal, oldVal){
        if (newVal != oldVal) {
            $scope.pvp.label = TalentCategories.getLabelByTalentCategory(newVal);
        }
    },true);
    PvpDescriptions.query().$promise.then(function(response) {
            $scope.pvp_descriptions = response;
        }
    );

    $scope.save = function() {
        if ($scope.pvp.comment && $scope.pvp.comment.content) {
            var data = {id: $scope.pvp.id, _potential: $scope.pvp.potential, _performance: $scope.pvp.performance, _content: $scope.pvp.comment.content};
            PvpEvaluation.update(data, function (response) {
                $scope.pvp = response;
                $modalInstance.close($scope.pvp);
            });
        } else {
            data = {id: $scope.pvp.id, _potential: $scope.pvp.potential, _performance: $scope.pvp.performance};
            PvpEvaluation.update(data, function (response) {
                $scope.pvp = response;
                $modalInstance.close($scope.pvp);
            });
        }
    };

}])


.controller('EmployeeDetailCtrl', ['$rootScope', '$scope', '$location', '$routeParams', '$window', '$modal', 'User', 'Employee', 'Team', 'Engagement', 'SendEngagementSurvey', 'EmployeeLeader', 'Attribute', '$http', 'Customers', 'analytics','EmployeeMBTI', 'Notification', function($rootScope, $scope, $location, $routeParams, $window, $modal, User, Employee, Team, Engagement, SendEngagementSurvey, EmployeeLeader, Attribute, $http, Customers, analytics, EmployeeMBTI, Notification) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());
    Customers.get(function (data) {
        $scope.customer = data;
    });
    $rootScope.$watch('currentUser', function(newVal, oldVal){
        if (newVal != oldVal) {
            $scope.currentUser = $rootScope.currentUser;
        }
    },true);

    $scope.dynamicTooltipText = "LOGOUT";

    $scope.modalHappyShown = false;
    $scope.toggleHappyModal = function() {
        $scope.modalHappyShown = !$scope.modalHappyShown;
    };
    $scope.modalSurveyShown = false;
    $scope.toggleSurveyModal = function() {
        $scope.modalSurveyShown = !$scope.modalSurveyShown;
    };
    $scope.leadership=[];
    Team.query(function(data) {
        $scope.teams = data;
    });
    if (!$scope.employees && $rootScope.currentUser && $rootScope.currentUser.can_view_company_dashboard) {
         $scope.employees = Employee.query();
     }
    Employee.get(
        {id: $routeParams.id},
        function(data) {
            $scope.employee = data;
            $scope.employee.hire_date = $rootScope.parseDate($scope.employee.hire_date);
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
        }
    );
    $scope.happyIndex=0;
    Engagement.query(
        {id:$routeParams.id},
        function(data) {
            $scope.happys = data;
        }
    );
    $scope.isSurveySending=false;
    $scope.sendSurvey = function(){
      $scope.isSurveySending=true;
      var data = {id: $routeParams.id, _sent_from_id: $rootScope.currentUser.employee.id, _override:true};

      SendEngagementSurvey.addNew(data, function() {
          $scope.isSurveySending=false;
          Notification.success("Your survey was sent.");
      },function(){
          $scope.isSurveySending=false;
          Notification.error("There was an error sending your survey.");
      });
    };

    $scope.clicked_happy;

    EmployeeMBTI.get(
        {id: $routeParams.id},
        function(data) {
            $scope.mbti = data;
            if ($scope.mbti.description){
                $scope.has_mbti = true;
            }
        }
    );

    $scope.selected=0;
    $scope.set_choice = function(value) {
        $scope.selected=value;
    };
    $scope.is_selected = function(value) {
        return $scope.selected==value;
    };
    Attribute.getAttributesForEmployee($routeParams.id).$promise.then(function(response) {
        $scope.attributes = response;
        var is_even = ($scope.attributes.length % 2 == 0);
        if ($scope.customer.show_vops) {
            if (!is_even)
                $scope.vops_class = 'shaded';
            is_even = !is_even;
        }
        if ($scope.customer.show_mbti) {
            if (!is_even)
                $scope.mbti_class = 'shaded';
            is_even = !is_even;
        }
        if ($scope.customer.show_kolbe) {
            if (!is_even)
                $scope.kolbe_class = 'shaded';
        }
    });


    $scope.showAttributes = function (view, category) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: '/static/angular/partials/_modals/show-attributes.html',
            controller: 'ShowAttributesCtrl',
            resolve: {
                category: function () {
                    return category
                },
                view: function () {
                    return view
                },
                mbti: function () {
                    return $scope.mbti
                }
            }
        });
    };
    $scope.editEmployee = function (employee, leadership, employees, teams) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: '/static/angular/partials/_modals/edit-bio-modal.html',
            controller: 'AddEditBioCtrl',
            resolve: {
                employee: function () {
                    return employee
                },
                leadership: function () {
                    return leadership
                },
                employees: function () {
                    return employees
                },
                teams: function () {
                    return teams
                }
            }
        });
        modalInstance.result.then(
            function (e, l) {
                $scope.employee = e;
            }
        );
    };
    $scope.formats = ['yyyy-mm-dd', 'mm/dd/yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
}])

.controller('ShowAttributesCtrl', ['$scope', '$routeParams', '$modalInstance', '$sce', 'Assessment', 'view', 'category', 'mbti', function($scope, $routeParams, $modalInstance, $sce, Assessment, view, category, mbti) {
    $scope.view = view;
    $scope.category = category;
    if (mbti) {
        $scope.mbti = mbti;
    };
    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
    $scope.getMbtiDescription = function() {
        if ($scope.mbti) {
            return $sce.trustAsHtml($scope.mbti.description);
        } else {
            return null;
        }
    };
    Assessment.query(
        {id:$routeParams.id, category:$scope.category},
        function(data) {
            $scope.assessments = data;
            if ($scope.assessments){
                $scope.name = $scope.assessments[0].name
                $scope.description = $scope.assessments[0].description
            }
        }
    );
    $scope.getDescription = function() {
        return $sce.trustAsHtml($scope.description);
    };
}])

.controller('UploadDataCtrl', ['$scope', 'ImportData','Notification','EmployeeNames', function($scope, ImportData, Notification, EmployeeNames) {
    $scope.data;
    $scope.importData = [];
    $scope.hasColumnHeaders=true;
    $scope.hot;
    $scope.columns = [];
    $scope.importing = false;
    $scope.import = function() {
        $scope.importing =true
        ImportData.addNew($scope.hot.getData()).$promise.then(function(data) {
            EmployeeNames.query(function(data) {
                $scope.autocomplete_values = data;
            });
            $scope.data = data;
            $scope.importing = false;
            if (data.length > 0) {
                Notification.warning("Awesome but we ran into some errors. Make your corrections below.");
            } else {
                $scope.hot.destroy();
                Notification.success("Your data imported successfully.");
            }
        },function(){
            $scope.isSurveySending=false;
            Notification.error("There was an error importing your data.");
        });
    };
}])

.controller('CoachDetailCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'User', 'Employee', 'Coachees', 'TalentReport', '$http', 'analytics', function($scope, $rootScope, $location, $routeParams, User, Employee, Coachees, TalentReport, $http, analytics) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());
    $scope.coach= $rootScope.currentUser.employee;

    Coachees.query({ id: $routeParams.id }).$promise.then(function(response) {
        $scope.employees = response;
    });
    $scope.talentReport = TalentReport.myCoachees();
}])


.controller('EmployeeCompSummariesCtrl', ['$scope', '$routeParams', 'CompSummary', function($scope, $routeParams, CompSummary) {
    $scope.compSummaries = CompSummary.getAllSummariesForEmployee($routeParams.id);
}])

.controller('SelfAssessReportCtrl', ['$scope', '$rootScope','ProspectReport', 'TalentCategories', 'User', 'analytics', function($scope, $rootScope, ProspectReport, TalentCategories, User, analytics) {
    ProspectReport.query({domain: 'com'}).$promise.then(function(response) {
            $scope.selfAssessments = response;
            var i = 0;
            angular.forEach($scope.selfAssessments, function (selfAssessment) {
                selfAssessment.index = i;
                i = i + 1;
            })
            $scope.selfAssessments_sort = angular.copy($scope.selfAssessments)
            $scope.csv = []
            buildCSV();
            $scope.busy = false;
    });
    $scope.getLabel = function(talent_category) {
        return TalentCategories.getLabelByTalentCategory(talent_category);
    };
    $scope.getEngagementScore = function(engagement) {
                switch(engagement) {
                    case 1:
                        return 5
                        break;
                    case 2:
                        return 4
                        break;
                    case 3:
                        return 3
                        break;
                    case 4:
                        return 2
                        break;
                    case 5:
                        return 1
                        break;
                }
    };
    $scope.orderValue = '';
    $scope.order = function(orderValue){
        $scope.orderValue = orderValue;
        switch(orderValue) {
            case 'name':
                $scope.selfAssessments_sort.sort(orderByName);
                break;
            case 'email':
                $scope.selfAssessments_sort.sort(orderByEmail);
                break;
            case 'talent':
                $scope.selfAssessments_sort.sort(orderByTalent);
                break;
            case 'happy':
                $scope.selfAssessments_sort.sort(orderByHappy);
                break;
            case 'date':
                $scope.selfAssessments_sort.sort(orderByDate);
                break;
            default:
                $scope.selfAssessments_sort.sort(orderByName);
                break;
        }

        var i = 0;
        angular.forEach($scope.selfAssessments_sort, function (selfAssessment) {
            $scope.selfAssessments[selfAssessment.index].index = i;
            i = i + 1;
        })
        buildCSV();
    }
    var orderByName = function(a,b){
        var aValue = a.first_name + a.last_name;
        var bValue = b.first_name + b.last_name;
        return ((aValue < bValue) ? -1 : ((aValue > bValue) ? 1 : 0));
    }
    var orderByEmail = function(a,b){
        var aValue = a.email;
        var bValue = b.email;
        return ((aValue < bValue) ? -1 : ((aValue > bValue) ? 1 : 0));
    }
    var orderByTalent= function(a,b){
        var noDataValue=8;
        var aValue = (a.talent_category===0) ? noDataValue : a.talent_category;
        var bValue = (b.talent_category===0) ? noDataValue : b.talent_category;
        var aHappy = a.engagement;
        var bHappy = b.engagement;
        if (aValue === bValue) {
            return ((aHappy < bHappy) ? -1 : ((aHappy > bHappy) ? 1 : 0));
        } else {
            return aValue - bValue;
        }
    }
    var orderByHappy= function(a,b){
        var aValue = a.engagement;
        var bValue = b.engagement;
        var aTalent = a.talent_category;
        var bTalent = b.talent_category;
        if (aValue === bValue) {
            return ((aTalent < bTalent) ? -1 : ((aTalent > bTalent) ? 1 : 0));
        } else {
            return aValue - bValue;
        }
    }
    var orderByDate= function(a,b){
        var aValue = Date.parse(a.created_at) || 0;
        var bValue = Date.parse(b.created_at) || 0;
        var aName = a.first_name + a.last_name;
        var bName = b.first_name + b.last_name;
        if (aValue === bValue) {
            return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
        } else {
            return bValue - aValue;
        }
    }
    var buildCSV = function() {
        $scope.csv = []
        angular.forEach($scope.selfAssessments_sort, function(selfAssessment) {
            var row = {};
            row.name = selfAssessment.first_name + " " + selfAssessment.last_name;
            row.talent = TalentCategories.getLabelByTalentCategory(selfAssessment.talent_category);
            row.happy = happyToString($scope.getEngagementScore(selfAssessment.engagement));
            row.date = $rootScope.scrubDate(selfAssessment.created_at);
            $scope.csv.push(row);
        });
    }
    var happyToString = function(happy){
        console.log(happy);
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
            case 0:
                return 'No Data';
                break;
        }
    };
}])

.controller('ReportsCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'EmployeeSearch', 'TalentCategories', 'analytics', function($scope, $rootScope, $location, $routeParams, EmployeeSearch, TalentCategories, analytics) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());
    $scope.busy = true;
    EmployeeSearch.query().$promise.then(function(response) {
            $scope.evaluations = response;
            var i = 0;
            angular.forEach($scope.evaluations, function (evaluation) {
                evaluation.index = i;
                i = i + 1;
            })
            $scope.evaluations_sort = angular.copy($scope.evaluations)
            $scope.csv = []
            buildCSV();
            $scope.busy = false;
    });
    var happyToString = function(happy){
        switch (happy) {
            case '1':
                return 'Very Unhappy';
                break;
            case '2':
                return 'Unhappy';
                break;
            case '3':
                return 'Indifferent';
                break;
            case '4':
                return 'Happy';
                break;
            case '5':
                return 'Very Happy';
                break;
            case '0':
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
        angular.forEach($scope.evaluations_sort, function(employee) {
            var row = {};
            row.name = employee.full_name;
            row.talent = TalentCategories.getLabelByTalentCategory(employee.talent_category);
            row.happy = happyToString(employee.happiness);
            row.date = $rootScope.scrubDate(employee.happiness_date);
            $scope.csv.push(row);
        });
    }
    var orderByName = function(a,b){
        var aValue = a.full_name;
        var bValue = b.full_name;
        return ((aValue < bValue) ? -1 : ((aValue > bValue) ? 1 : 0));
    }
    var orderByTalent= function(a,b){
        var noDataValue=8;
        var aValue = (a.talent_category===0) ? noDataValue : a.talent_category;
        var bValue = (b.talent_category===0) ? noDataValue : b.talent_category;
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

.controller('CompanyOverviewCtrl', ['$rootScope', '$scope', '$location', '$routeParams', 'KPIIndicator', 'KPIPerformance', 'analytics', 'TalentReport', 'TemplatePreferences', function($rootScope, $scope, $location, $routeParams, KPIIndicator, KPIPerformance, analytics, TalentReport, TemplatePreferences) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());

    TemplatePreferences.getPreferredTemplate('company-overview')
        .then(
            function(template) {
                $scope.templateUrl = template;
            }
        );

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
    $scope.talentReport = TalentReport.query();
}])

.controller('PeopleReportCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'HappinessReport', 'EngagementReport', 'TalentCategoryReport', 'Engagement', 'analytics', function($scope, $rootScope, $location, $routeParams, HappinessReport, EngagementReport, TalentCategoryReport, Engagement, analytics) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());
    $scope.days_ago = 120;
    EngagementReport.getReportForCompany($scope.days_ago, function(data) {
        $scope.talentCategoryReport = data;
    });

    HappinessReport.getReportForCompany($scope.days_ago, true).$promise.then(function(response) {
        $scope.neglectedEmployees = response;
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

.controller('TasksCtrl', ['$scope', '$rootScope', '$location', '$routeParams', '$window', 'EmployeeToDo', 'ToDo', function($scope, $rootScope, $location, $routeParams, $window, EmployeeToDo, ToDo) {

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

.controller('LeaderOverviewCtrl', ['$scope', '$location', '$routeParams', 'TalentReport', 'TeamLeadEmployees', 'User', 'analytics', 'TemplatePreferences', function($scope, $location, $routeParams, TalentReport, TeamLeadEmployees, User, analytics, TemplatePreferences) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());

    TemplatePreferences.getPreferredTemplate('team-lead-overview')
        .then(
            function(template) {
                $scope.templateUrl = template;
            }
        );

    $scope.talentReport = TalentReport.myTeam();

    User.get(
        function(data) {
            $scope.lead = data.employee;
            $scope.employees = TeamLeadEmployees.getEmployees($scope.lead.id);
        }
    );
}])

.controller('TeamOverviewCtrl', ['$scope', '$location', '$routeParams', 'Team', 'TeamMembers', 'TeamMBTI', 'Customers', 'TeamLeads', 'analytics', 'TalentReport', 'TemplatePreferences', function($scope, $location, $routeParams, Team, TeamMembers, TeamMBTI, Customers, TeamLeads, analytics, TalentReport, TemplatePreferences) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());

    TemplatePreferences.getPreferredTemplate('team-overview')
        .then(
            function(template) {
                $scope.templateUrl = template;
            }
        );

    Customers.get(function (data) {
        $scope.customer = data;
    });
    $scope.teamId = $routeParams.id;
    $scope.employees = TeamLeads.getCurrentEvaluationsForTeamLeads($scope.teamId)

    $scope.talentReport = TalentReport.query({team_id: $routeParams.id});

    Team.get(
        {id: $routeParams.id},
        function(data) {
            $scope.team = data;
            $scope.team_name = data.name;
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

.controller('EmployeeToDoListCtrl', ['$scope', '$routeParams', '$window', 'EmployeeToDo', 'ToDo', 'User', function($scope, $routeParams, $window, EmployeeToDo, ToDo, User) {
    EmployeeToDo.query({ id: $routeParams.id }).$promise.then(function(response) {
            $scope.todos = response;
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

.controller('DailyDigestCtrl', ['$scope', '$modalInstance', 'Employee', function($scope, $modalInstance, Employee) {
    $scope.members = Employee.query({group_name:'Daily Digest Subscribers',show_hidden:true});
    $scope.cancel = function () {
        $modalInstance.dismiss();
    }
}])

.controller('EngagementSurveyCtrl', ['$scope', '$window', '$routeParams', '$location', 'EngagementSurvey', 'analytics', function($scope, $window, $routeParams, $location, EngagementSurvey, analytics){
    analytics.trackPage($scope, $location.absUrl(), $location.url());
    $scope.employee_id = $routeParams.employeeId;
    $scope.survey_id = $routeParams.surveyId;
    $scope.first_load = true;
    $scope.error=false;
    EngagementSurvey.getSurvey($scope.employee_id, $scope.survey_id).$promise.then(function(response) {
            $scope.survey = response;
        }, function(response){$scope.error=true}
    );
    $scope.happy = {assessment:0};
    $scope.happy.comment = {visibility:3,content:''};

    $scope.save_engagement = function() {
        var data = {id: $scope.employee_id, survey_id: $scope.survey_id, _assessment: $scope.happy.assessment, _content:$scope.happy.comment.content};
        EngagementSurvey.save(data, function (response) {
            $scope.survey = response;
            $scope.first_load = false;
        });
    };
}])

.controller('PvpEvaluationTodosCtrl', ['$scope', '$filter', '$routeParams', '$window', '$interval', '$location', 'PvpEvaluation', 'PvpDescriptions', 'EmployeeComments', 'TalentCategories', 'Prospect', 'User', 'analytics', function($scope, $filter, $routeParams, $window, $interval, $location, PvpEvaluation, PvpDescriptions, EmployeeComments, TalentCategories, Prospect, User, analytics) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());
    $scope.pvps = [];
    $scope.currentItemIndex = null;
    $scope.isDirty = false;
    $scope.originalPotential = 0;
    $scope.originalPerformance = 0;
    $scope.show = false;
    $scope.hide = false;
    $scope.last_index = 0;
    $scope.pvp_descriptions = null;
    $scope.pvp_description = null;
    $scope.currentPvP = null;
    $scope.isAnimating = false;
    $scope.selfAssessment = null;
    setToIsClean = function(pvp) {
         if (!pvp.comment) {
            pvp.comment = {originalContent: "", content: "", id: -1};
        } else {
            pvp.comment.originalContent = pvp.comment.content;
        }
        pvp.originalPotential = pvp.potential;
        pvp.originalPerformance = pvp.performance;
        return pvp;
    };

    PvpEvaluation.getToDos().$promise.then(function(response) {
        $scope.currentItemIndex = 0;
        $scope.pvps = response.map(function(pvp) {
            return setToIsClean(pvp);
        });

        $scope.last_index = $scope.pvps.length -1;
    });

    PvpDescriptions.query().$promise.then(function(response) {
            $scope.pvp_descriptions = response;
        }
    );
    $scope.saving = false;
    $scope.save = function() {
        if (!$scope.saving) {
            $scope.saving = true
            _pvp = $scope.currentPvP;
            if ($scope.currentPvP.comment.content) {
                var data = {id: _pvp.id, _potential: _pvp.potential, _performance: _pvp.performance, _content: _pvp.comment.content};
                PvpEvaluation.update(data, function () {
                    $scope.saving = false;
                });
            } else {
                data = {id: _pvp.id, _potential: _pvp.potential, _performance: _pvp.performance};
                PvpEvaluation.update(data, function () {
                    $scope.saving = false;
                });
            }
            $scope.currentPvP = setToIsClean($scope.currentPvP);
        }
    };

    $scope.isDirty = function() {
        return $scope.currentPvP.originalPotential != $scope.currentPvP.potential || $scope.currentPvP.originalPerformance != $scope.currentPvP.performance || $scope.currentPvP.comment.originalContent != $scope.currentPvP.comment.content;
    };

    $interval(function() {
        if ($scope.isDirty()){
            $scope.save();
        }
    }, 2000);

    $scope.forward = function() {
        $scope.isAnimating = true;
        if($scope.isDirty()) {
            $scope.save();
        }
        $scope.click_prev=false;
        $scope.click_next=true;
        if(($scope.currentItemIndex+1) < $scope.pvps.length) {
            $scope.currentItemIndex++;
        } else {
            $scope.currentItemIndex=0;
        }
    };
    $scope.$watch('currentItemIndex', function(newVal, oldVal){
        if (newVal != oldVal) {
            $scope.currentPvP = $scope.pvps[$scope.currentItemIndex];
            $scope.selfAssessment = Prospect.get({email: $scope.currentPvP.employee.email}, function(response) {
                switch($scope.selfAssessment.engagement) {
                    case 1:
                        $scope.selfAssessment.engagement = 5
                        break;
                    case 2:
                        $scope.selfAssessment.engagement = 4
                        break;
                    case 4:
                        $scope.selfAssessment.engagement = 2
                        break;
                    case 5:
                        $scope.selfAssessment.engagement = 1
                        break;
                }
                $scope.selfAssessment.talent_category_label = TalentCategories.getLabelByTalentCategory($scope.selfAssessment.talent_category);
            });
        }
    },true);
    $scope.$watch('currentPvP.talent_category', function(newVal, oldVal){
        if (newVal != oldVal) {
            $scope.currentPvP.label = TalentCategories.getLabelByTalentCategory(newVal);
        }
    },true);
    $scope.backward = function() {
        $scope.isAnimating = true;
        if($scope.isDirty()) {
            $scope.save();
        }
        $scope.click_next=false;
        $scope.click_prev=true;
        if($scope.currentItemIndex > 0) {
            $scope.currentItemIndex--;
        } else {
            $scope.currentItemIndex=$scope.pvps.length-1;
        }
    };
    $scope.addComment = function() {
        var newComment = {};
        newComment.id = -1;
        newComment.content = $scope.pvp.comment;
        newComment.modified_date = new Date().toJSON();
        newComment.owner = User.get();
        newComment.newSubCommentText="";
        newComment.subcomments=[];
        newComment.visibility=2; // People team

        var data = {id: newComment.id, _model_name: "employee", _object_id: 0, _content: newComment.content, _visibility: newComment.visibility};

        data.id = $scope.pvp.employee.id;
        EmployeeComments.save(data, function(response) {
            newComment.id = response.id;
            $scope.newCommentText = "";
        });
    }

}])

.controller('PvpTodoListCtrl', ['$scope', '$routeParams', '$location', '$modal', '$filter', 'PvpEvaluation', 'Team', 'User', 'analytics', function($scope, $routeParams, $location, $modal, $filter, PvpEvaluation, Team, User, analytics) {
    analytics.trackPage($scope, $location.absUrl(), $location.url());
    $scope.filters = {
        team_id: $routeParams.team_id
    };
    $scope.pvps = [];
    $scope.team_id = $scope.currentTeam ? $scope.currentTeam.id : 0;

    $scope.setTeamFilter = function(teamId) {
        $location.search('team_id', teamId);
    };
    Team.query({}, function(results) {
        $scope.teams = results;
        if($scope.filters.team_id) {
            var filteredTeams = $filter('filter')($scope.teams, {id: $scope.filters.team_id});
            $scope.currentTeam = filteredTeams.length ? filteredTeams[0] : null;
        }
    });
    $scope.editPvP = function (pvps, index) {
        var modalInstance = $modal.open({
            animation: true,
            backdrop : 'static',
            templateUrl: '/static/angular/partials/_modals/edit-pvp.html',
            controller: 'AddEditPvPCtrl',
            resolve: {
                pvp: function () {
                    return pvps[index]
                }
            }
        });
        modalInstance.result.then(
            function (pvp) {
                $scope.pvps[index].performance = pvp.performance;
                $scope.pvps[index].potential = pvp.potential;
                $scope.pvps[index].talent_category = pvp.talent_category;
                $scope.pvps[index].comment.content = pvp.comment.content;
            }
        );
    };
    $scope.search = function() {
        $scope.pvps = PvpEvaluation.getToDos($scope.filters.team_id);
    };
    $scope.search();
}]);
