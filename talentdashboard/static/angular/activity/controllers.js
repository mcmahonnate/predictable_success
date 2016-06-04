angular.module('tdb.activity.controllers', [])
    .controller('ActivityCtrl', ['$attrs', '$rootScope', '$routeParams', '$scope', '$timeout', '$window', 'Event', 'Comment', function($attrs, $rootScope, $routeParams, $scope, $timeout, $window, Event, Comment) {
        var pause = false;
        var loaded = false;
        var tempEvents = [];
        $scope.events = [];
        $scope.view = $attrs.view;
        $scope.nextPage = 1;
        $scope.hasNextPage = true;
        $scope.busy = false;
        $scope.reloadFinished = true;
        $scope.type = null;
        $scope.third_party = null;

        function finishLoading(){
            if (!pause && loaded) {
                if ($scope.nextPage == 1) {
                    $scope.events = tempEvents.results;
                } else {
                    $scope.events = $scope.events.concat(tempEvents.results);
                }
                $scope.nextPage++;
                $scope.hasNextPage = tempEvents.has_next;
                $scope.reloadFinished = true;
                $scope.busy = false;
            }
        }

        $scope.loadNextPage = function() {
            if ($scope.hasNextPage && !$scope.busy) {
                $scope.busy = true;
                if ($scope.nextPage == 1) {
                    // Only animate on the first page of a reload.
                    $scope.reloadFinished = false;
                }
                var request = null;
                switch ($scope.view) {
                    case 'me':
                        request = Event.getEmployeeEvents($routeParams.id, $scope.nextPage, $scope.type, $scope.third_party);
                        break;
                    case 'employee':
                        request = Event.getEmployeeEvents($routeParams.id, $scope.nextPage, $scope.type, $scope.third_party);
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
                        request = Event.getCoachEvents($routeParams.id, $scope.nextPage, $scope.type);
                        break;
                }
                if (request) {
                    pause = false;
                    loaded = false;
                    if ($scope.nextPage == 1) {
                        pause = true;
                        $timeout(function() {
                            pause = false;
                            finishLoading();
                        }, 500)
                    }
                    request.$promise.then(function (page) {
                        loaded = true;
                        tempEvents = page;
                        finishLoading();
                    });
                }
            }
        };

        $scope.loadNextPage();

        $scope.$on("filterComments", function(e, filter) {
            $scope.nextPage = 1;
            $scope.hasNextPage = true;
            $scope.type = filter.type;
            $scope.view = filter.view;
            $scope.third_party = filter.third_party;
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