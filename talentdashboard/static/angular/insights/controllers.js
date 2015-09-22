angular.module('tdb.insights.controllers', [])

    .controller('SelfAssessReportCtrl', ['$scope', '$rootScope', '$location', 'ProspectReport', 'TalentCategories', 'User', 'analytics', function($scope, $rootScope, $location, ProspectReport, TalentCategories, User, analytics) {
        analytics.trackPage($scope, $location.absUrl(), $location.url());
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
                row.email = selfAssessment.email;
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
;