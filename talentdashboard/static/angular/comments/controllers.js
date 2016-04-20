angular.module('tdb.comments.controllers', [])

    .controller('CommentCtrl', ['$scope', '$rootScope', '$window', 'Comment', 'Event', function($scope, $rootScope, $window, Comment, Event) {
        $scope.editingComment = new Comment();
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
                        $scope.editingComment = new Comment();
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

    .controller('AddEmployeeCommentCtrl', ['$scope', '$rootScope', '$routeParams', 'Comment', function($scope, $rootScope, $routeParams, Comment) {
        var resetNewComment = function() {
            $scope.newComment = new Comment({content:'', include_in_daily_digest:true});
        };
        resetNewComment();

        $scope.addComment = function(form) {
            if (form.$invalid) return;
            Comment.addToEmployee({ id:$routeParams.id}, $scope.newComment, function(comment) {
                $rootScope.$broadcast("comments.commentCreated", comment);
                resetNewComment();
            });
        };
    }])

    .controller('DailyDigestCtrl', ['$scope', '$modalInstance', 'Employee', function ($scope, $modalInstance, Employee) {
        $scope.members = Employee.query({group_name: 'Daily Digest Subscribers', show_hidden: true});
        $scope.cancel = function () {
            $modalInstance.dismiss();
        }
    }])

    .controller('ShowDailyDigestCtrl', ['$scope', '$modal', function ($scope, $modal) {
        $scope.showMembers = function () {
            $modal.open({
                animation: true,
                templateUrl: '/static/angular/partials/_modals/show-members.html',
                controller: 'DailyDigestCtrl'
            });
        }
    }])

    .controller('AddCheckInActivityCommentCtrl', ['$scope', '$rootScope', 'Comment', function($scope, $rootScope, Comment) {
        var blankComment = new Comment({content:'', include_in_daily_digest:true});
        angular.copy(blankComment, $scope.newComment);

        $scope.add = function(form, checkInId, comments) {
            if (form.$invalid) return;
            Comment.addToCheckIn({ id:checkInId}, $scope.newComment, function(comment) {
                if(comments) {
                    comments.push(comment);
                }
                angular.copy(blankComment, $scope.newComment);
            });
        };
    }])

    .controller('AddDevZoneActivityCommentCtrl', ['$scope', '$rootScope', 'Comment', function($scope, $rootScope, Comment) {
        var blankComment = new Comment({content:'', include_in_daily_digest:true});
        angular.copy(blankComment, $scope.newComment);

        $scope.add = function(form, checkInId, comments) {
            if (form.$invalid) return;
            Comment.addToDevzone({ id:checkInId}, $scope.newComment, function(comment) {
                if(comments) {
                    comments.push(comment);
                }
                angular.copy(blankComment, $scope.newComment);
            });
        };
    }])
;
