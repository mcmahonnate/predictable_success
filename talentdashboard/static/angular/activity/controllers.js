angular.module('tdb.activity.controllers', [])
    .controller('ActivityCtrl', ['$scope', '$rootScope', '$routeParams', '$window', '$attrs', 'Event', 'Comment', function($scope, $rootScope, $routeParams, $window, $attrs, Event, Comment) {
        var view = $attrs.view;
        $scope.events = [];
        $scope.view = view;
        $scope.nextPage = 1;
        $scope.hasNextPage = true;
        $scope.busy = false;
        $scope.type = null;
        $scope.loadNextPage = function() {
            if ($scope.hasNextPage && !$scope.busy) {
                $scope.busy = true;
                var request = null;
                switch (view) {
                    case 'me':
                        request = Event.getEmployeeEvents($routeParams.employeeId, $scope.nextPage, $scope.type);
                        break;
                    case 'employee':
                        request = Event.getEmployeeEvents($routeParams.id, $scope.nextPage, $scope.type);
                        break;
                    case 'company':
                        request = Event.get({page: $scope.nextPage, type: $scope.type});
                        break;
                    case 'leader':
                        request = Event.getLeadEvents($routeParams.id, $scope.nextPage, $scope.type);
                        break;
                    case 'team':
                        request = Event.getTeamEvents($routeParams.teamId, $scope.nextPage, $scope.type);
                        break;
                    case 'coach':
                        request = Event.getCoachEvents($scope.nextPage, $scope.type);
                        break;
                }
                request.$promise.then(function (page) {
                    $scope.events = $scope.events.concat(page.results);
                    $scope.nextPage++;
                    $scope.hasNextPage = page.has_next;
                    $scope.busy = false;
                });
            }
        };

        $scope.loadNextPage();

        $scope.$on("filterComments", function(e, filter) {
            $scope.events = [];
            $scope.nextPage = 1;
            $scope.hasNextPage = true;
            $scope.type = filter.type;
            $scope.loadNextPage();
        });

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