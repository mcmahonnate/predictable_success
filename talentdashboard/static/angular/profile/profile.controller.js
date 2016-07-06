angular
    .module('profile')
    .controller('ProfileController', ProfileController);

function ProfileController(CoachProfileService, Employee, EmployeeSearch, Profile, SalaryReport, TalentReport, ThirdParties, analytics, $location, $modal, $rootScope, $routeParams, $scope) {
    /* Since this page can be the root for some users let's make sure we capture the correct page */
    var location_url = $location.url().indexOf('/profile') < 0 ? '/profile' : $location.url();
    analytics.trackPage($scope, $location.absUrl(), location_url);
    var vm = this;
    vm.slideInterval = -1;
    vm.employee = null;
    vm.moreInfoCollapse = true;
    vm.teamMembers = [];
    vm.teamMemberClusters = [];
    vm.coachees = [];
    vm.coacheeClusters = [];
    vm.coachingApproach = null;
    vm.editCoachProfile = editCoachProfile;
    vm.filterCommentsByType = filterCommentsByType;
    vm.filterCommentsByView = filterCommentsByView;
    vm.filterCommentsByThirdParty = filterCommentsByThirdParty;
    vm.getTeamMembers = getTeamMembers;
    vm.requestFeedback = requestFeedback;
    vm.requestCheckIn = requestCheckIn;
    vm.filter = {type: null, view: 'employee', third_party: null, employee: null, self: true, exclude_third_party_events: true};
    vm.third_parties = [];

    activate();

    function activate() {
        getEmployee();
        getThirdParties();
    };

    function getEmployee() {
        var id;
        if ($routeParams.id) {
            vm.filter.self = false;
            Employee.get(
                {id: $routeParams.id},
                function (data) {
                    vm.employee = data;
                    vm.employee.hire_date = $rootScope.parseDate(vm.employee.hire_date);
                    vm.filter.employee = vm.employee;
                }
            );
        } else {
            vm.filter.self = true;
            Profile.get(
                null,
                function (data) {
                    vm.employee = data;
                    vm.employee.hire_date = $rootScope.parseDate(vm.employee.hire_date);
                    vm.filter.employee = vm.employee;
                }
            );
        }

    }

    function getThirdParties() {
        ThirdParties.query(
            null,
            function (data) {
                vm.third_parties = data;
            }
        )
    }

    function getTeamSummary() {
        if (vm.filter.self) {
            EmployeeSearch.myTeam({children:true}, function(data) {
                    vm.teamMembers = data;
                    vm.teamMemberClusters = createEmployeeClusters(data);
                });
            $scope.talentReport = TalentReport.myTeam();
            $scope.salaryReport = SalaryReport.myTeam();
        } else {
            EmployeeSearch.leadEmployees({id: $routeParams.id, children:true}, function(data) {
                    vm.teamMembers = data;
                    vm.teamMemberClusters = createEmployeeClusters(data);
                });
            $scope.talentReport = TalentReport.leadEmployees({id: $routeParams.id});
            $scope.salaryReport = SalaryReport.leadEmployees({id: $routeParams.id});
        }
    }

    function createEmployeeClusters(employees) {
        var employeeClusters = [];
        var i,j,temparray,chunk = 4;
        for (i=0,j=employees.length; i<j; i+=chunk) {
            temparray = employees.slice(i,i+chunk);
            employeeClusters.push(temparray)
         }
        return employeeClusters;
    }

    function getTeamMembers(employee){
        employee.teamMembers = EmployeeSearch.leadEmployees({id: employee.pk, children:true});
    }

    function getCoachSummary() {
        if (vm.filter.self) {
            EmployeeSearch.myCoachees(null, function(data) {
                    vm.coachees = data;
                    vm.coacheeClusters = createEmployeeClusters(data);
                });
            TalentReport.myCoachees(null, function(data) {
                $scope.talentReport = data;
            });
            CoachProfileService.get($rootScope.currentUser.employee.id)
                .then(function(data){
                    vm.coachingApproach = data.approach;
                });
        }
        else {
            EmployeeSearch.coachEmployees({id: $routeParams.id}, function(data) {
                    vm.coachees = data;
                    vm.coacheeClusters = createEmployeeClusters(data);
                });
            TalentReport.coachEmployees({id: $routeParams.id}, function(data) {
                $scope.talentReport = data;
            });
            CoachProfileService.get($routeParams.id)
                .then(function(data){
                    vm.coachingApproach = data.approach;
                });
        }

    }

    function editCoachProfile() {
        var modalInstance = $modal.open({
            animation: true,
            backdrop: 'static',
            templateUrl: '/static/angular/profile/partials/_modals/add-edit-coach-profile.html',
            controller: 'CoachProfileController as coachProfile',
            resolve: {
                employeeId: function () {
                    return vm.employee.id;
                },
                showPrivate: function () {
                    return false
                }
            }
        });
        modalInstance.result.then(
            function (data) {
                vm.coachingApproach = data.approach;
            }
        );
    };

    function filterCommentsByType(type) {
        vm.filter.type = type;
        vm.filter.third_party = null;
        vm.filter.exclude_third_party_events = true;
        filterComments();
    }

    function filterCommentsByView(view) {
        switch(view) {
            case 'coach':
                getCoachSummary();
                break;
            case 'leader':
                getTeamSummary();
                break;
        }
        vm.filter.view = view;
        filterComments();
    }

    function filterCommentsByThirdParty(third_party) {
        vm.filter.type = 'thirdpartyevent';
        vm.filter.exclude_third_party_events = false;
        vm.filter.third_party = third_party;
        filterComments();

    }

    function filterComments() {
        vm.moreInfoCollapse = true;
        $scope.$broadcast('filterComments', vm.filter);
    }

    function requestCheckIn() {
        var modalInstance = $modal.open({
            animation: true,
            windowClass: 'xx-dialog fade zoom',
            backdrop: 'static',
            templateUrl: '/static/angular/checkins/partials/_modals/request-checkin.html',
            controller: 'RequestCheckInController as request',
            resolve: {

            }
        });
        modalInstance.result.then(
            function (request) {
                vm.myRequests.push(request);
            }
        );
    }

    function requestFeedback() {
        var modalInstance = $modal.open({
            animation: true,
            windowClass: 'xx-dialog fade zoom',
            backdrop: 'static',
            templateUrl: '/static/angular/feedback/partials/_modals/request-feedback.html',
            controller: 'RequestFeedbackController as request',
            resolve: {

            }
        });
        modalInstance.result.then(
            function (sentFeedbackRequests) {
                getMyRecentlySentRequests();
            }
        );
    }
}