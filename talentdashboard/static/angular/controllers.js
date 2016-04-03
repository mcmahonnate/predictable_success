angular.module('tdb.controllers', [])

    .controller('BaseAppCtrl', ['$rootScope', '$location', '$document', 'User', 'Customers', '$cookies', '$cookieStore', function ($rootScope, $location, $document, User, Customers, $cookies, $cookieStore) {
        $rootScope.$on("$routeChangeError", function () {
            window.location = '/account/login?next=' + $location.path();
        });

        Customers.get(function (data) {
            $rootScope.customer = data;
        });

        $document.on('click', function (event) {
            element = angular.element(event.target);
            if ((!element.hasClass('nav-item') && !element.hasClass('nav-input')) && $rootScope.activeTab && !element.hasClass('nav-item-icon')) {
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


        //Mobile navigation
        $rootScope.showmenu=false;
        $rootScope.toggleMenu = function(){
            $rootScope.showmenu=($rootScope.showmenu) ? false : true;
        }


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

        // Privacy Mode
        var privacyMode = function () {

            // check if privacy cookie exists
            var privacy = $cookieStore.get('privacy');

            // get all images
            var images = document.getElementsByClassName('headshot-image');
            for(var i = 0; i < images.length; i++) {
                var img = images[i];

                if (privacy){
                    $cookieStore.remove('privacy');
                    document.getElementsByClassName("privacy-mode")[0].className = 'privacy-mode';
                    img.src = img.getAttribute("data-original-src");
                    console.log('Turning off cat mode');

                } else {
                    $cookieStore.put('privacy', true);
                    img.setAttribute('data-original-src', img.src);
                    document.getElementsByClassName("privacy-mode")[0].className = 'privacy-mode privacy-mode-active';
                    img.src = 'http://theoldreader.com/kittens/200/200/?foo=' + [i];
                    console.log('Setting cat mode');  
                } 
            }

            var employeeName = document.getElementsByClassName("sensitive-text");
            for(var i = 0; i < employeeName.length; i++) {   
                var name = employeeName[i];

                if (privacy){ 
                    name.className = 'sensitive-text';
                } else {
                    name.className = 'sensitive-text sensitive-text-active';
                }
            }               
        }
        $rootScope.setPrivacyMode = function () {
            privacyMode();
        };

    }])

    .controller('NavigationCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$modal', 'Employee', 'EmployeeSearch', 'Customers', 'Team', function ($scope, $rootScope, $routeParams, $location, $modal, Employee, EmployeeSearch, Customers, Team) {
        EmployeeSearch.query(function(data) {
                $scope.employees = data;
        });
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
        $scope.$on('$routeChangeSuccess', function() {
            if ($routeParams.id) {
                Employee.get({id: $routeParams.id}, function (data) {
                    $scope.activeEmployee = data;
                });
            } else {
                $scope.activeEmployee = null;
            }
        });

        $scope.newLeadership = {
            id: null,
            leader: {full_name: ''}
        };

        $scope.navQuery = '';
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
                templateUrl: '/static/angular/org/partials/modals/add-edit-employee.html',
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
        $scope.checkinTab = 'checkin';
        $scope.employeeTab = 'employee';
        $scope.dashboardsTab = 'dashboards';
        $scope.screenerTab = 'screener';
        $scope.reportsTab = 'reports';
        $scope.settingsTab = 'settings';
        $scope.searchTab = 'search';
        $scope.feedbackTab = 'feedback';
        $scope.projectsTab = 'projects';
        $scope.devzonesTab = 'devzones';

        $scope.setActiveTab = function (tab) {
            $('.nav-item').tooltip('hide');

            if ($rootScope.activeTab == tab) {
                $('[data-toggle="tooltip"]').tooltip('enable')
                $rootScope.activeTab = null;
            } else {
                $('[data-toggle="tooltip"]').tooltip('disable')
                $rootScope.activeTab = tab;
            }
        };

        $scope.gotoFeedback = function() {
            $location.path('/feedback');
        }

        $scope.gotoCheckIns = function() {
            $location.path('/checkins');
        }

        $scope.gotoProjects = function() {
            $location.path('/projects');
        }

        $scope.gotoID = function() {
            $location.path('/id');
        }
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

    .controller('ReportsCtrl', ['$scope', '$rootScope',  '$filter', '$location', '$routeParams', 'EmployeeSearch', 'TalentCategories', 'analytics', function ($scope, $rootScope, $filter, $location, $routeParams, EmployeeSearch, TalentCategories, analytics) {
        analytics.trackPage($scope, $location.absUrl(), $location.url());
        $scope.busy = true;

        EmployeeSearch.query().$promise.then(function (response) {
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

        $scope.predicate = 'full_name';
        $scope.reverse = false;
        $scope.order = function(predicate) {
            $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
            $scope.predicate = predicate;
        };

        var happyToString = function (happy) {

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

        $scope.happiness_verbose = function (happiness) {
            return happyToString(happiness);
        };

        var buildCSV = function () {
            $scope.csv = []
            angular.forEach($scope.evaluations_sort, function (employee) {
                var row = {};
                row.id = employee.pk;
                row.name = employee.full_name;
                row.team = employee.team_name;
                row.email = employee.email;
                row.talent = TalentCategories.getLabelByTalentCategory(employee.talent_category);
                row.talent_date = $rootScope.scrubDate(employee.talent_category_date);
                row.happy = happyToString(employee.happiness);
                row.happy_date = $rootScope.scrubDate(employee.happiness_date);
                row.last_checkin = $rootScope.scrubDate(employee.last_checkin_about);
                row.last_checkin_type = employee.last_checkin_type;
                row.last_comment = $rootScope.scrubDate(employee.last_comment_about);
                row.coach = employee.coach_full_name;
                row.hire_date = $rootScope.scrubDate(employee.hire_date);
                row.last_login = $rootScope.scrubDate(employee.last_login);
                $scope.csv.push(row);
            });
        }
    }])

    .controller('TimespanReportCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'CommentReport', 'TaskReport', 'CheckInReport', 'analytics', function ($scope, $rootScope, $location, $routeParams, CommentReport, TaskReport, CheckInReport, analytics) {
        analytics.trackPage($scope, $location.absUrl(), $location.url());
        $scope.submitted = false;
        $scope.responseData = {};
        $scope.total = {};
        $scope.csv = [];

        $scope.submit = function() {
            $scope.submitted = true;
            CommentReport.get({start_date: $scope.startDate, end_date: $scope.endDate}, function (data) {
                $scope.responseData.comments = data.by_user;
                $scope.total.comments = data.total;
            });

            TaskReport.get({start_date: $scope.startDate, end_date: $scope.endDate}, function (data) {
                $scope.responseData.tasks = data.by_user;
                $scope.total.tasks = data.total;
            });

            CheckInReport.get({start_date: $scope.startDate, end_date: $scope.endDate}, function (data) {
                $scope.responseData.checkins = data.by_user;
                $scope.total.checkins = data.total;
            });
        }

        // aggregate by user
        $scope.buildCSV = function () {
            $scope.csv = [];
            $scope.users = {};

            var commentData = $scope.responseData.comments;
            for (user in commentData) {
                if (!(user in $scope.users))
                    $scope.users[user] = {};
                $scope.users[user].comments = commentData[user];
            }
            var taskData = $scope.responseData.tasks;
            for (user in taskData) {
                if (!(user in $scope.users))
                    $scope.users[user] = {};
                $scope.users[user].tasks = taskData[user];
            }
            var checkinData = $scope.responseData.checkins;
            for (user in checkinData) {
                if (!(user in $scope.users))
                    $scope.users[user] = {};
                $scope.users[user].checkins = checkinData[user];
            }
            for (user in $scope.users) {
                var row = {};
                row.user = user;
                row.comments = ($scope.users[user].comments) ? $scope.users[user].comments : 0;
                row.tasks = ($scope.users[user].tasks) ? $scope.users[user].tasks : 0;
                row.checkins = ($scope.users[user].checkins) ? $scope.users[user].checkins : 0;
                $scope.csv.push(row);
            }

            var lastrow = {};
            lastrow.user = "Total";
            lastrow.comments = $scope.total.comments;
            lastrow.tasks = $scope.total.tasks;
            lastrow.checkins = $scope.total.checkins;
            $scope.csv.push(lastrow);

            return $scope.csv;
        }
    }])
;