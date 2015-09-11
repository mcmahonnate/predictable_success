angular.module('tdb.controllers', [])

    .controller('BaseAppCtrl', ['$rootScope', '$location', '$document', 'User', 'Customers', function ($rootScope, $location, $document, User, Customers) {
        $rootScope.$on("$routeChangeError", function () {
            window.location = '/account/login?next=' + $location.path();
        });

        Customers.get(function (data) {
            $rootScope.customer = data;
        });

        $document.on('click', function (event) {
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
                return new Date(parts[0], parts[1] - 1, parts[2]); // months are 0-based
            }
            return input;
        };
        $rootScope.scrubDate = function (input, display) {
            var date = new Date(input);
            if (isNaN(date)) {
                return null
            }
            ;
            var day = date.getDate();
            var month = date.getMonth() + 1; //Months are zero based
            var year = date.getFullYear();
            if (display) {
                scrubbed_Date = month + "/" + day + "/" + year;
            } else {
                scrubbed_Date = year + "-" + month + "-" + day;
            }
            return scrubbed_Date;
        };

        $rootScope.now = function () {
            return new Date();
        };

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

        $rootScope.removeItemFromList = function(list, item) {
            var index = list.indexOf(item);
            list.splice(index, 1);
        };

        $rootScope.replaceItemInList = function(list, currentItem, newItem) {
            var index = list.indexOf(currentItem);
            list.splice(index, 1);
            list.splice(index, 0, newItem);
        };
    }])

    .controller('NavigationCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$modal', 'EmployeeSearch', 'Customers', 'Team', function ($scope, $rootScope, $routeParams, $location, $modal, EmployeeSearch, Customers, Team) {
        $scope.employees = EmployeeSearch.query();
        $scope.teams = Team.query();
        $scope.modalEmployeeShown = false;
        $scope.newEmployee = {
            id: 0, full_name: '',
            first_name: '',
            last_name: '',
            email: '',
            team: {id: null, name: ''},
            hire_date: '',
            departure_date: '',
            avatar: 'https://hippoculture.s3.amazonaws.com/media/avatars/geneRick.jpg'
        };

        $scope.newLeadership = {
            id: null,
            leader: {full_name: ''}
        };

        $scope.startsWith = function (expected, actual) {
            if (expected && actual) {
                return expected.toLowerCase().indexOf(actual.toLowerCase()) == 0;
            }
            return true;
        }

        //show add employee modal
        $scope.toggleEmployeeModal = function () {
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

        //set active tab
        $rootScope.activeTab = null;

        //tabs
        $scope.homeTab = 'home';
        $scope.myTab = 'my';
        $scope.dashboardsTab = 'dashboards';
        $scope.screenerTab = 'screener';
        $scope.reportsTab = 'reports';
        $scope.settingsTab = 'settings';
        $scope.searchTab = 'search';

        $scope.setActiveTab = function (tab) {
            $('.nav-item').tooltip('hide');

            if ($rootScope.activeTab == tab) {
                $rootScope.activeTab = null;
            } else {
                $rootScope.activeTab = tab;
            }
        };
    }])

    .controller('CompanyOverviewCtrl', ['$rootScope', '$scope', '$location', '$routeParams', 'KPIIndicator', 'KPIPerformance', 'analytics', 'SalaryReport', 'TalentReport', 'TemplatePreferences', function ($rootScope, $scope, $location, $routeParams, KPIIndicator, KPIPerformance, analytics, SalaryReport, TalentReport, TemplatePreferences) {
        analytics.trackPage($scope, $location.absUrl(), $location.url());

        TemplatePreferences.getPreferredTemplate('company-overview')
            .then(
            function (template) {
                $scope.templateUrl = template;
            }
        );

        KPIIndicator.get(function (data) {
                $scope.indicator = data;
            }
        );
        KPIPerformance.get(function (data) {
                $scope.performance = data;
                $scope.performance.value = $rootScope.lazyround($scope.performance.value);
                $scope.performance.date = $rootScope.scrubDate($scope.performance.date, true);
            }
        );
        $scope.talentReport = TalentReport.query();
        $scope.salaryReport = SalaryReport.query();
    }])
;