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
                    showWhoCanSeeThis();
                }
            }, function (response) {
                $scope.error = true
            }
        );
        $scope.happy = {assessment: 0};
        $scope.happy.comment = {visibility: 3, content: ''};

        showWhoCanSeeThis = function () {
            $modal.open({
                animation: true,
                templateUrl: '/static/angular/partials/_modals/who-can-see-this.html',
                controller: 'DailyDigestCtrl'
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
;