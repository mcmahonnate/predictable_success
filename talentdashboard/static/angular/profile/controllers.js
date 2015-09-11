angular.module('tdb.profile.controllers', [])

    .controller('ProfileCtrl', ['$rootScope', '$scope', '$location', '$routeParams', '$window', '$modal', 'User', 'Employee', 'Profile','Team', 'Engagement', 'SendEngagementSurvey', 'EmployeeLeader', 'Attribute', '$http', 'Customers', 'analytics', 'EmployeeMBTI', 'Notification', function ($rootScope, $scope, $location, $routeParams, $window, $modal, User, Employee, Profile, Team, Engagement, SendEngagementSurvey, EmployeeLeader, Attribute, $http, Customers, analytics, EmployeeMBTI, Notification) {
        analytics.trackPage($scope, $location.absUrl(), $location.url());
        Customers.get(function (data) {
            $scope.customer = data;
        });
        $rootScope.$watch('currentUser', function (newVal, oldVal) {
            if (newVal != oldVal) {
                $scope.currentUser = $rootScope.currentUser;
            }
        }, true);

        $scope.dynamicTooltipText = "LOGOUT";

        $scope.modalHappyShown = false;
        $scope.toggleHappyModal = function () {
            $scope.modalHappyShown = !$scope.modalHappyShown;
        };
        $scope.modalSurveyShown = false;
        $scope.toggleSurveyModal = function () {
            $scope.modalSurveyShown = !$scope.modalSurveyShown;
        };
        $scope.leadership = [];
        Team.query(function (data) {
            $scope.teams = data;
        });
        if (!$scope.employees && $rootScope.currentUser && $rootScope.currentUser.can_view_company_dashboard) {
            $scope.employees = Employee.query();
        }
        Profile.get(function(data){
            $scope.employee = data;
            $scope.employee.hire_date = $rootScope.parseDate($scope.employee.hire_date);
            if ($scope.employee.current_leader && $scope.employee.current_leader.id == $rootScope.currentUser.employee.id) {
                $scope.showCompensation = true;
            }
            Engagement.query(
                {id: $scope.employee.id},
                function (data) {
                    $scope.happys = data;
                }
            );
            console.log($scope.employee.hire_date);
        });


        $scope.happyIndex = 0;

        $scope.isSurveySending = false;
        $scope.sendSurvey = function () {
            $scope.isSurveySending = true;
            var data = {id: $routeParams.id, _sent_from_id: $rootScope.currentUser.employee.id, _override: true};

            SendEngagementSurvey.addNew(data, function () {
                $scope.isSurveySending = false;
                Notification.success("Your survey was sent.");
            }, function () {
                $scope.isSurveySending = false;
                Notification.error("There was an error sending your survey.");
            });
        };

        $scope.clicked_happy;

        EmployeeMBTI.get(
            {id: $rootScope.currentUser.employee.id},
            function (data) {
                $scope.mbti = data;
                if ($scope.mbti.description) {
                    $scope.has_mbti = true;
                }
            }
        );

        $scope.selected = 0;
        $scope.set_choice = function (value) {
            $scope.selected = value;
        };
        $scope.is_selected = function (value) {
            return $scope.selected == value;
        };
        Attribute.getAttributesForEmployee($rootScope.currentUser.employee.id).$promise.then(function(response) {
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
    }]);