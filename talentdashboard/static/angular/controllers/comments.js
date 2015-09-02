angular.module('tdb.controllers.comments', [])

    .controller('CheckinCommentCtrl', ['$scope', '$rootScope', '$routeParams', 'Comment', function($scope, $rootScope, $routeParams, Comment) {
        
        $scope.newComment = new Comment({content:'', include_in_daily_digest:true});

        $scope.add = function(form) {

            if (form.$invalid) return;
            Comment.addToCheckIn({ id:$routeParams.id}, $scope.newComment, function(comment) {
                $scope.newComment = new Comment({content:'', include_in_daily_digest:true});
                $rootScope.$broadcast("commentCreated", comment);
            });
        }      
    }]);