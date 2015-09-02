angular.module('tdb.controllers.comments', [])

    .controller('CheckinCommentCtrl', ['$scope', '$rootScope', '$routeParams', 'Comment', function($scope, $rootScope, $routeParams, Comment) {
        
        $scope.newComment = new Comment();

        $scope.add = function(form) {

            console.log(form);

            if (form.$invalid) return;
            Comment.addToCheckIn({ id:$routeParams.id}, $scope.newComment)
                .$promise.then(function(comment) {
                    $scope.newComment = new Comment();

                    $rootScope.$broadcast("commentCreated", comment);
                });
        }      
    }]);