angular.module('tdb.controllers.activity', [])
    .controller('ActivityCtrl', ['$scope', '$rootScope', '$routeParams', '$window', '$attrs', 'Event', 'Comment', function($scope, $rootScope, $routeParams, $window, $attrs, Event, Comment) {
        var view = $attrs.view;
        $scope.events = [];
        $scope.nextPage = 1;
        $scope.hasNextPage = false;

        $scope.loadNextPage = function() {
            var request = null;
            switch(view) {
                case 'employee':
                    request = Event.getEmployeeEvents($routeParams.id, $scope.nextPage);
                    break;
                case 'company':
                    request = Event.get({page: $scope.nextPage});
                    break;
                case 'leader':
                    request = Event.getLeadEvents($scope.nextPage);
                    break;
                case 'team':
                    request = Event.getTeamEvents($routeParams.id, $scope.nextPage);
                    break;
                case 'coach':
                    request = Event.getCoachEvents($scope.nextPage);
                    break;
            }
            request.$promise.then(function(page) {
                $scope.events = $scope.events.concat(page.results);
                $scope.nextPage++;
                $scope.hasNextPage = page.has_next;
            });
        };

        $scope.loadNextPage();

        $rootScope.$on("comments.commentCreated", function(e, comment) {
            Event.getEventForComment({id: comment.id}, function(event) {
                $scope.events.push(event);
            })
        });

        $scope.saveComment = function(event) {
            var comment = new Comment(event.related_object);
            comment.$update(function(updatedComment) {
                Event.getEventForComment({id: updatedComment.id}, function(updatedEvent) {
                    $rootScope.replaceItemInList($scope.events, event, updatedEvent)
                });
            });
        };

        $scope.deleteComment = function(event) {
            if ($window.confirm('Are you sure you want to delete this comment?')) {
                var comment = new Comment(event.related_object);
                comment.$delete(function () {
                    $rootScope.removeItemFromList($scope.events, event)
                });
            }
        };
    }])
;