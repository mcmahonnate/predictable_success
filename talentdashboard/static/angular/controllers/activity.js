angular.module('tdb.controllers.activity', [])

    .controller('ActivityCtrl', ['$scope', '$rootScope', '$filter', '$window', '$modal', 'Events', 'EmployeeComments', 'SubComments','Comment', 'Employee', function($scope, $rootScope, $filter, $window, $modal, Events, EmployeeComments, SubComments, Comment, Employee) {
        $scope.init = function(view, path, id) {
            $scope.view = view;
            $scope.path = path;
            $scope.id = id;
            $scope.loadEvents();
        };
        if ($scope.path == 'employees') {
            Employee.get(
                {id: $scope.id},
                function (data) {
                    $scope.employee = data;
                }
            );
        }
        $scope.showMembers = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/static/angular/partials/_modals/show-members.html',
                controller: 'DailyDigestCtrl'
            });
        };
        var getBlankComment = function() {
            return {text: '', visibility: 3, include_in_daily_digest: true, happy: {assessment: 0}}
        };


        if ($rootScope.currentUser.can_coach_employees || $rootScope.currentUser.can_view_company_dashboard) {
                $scope.newCommentVisibility = 2;
                $scope.showPeopleTeamVisibility = true;
        }

        $scope.newComment = getBlankComment();
        $scope.showPeopleTeamVisibility = false;
        $scope.CreateHeader = function(date) {
            date=$filter('date')(date,"MM/dd/yyyy");
            showHeader = (date!=$scope.currentGroup);
            $scope.currentGroup = date;
            return showHeader;
        }
        $scope.events = [];
        $scope.originalEvents = [];
        $scope.loadEvents = function() {
            $scope.busy = true;
            var query = $scope.path ? { path: $scope.path, id: $scope.id, page: $scope.page + 1 } : { page: $scope.page + 1 };
            Events.get(query, function(data) {
                $scope.has_next = data.has_next;
                $scope.page = data.page;
                $scope.new_events = data.results;
                $scope.new_originalEvents = angular.copy($scope.new_events);
                angular.forEach($scope.new_events, function (event) {
                    var index = $scope.new_events.indexOf(event);
                    var original_event = $scope.new_originalEvents[index];
                    event.subcomments = [];
                    original_event.subcomments = [];
                    if (event.type == 'comment') {
                        SubComments.query({ id: event.event_id }).$promise.then(function (response) {
                                event.subcomments = response;
                                original_event.subcomments = angular.copy(event.subcomments);
                            }
                        );
                    }
                    event.newSubCommentText = "";
                    event.expandTextArea = false;
                    event.expandChildTextArea = false;
                    $scope.events.push(event)
                    $scope.originalEvents.push(original_event);
                });
                $scope.busy = false;
            });
        };
        $scope.page = 0;
        $scope.busy = false;
        $scope.has_next = true;
        $scope.editComment = function(event) {
            var index = $scope.events.indexOf(event);
            if (!event.comment) {
                Comment.get({id: event.event_id}).$promise.then(function (response) {
                    $scope.events[index].comment = response;
                    $scope.originalEvents[index].comment = angular.copy($scope.events[index].comment);
                });
            };
        };

        $scope.saveComment = function(event) {
            var index = $scope.events.indexOf(event);
            var data = {id: event.event_id, _content: event.comment.content, _visibility: event.visibility, _include_in_daily_digest: event.comment.include_in_daily_digest};
            Comment.update(data, function() {
                event.description = event.comment.content;
                $scope.originalEvents[index].comment = angular.copy($scope.events[index].comment);
                $scope.originalEvents[index].description = $scope.events[index].comment.content;
            });
        }

        $scope.cancelEditComment = function(event) {
            var index = $scope.events.indexOf(event);
            event.comment.content = $scope.originalEvents[index].comment.content;
            event.comment.include_in_daily_digest = $scope.originalEvents[index].comment.include_in_daily_digest;

        }

         $scope.saveSubComment = function(subcomment, event) {
            var parent_index = $scope.events.indexOf(event);
            var subcomment_index = $scope.events[parent_index].subcomments.indexOf(subcomment);
            var data = {id: subcomment.id, _content: subcomment.content};

            Comment.update(data, function() {
                $scope.originalEvents[parent_index].subcomments[subcomment_index].content = subcomment.content;
            });
        }

        $scope.cancelEditSubComment = function(subcomment, event) {
            var parent_index = $scope.events.indexOf(event);
            var subcomment_index = $scope.events[parent_index].subcomments.indexOf(subcomment);
            subcomment.content = $scope.originalEvents[parent_index].subcomments[subcomment_index].content;
        }

        $scope.addComment = function(equals) {
            var newComment = {id: -1, content: $scope.newComment.text, modified_date: new Date().toJSON(), owner: $rootScope.currentUser, newSubCommentText: '', visibility: $scope.newComment.visibility, happy: $scope.newComment.happy, include_in_daily_digest: $scope.newComment.include_in_daily_digest};
            newComment.subcomments=[];

            var data = {id: newComment.id, _model_name: "employee", _object_id: 0, _content: newComment.content, _visibility: newComment.visibility, _include_in_daily_digest: newComment.include_in_daily_digest};
            data.id = $scope.id;
            EmployeeComments.save(data, function (response) {
                newComment.id = response.id;
                var newEvent = {event_id: newComment.id, description: newComment.content, user: $rootScope.currentUser, verb: 'commented', employee: $scope.employee, type: 'comment', subcomments: {}}
                $scope.events.push(newEvent);
                $scope.originalEvents.push(angular.copy(newEvent));
                $scope.newComment = getBlankComment();

            });
        }

        $scope.addSubComment = function(event) {
            var newComment = {};
            newComment.id = -1;
            newComment.content = event.newSubCommentText;
            newComment.modified_date = new Date().toJSON();
            newComment.owner = $rootScope.currentUser;

            var data = {id: newComment.id, _model_name: "comment", _object_id: event.event_id,_content: newComment.content};
            var parent_index = $scope.events.indexOf(event);

            data.id = event.employee.id;
            EmployeeComments.save(data, function(response) {
                event.subcomments.push(response);
                $scope.originalEvents[parent_index].subcomments.push(response);
                event.newSubCommentText = "";
            });
        }

        $scope.deleteComment = function(event) {
            if ($window.confirm('Are you sure you want to delete this comment?')) {
                var data = {id: event.event_id};
                var index = $scope.events.indexOf(event);
                var deleteSuccess = function() {
                    $scope.events.splice(index, 1);
                };

                Comment.remove(data, function() {
                        deleteSuccess();
                    });
            }
        };

        $scope.deleteSubComment = function(event, subcomment) {
            if ($window.confirm('Are you sure you want to delete this comment?')) {
                var data = {id: subcomment.id};
                var parent_index = $scope.events.indexOf(event);
                var subcomment_index = $scope.events[parent_index].subcomments.indexOf(subcomment);
                var deleteSuccess = function() {
                    $scope.events[parent_index].subcomments.splice(subcomment_index, 1);
                    $scope.originalEvents[parent_index].subcomments.splice(subcomment_index, 1);
                };

                Comment.remove(data, function() {
                        deleteSuccess();
                    });
            }
        };
        $scope.toggleCommentTextExpander = function (comment) {
            $window.onclick = function (event) {
                if (!$scope.newComment.text) {
                    var clickedElement = event.target;
                    if (!clickedElement) return;
                    var elementClasses = clickedElement.classList;
                    var clickedOnTextArea = elementClasses.contains('text');
                    if (!clickedOnTextArea) {
                        comment.expandTextArea=false;
                        $scope.$apply();
                    }
                }
            };
        };
        $scope.toggleChildCommentTextExpander = function (comment) {
            $window.onclick = function (event) {
                if (!comment.newSubCommentText) {
                    var clickedElement = event.target;
                    if (!clickedElement) return;
                    var elementClasses = clickedElement.classList;
                    var clickedOnTextArea = elementClasses.contains('text');
                    if (!clickedOnTextArea) {
                        comment.expandChildTextArea=false;
                        $scope.$apply();
                    }
                }
            };
        };
    }]);