angular.module('tdb.engagement.controllers', [])
    
    .controller('EngagementSurveyCtrl', ['$scope', '$window', '$routeParams', '$location', '$modal', 'EngagementSurvey', 'analytics', function ($scope, $window, $routeParams, $location, $modal, EngagementSurvey, analytics) {
        analytics.trackPage($scope, $location.absUrl(), $location.url());
        $scope.employee_id = $routeParams.employeeId;
        $scope.survey_id = $routeParams.surveyId;
        $scope.first_load = true;
        $scope.error = false;
        EngagementSurvey.getSurvey($scope.employee_id, $scope.survey_id).$promise.then(function (response) {
                $scope.survey = response;
                if ($scope.survey.active && !$scope.survey.complete){
                    showWhoCanSeeThis($scope.employee_id, true);
                }
            }, function (response) {
                $scope.error = true
            }
        );
        $scope.happy = {assessment: 0};
        $scope.happy.comment = {visibility: 3, content: ''};

        showWhoCanSeeThis = function (employee_id, employee_view) {
            is_signed_id = employee_id.indexOf(":");
            if (is_signed_id > -1)
                employee_id = employee_id.substring(0, is_signed_id);
            $modal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: '/static/angular/partials/_modals/who-can-see-this.html',
                controller: 'SupportTeamCtrl',
                resolve: {
                    employee_view: function () {
                        return employee_view
                    },
                    employee_id: function () {
                        return employee_id
                    }
                }
            });
        }
        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
        $scope.save_engagement = function () {
            var data = {id: $scope.employee_id, survey_id: $scope.survey_id, _assessment: $scope.happy.assessment, _content: $scope.happy.comment.content};
            EngagementSurvey.save(data, function (response) {
                $scope.survey = response;
                $scope.first_load = false;
            });
        };
    }])

    .controller('SupportTeamCtrl', ['$scope', '$modalInstance', 'Employee', 'EmployeeSearch', 'employee_id', 'employee_view', function ($scope, $modalInstance, Employee, EmployeeSearch, employee_id, employee_view) {
        $scope.members = [];
        $scope.employee = null;
        var leaders_loaded = false;
        var all_access_employees_loaded = false;
        var employee_loaded = false;
        var leaders = [];
        var all_access_employees = [];
        Employee.get({id: employee_id}, function(data){
            $scope.employee = data;
            employee_loaded = true;
            buildList();
        });
        EmployeeSearch.getLeaders({id: employee_id}, function(data) {
            leaders = data;
            leaders_loaded = true;
            buildList();
        });
        Employee.getAllAccess(null, function(data) {
            all_access_employees = data;
            all_access_employees_loaded = true;
            buildList();
        })

        function buildList() {
            if (leaders_loaded && all_access_employees_loaded && employee_loaded) {
                Array.prototype.push.apply($scope.members, leaders)
                Array.prototype.push.apply($scope.members, all_access_employees)
                if ($scope.employee.coach) {
                    $scope.members.push($scope.employee.coach);
                }
            }
        }

        $scope.employee_view = employee_view;
        $scope.cancel = function () {
            $modalInstance.dismiss();
        }
    }])
;