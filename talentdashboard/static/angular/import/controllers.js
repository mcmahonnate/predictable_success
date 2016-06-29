angular.module('tdb.import.controllers', [])

    .controller('UploadDataCtrl', ['$scope', '$rootScope', '$q', '$modal', 'ImportData', 'Employee', 'Leadership', 'Notification','EmployeeNames', function($scope, $rootScope, $q, $modal, ImportData, Employee, Leadership, Notification, EmployeeNames) {
        $scope.data;
        $scope.hasColumnHeaders=true;
        $scope.columns = [];
        $scope.importing = false;
        $scope.foundErrors = false;

        $scope.import = function() {
            var parsedData = $scope.getData();
            var responseData = [];
            var employees = [];
            var teams = [];
            var team_ids = {}; // team name : id

            $scope.importing = true;

            // get teams
            parsedData.forEach(function (emp) {
                emp["display"] = true;
                if ("team" in emp && emp.team && emp.team.length) {
                    teams.push(emp.team);
                }
            });

            // post all teams
            ImportData.addNewTeams({'teams': teams}).$promise.then(function (data) {
                data.forEach(function (t) {
                    team_ids[t.name] = t.id;
                });

                addEmployees(0);
            });

            // post employees
            function addEmployees(index) {
                if (index == parsedData.length) {
                    addLeaderships(0);
                    return;
                }
                addEmp(parsedData[index]).then(function (data){
                    console.log(data);
                    employees.push(data);
                    addEmployees(index + 1);
                }, function (err) {
                    // show modal if error
                    console.log(err.data);
                    openEditModal(parsedData[index], parsedData[index].team_leader, employees, teams, index, false);
                });
            }

            // single employee
            function addEmp(data) {
                // parseint checks if team id already assigned
                if ("team" in data && (data.team !== undefined) && (data.team !== null) && (parseInt(data.team) !== data.team) && data.team.trim().length && (data.team in team_ids))
                    data["team"] = team_ids[data.team];
                else
                    data["team"] = null;
                var employee = new Employee(data);
                return employee.$save();
            }

            // update leaderships after employees
            function addLeaderships(index) {
                if (index == parsedData.length) {
                    if ($scope.importData.length == 0) {
                        Notification.success("Your data imported successfully.");
                        $scope.importing = false;
                    }
                    return;
                }
                addLead(parsedData[index], employees[index], index);
            }

            // single leadership
            function addLead(data, emp, index) {
                if (!('team_leader' in data) || (data.team_leader === undefined) || (data.team_leader === null) || (!data.team_leader.trim().length)) {
                    $scope.importData.splice(0, 1);
                    addLeaderships(index + 1);
                    return;
                }
                var leaderName = data.team_leader;
                Employee.get({full_name: leaderName}, function (leader) {
                    if (leader === {}) {
                        console.log("no leader");
                    }
                    else {
                        var edited = angular.copy(emp);
                        edited.team_leader = leader;
                        if (emp.team)
                            edited.team = emp.team.id;
                        Employee.update(edited);
                    }

                    // remove from table when complete
                    $scope.importData.splice(0, 1);

                    addLeaderships(index + 1);
                }, function (err) {
                    // show modal if error
                    console.log(err.data);
                    openEditModal(emp, leaderName, employees, teams, index, true);
                });
            }

            // correction modal
            function openEditModal(employee, leadership, employees, teams, index, leaderUpload) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: '/static/angular/org/partials/_modals/add-edit-employee.html',
                    controller: 'importModalCtrl',
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
                        },
                        uploading: function() {
                            return true
                        },
                        leaderUpload: function() {
                            return leaderUpload
                        }
                    }
                });

                modalInstance.result.then(function (data) {
                    // corrections submitted, update and try again
                    parsedData[index].first_name = data.first_name;
                    parsedData[index].last_name = data.last_name;
                    parsedData[index].email = data.email;

                    if (leaderUpload) {
                        parsedData[index].team_leader = data.team_leader;
                        addLeaderships(index);
                    }
                    else
                        addEmployees(index);
                }, function (err) {
                    // cancel
                });
            }
        }

    }])

    .controller('importModalCtrl', ['$scope', '$rootScope', '$routeParams', '$modalInstance', '$location', 'employee', 'leadership', 'employees', 'teams', 'uploading', 'leaderUpload', 'Employee', 'EmployeeLeader', 'fileReader', 'PhotoUpload', function($scope, $rootScope, $routeParams, $modalInstance, $location, employee, leadership, employees, teams, uploading, leaderUpload, Employee, EmployeeLeader, fileReader, PhotoUpload) {
        $scope.employee = angular.copy(employee);
        $scope.leadership = angular.copy(leadership);
        $scope.teams = teams;
        $scope.uploading = uploading;
        $scope.leaderUpload = leaderUpload;
        $scope.employees = employees;
        $scope.preview=$scope.employee.avatar;
        $scope.cancel = function () {
            $modalInstance.dismiss();
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
            $modalInstance.close(data);
        };

        var getData = function() {
            var data = {id: $scope.employee.id};
            data.first_name = $scope.employee.first_name;
            data.last_name = $scope.employee.last_name;
            data.email = $scope.employee.email;
            data.hire_date = ($scope.employee.hire_date) ? $rootScope.scrubDate($scope.employee.hire_date, false) : null;
            data.departure_date = ($scope.employee.departure_date) ? $rootScope.scrubDate($scope.employee.departure_date, false) : null;
            data.team_leader = ($scope.employee.current_leader && $scope.employee.current_leader.full_name) ? $scope.employee.current_leader.full_name : null;
            return data;
        };
    }])
;