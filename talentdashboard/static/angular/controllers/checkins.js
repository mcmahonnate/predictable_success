angular.module('tdb.controllers.checkins', [])

    .controller('AddEditCheckInCtrl', ['$scope', '$rootScope', '$modalInstance', '$routeParams', 'CheckIn', 'checkin', function ($scope, $rootScope, $modalInstance, $routeParams, CheckIn, checkin) {
        $scope.checkin = angular.copy(checkin);

        $scope.save = function (form) {
            if(form.$invalid) return;
            $scope.checkin.$save(function (value) {
                $modalInstance.close(value);
            });
        };
    }])

    .controller('CheckInsCtrl', ['$scope', '$rootScope', '$modalInstance', '$routeParams', 'CheckIn', 'checkin', function ($scope, $rootScope, $modalInstance, $routeParams, CheckIn, checkin) {
        
        CheckIn.get(query, function(data) {
            $scope.checkins = data.results;
            angular.forEach($scope.checkins, function (checkin) {
                $scope.checkins.push(checkin);
            });
        });        

    }]);