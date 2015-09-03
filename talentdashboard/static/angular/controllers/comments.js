angular.module('tdb.controllers.comments', [])

    .controller('CheckInCommentCtrl', ['$scope', '$rootScope', '$routeParams', 'Comment', function($scope, $rootScope, $routeParams, Comment) {
        var checkInId = $routeParams.id;
        var resetNewComment = function() {
            $scope.newComment = new Comment({content:'', include_in_daily_digest:true});
        };
        resetNewComment();
        $scope.comments = Comment.getCheckInComments({id:checkInId});

        $scope.add = function(form) {
            if (form.$invalid) return;
            Comment.addToCheckIn({ id:checkInId}, $scope.newComment, function(comment) {
                $scope.comments.push(comment);
                resetNewComment();
                $rootScope.$broadcast("comments.commentCreated", comment);
            });
        };

        $scope.edit = function(form, comment) {
            if (form.$invalid) return;
            comment.$update();
        };

        $scope.delete = function(comment) {
            comment.$delete();
            $rootScope.removeItemFromList($scope.comments, comment);
        };
    }])
;
