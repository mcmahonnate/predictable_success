angular.module('tdb.activity.controllers', [])
    .controller('ActivityCtrl', ['$attrs', '$rootScope', '$routeParams', '$scope', '$timeout', '$window', 'Event', 'Comment', function($attrs, $rootScope, $routeParams, $scope, $timeout, $window, Event, Comment) {
        var pause = false;
        var loaded = false;
        var tempEvents = [];
        $scope.showHeader = true;
        if ($attrs.showHeader) {
            $scope.showHeader = ($attrs.showHeader!='false');
        }
        $scope.events = [];
        $scope.filter = {type: null, view: $attrs.view, third_party: null, employee: null, exclude_third_party_events: true};
        $scope.nextPage = 1;
        $scope.hasNextPage = true;
        $scope.busy = false;
        $scope.reloadFinished = true;
        $scope.loadNextPage = loadNextPage;


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

        function loadNextPage() {
            if ($scope.hasNextPage && !$scope.busy) {
                $scope.busy = true;
                if ($scope.nextPage == 1) {
                    // Only animate on the first page of a reload.
                    $scope.reloadFinished = false;
                }
                var request = null;
                switch ($scope.filter.view) {
                    case 'employee':
                        request = Event.getEmployeeEvents($routeParams.id, $scope.nextPage, $scope.filter.type, $scope.filter.third_party, $scope.filter.exclude_third_party_events);
                        break;
                    case 'company':
                        request = Event.get({page: $scope.nextPage, type: $scope.filter.type});
                        break;
                    case 'leader':
                        request = Event.getLeadEvents($routeParams.id, $scope.nextPage, $scope.filter.type, $scope.filter.third_party, $scope.filter.exclude_third_party_events);
                        break;
                    case 'team':
                        request = Event.getTeamEvents($routeParams.teamId, $scope.nextPage, $scope.filter.type, $scope.filter.third_party, $scope.filter.exclude_third_party_events);
                        break;
                    case 'coach':
                        request = Event.getCoachEvents($routeParams.id, $scope.nextPage, $scope.filter.type, $scope.filter.third_party, $scope.filter.exclude_third_party_events);
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

        $scope.$on("filterComments", function(e, filter) {
            $scope.nextPage = 1;
            $scope.hasNextPage = true;
            $scope.filter = filter;
            loadNextPage();
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