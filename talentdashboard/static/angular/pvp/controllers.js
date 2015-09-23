angular.module('tdb.pvp.controllers', [])

    .controller('EmployeePvpEvaluationsCtrl', ['$scope', '$routeParams', 'PvpEvaluation', '$modal', function($scope, $routeParams, PvpEvaluation, $modal) {
        $scope.pvpIndex = 0;
        $scope.pvps = null;
        PvpEvaluation.getAllEvaluationsForEmployee($routeParams.id).$promise.then(function(response) {
            $scope.pvps = response;
        });

        $scope.selectPvP = function(index) {

            console.log(index);
            $scope.pvpIndex = index;
            //updateSlidePosition();
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
        setToIsClean = function (pvp) {
            if (!pvp.comment) {
                pvp.comment = {originalContent: "", content: "", id: -1};
            } else {
                pvp.comment.originalContent = pvp.comment.content;
            }
            pvp.originalPotential = pvp.potential;
            pvp.originalPerformance = pvp.performance;
            return pvp;
        };

        PvpEvaluation.getToDos().$promise.then(function (response) {
            $scope.currentItemIndex = 0;
            $scope.pvps = response.map(function (pvp) {
                return setToIsClean(pvp);
            });

            $scope.last_index = $scope.pvps.length - 1;
        });

        PvpDescriptions.query().$promise.then(function (response) {
                $scope.pvp_descriptions = response;
            }
        );
        $scope.saving = false;
        $scope.save = function () {
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

        $scope.isDirty = function () {
            return $scope.currentPvP.originalPotential != $scope.currentPvP.potential || $scope.currentPvP.originalPerformance != $scope.currentPvP.performance || $scope.currentPvP.comment.originalContent != $scope.currentPvP.comment.content;
        };

        $interval(function () {
            if ($scope.isDirty()) {
                $scope.save();
            }
        }, 2000);

        $scope.forward = function () {
            $scope.isAnimating = true;
            if ($scope.isDirty()) {
                $scope.save();
            }
            $scope.click_prev = false;
            $scope.click_next = true;
            if (($scope.currentItemIndex + 1) < $scope.pvps.length) {
                $scope.currentItemIndex++;
            } else {
                $scope.currentItemIndex = 0;
            }
        };
        $scope.$watch('currentItemIndex', function (newVal, oldVal) {
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
        }, true);
        $scope.$watch('currentPvP.talent_category', function(newVal, oldVal){
            if (newVal != oldVal) {
                $scope.currentPvP.label = TalentCategories.getLabelByTalentCategory(newVal);
            }
        },true);
        $scope.backward = function () {
            $scope.isAnimating = true;
            if ($scope.isDirty()) {
                $scope.save();
            }
            $scope.click_next = false;
            $scope.click_prev = true;
            if ($scope.currentItemIndex > 0) {
                $scope.currentItemIndex--;
            } else {
                $scope.currentItemIndex = $scope.pvps.length - 1;
            }
        };
        $scope.addComment = function () {
            var newComment = {};
            newComment.id = -1;
            newComment.content = $scope.pvp.comment;
            newComment.modified_date = new Date().toJSON();
            newComment.owner = User.get();
            newComment.newSubCommentText = "";
            newComment.subcomments = [];
            newComment.visibility = 2; // People team

            var data = {id: newComment.id, _model_name: "employee", _object_id: 0, _content: newComment.content, _visibility: newComment.visibility};

            data.id = $scope.pvp.employee.id;
            EmployeeComments.save(data, function (response) {
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
                    if (!$scope.pvps[index].comment) {
                        $scope.pvps[index].comment = {};
                    }
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
    }])
;