angular.module('tdb.controllers.comments', [])

    .controller('CommentCtrl', ['$scope', '$rootScope', '$window', 'Comment', function($scope, $rootScope, $window, Comment) {
        $scope.editedComment = new Comment();
        $scope.newReply = new Comment();

        $scope.edit = function(comment) {
            $scope.editingComment = angular.copy(comment);
            $scope.editMode = true;
        };

        $scope.cancelEdit = function() {
            $scope.editMode = false;
        };

        $scope.update = function(form, comment) {
            if(form.$invalid) return;
            Comment.update($scope.editingComment, function(result) {
                    angular.copy(result, comment);
                    $scope.editMode = false;
                }
            );
        };

        $scope.delete = function(comment, collection) {
            if ($window.confirm('Are you sure you want to delete this comment?')) {
                Comment.delete(comment, function(result) {
                        if(collection) {
                            $rootScope.removeItemFromList(collection, comment);
                        }
                    }
                );
            }
        };

        $scope.addReply = function(form, comment) {
            if (form.$invalid) return;
            Comment.addToComment({id: comment.id}, $scope.newReply, function(result) {
                comment.replies.push(result);
                $scope.newReply = new Comment();
            });
        };
    }])

    .controller('CommentReplyCtrl', ['$scope', '$rootScope', 'Comment', function($scope, $rootScope, Comment) {
        $scope.editReply = function(form, reply) {
            if (form.$invalid) return;
            var editedComment = new Comment(reply);
            editedComment.$update();
        };

        $scope.edit = function(comment) {
            $scope.editingComment = angular.copy(comment);
            $scope.editMode = true;
        };

        $scope.cancelEdit = function() {
            $scope.editMode = false;
        };

        $scope.update = function(form, comment) {
            if(form.$invalid) return;
            Comment.update($scope.editingComment, function(result) {
                    angular.copy(result, comment);
                    $scope.editMode = false;
                }
            );
        };

        $scope.delete = function(comment, collection) {
            if ($window.confirm('Are you sure you want to delete this comment?')) {
                Comment.delete(comment, function(result) {
                        if(collection) {
                            $rootScope.removeItemFromList(collection, comment);
                        }
                    }
                );
            }
        };
    }])

    .controller('AddCheckInCommentCtrl', ['$scope', '$rootScope', '$routeParams', 'Comment', function($scope, $rootScope, $routeParams, Comment) {
        var initialize = function() {
            $scope.newComment = new Comment({content:'', include_in_daily_digest:true});
        };
        initialize();
        $scope.comments = Comment.getCheckInComments({id:$routeParams.id});

        $scope.add = function(form) {
            if (form.$invalid) return;
            Comment.addToCheckIn({ id:$routeParams.id}, $scope.newComment, function(comment) {
                $scope.comments.push(comment);
                initialize();
                $rootScope.$broadcast("comments.commentCreated", comment);
            });
        };
    }])

    .controller('AddEmployeeCommentCtrl', ['$scope', '$rootScope', '$routeParams', 'Comment', function($scope, $rootScope, $routeParams, Comment) {
        var resetNewComment = function() {
            $scope.newComment = new Comment({content:'', include_in_daily_digest:true});
        };
        resetNewComment();

        $scope.add = function(form) {
            if (form.$invalid) return;
            Comment.addToEmployee({ id:$routeParams.id}, $scope.newComment, function(comment) {
                $rootScope.$broadcast("comments.commentCreated", comment);
                resetNewComment();
            });
        };
    }])
;
