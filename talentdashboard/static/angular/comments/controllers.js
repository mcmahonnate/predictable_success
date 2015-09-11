angular.module('tdb.comments.controllers', [])

    .controller('CommentCtrl', ['$scope', '$rootScope', '$window', 'Comment', 'Event', function($scope, $rootScope, $window, Comment, Event) {
        $scope.editedComment = new Comment();
        $scope.newReply = new Comment();
        $scope.editMode = false;

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
                    $scope.editedComment = new Comment();
                }
            );
        };

        $scope.updateEvent = function(form, event) {
            if(form.$invalid) return;
            Comment.update($scope.editingComment, function(result) {
                    Event.getEventForComment({id: result.id}, function(result) {
                        angular.copy(result, event);
                        $scope.editedComment = new Comment();
                        $scope.editMode = false;
                    });
                }
            );
        };

        $scope.delete = function(comment, collection) {
            if ($window.confirm('Are you sure you want to delete this comment?')) {
                Comment.delete({id: comment.id}, function(result) {
                        if(collection) {
                            $rootScope.removeItemFromList(collection, comment);
                        }
                    }
                );
            }
        };

        $scope.deleteEvent = function(event, collection) {
            if ($window.confirm('Are you sure you want to delete this comment?')) {
                Comment.delete({id: event.related_object.id}, function(result) {
                        if(collection) {
                            $rootScope.removeItemFromList(collection, event);
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

    .controller('AddCheckInCommentCtrl', ['$scope', '$rootScope', '$routeParams', 'Comment', function($scope, $rootScope, $routeParams, Comment) {
        $scope.nextPage = 1;
        $scope.hasNextPage = false;
        $scope.comments = [];
        var initialize = function() {
            $scope.newComment = new Comment({content:'', include_in_daily_digest:true});
        };

        $scope.loadNextPage = function() {
            Comment.getCheckInComments({id:$routeParams.id, page: $scope.nextPage}, function(page) {
                $scope.comments = $scope.comments.concat(page.results);
                $scope.nextPage++;
                $scope.hasNextPage = page.has_next;
            })
        };

        initialize();
        $scope.loadNextPage();

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
