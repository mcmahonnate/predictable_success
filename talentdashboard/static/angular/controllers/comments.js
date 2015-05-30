angular.module('tdb.controllers.comments', [])

    .controller('CommentsCtrl', ['$scope', '$rootScope', '$filter', '$routeParams', '$window', 'Comments', 'EmployeeComments', 'SubComments','Comment', 'Engagement', function($scope, $rootScope, $filter, $routeParams, $window, Comments, EmployeeComments, SubComments, Comment, Engagement) {
        $scope.init = function(view, path, id) {
            $scope.view = view;
            $scope.path = path;
            $scope.id = id;
            $scope.loadComments();
        };
        if ($rootScope.currentUser.can_coach_employees || $rootScope.currentUser.can_view_company_dashboard) {
                $scope.newCommentVisibility = 2;
                $scope.showPeopleTeamVisibility = true;
        }
        $scope.showMembers = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/static/angular/partials/_widgets/show-members.html',
                controller: 'DailyDigestCtrl'
            });
        };
        var getBlankComment = function() {
            return {text: '', visibility: 3, include_in_daily_digest: true, happy: {assessment: 0}}
        };
        $scope.newComment = getBlankComment();
        $scope.showPeopleTeamVisibility = false;
        $scope.CreateHeader = function(date) {
            date=$filter('date')(date,"MM/dd/yyyy");
            showHeader = (date!=$scope.currentGroup);
            $scope.currentGroup = date;
            return showHeader;
        }
        $scope.comments = [];
        $scope.originalComments = [];
        $scope.loadComments = function() {
            $scope.busy = true;
            //Comment.get({page:$scope.page + 1}).$promise.then(function(data) {
            //Comments.getEmployeeComments($scope.employeeId, $scope.page + 1, function (data) {
            //Comments.getLeadComments($scope.leadId, $scope.page + 1, function(data) {
            //Comments.getTeamComments($routeParams.id, $scope.page + 1, function(data) {
            //Comments.getCoachComments($rootScope.currentUser.id, $scope.page + 1, function(data) {
            var query = $scope.path ? { path: $scope.path, id: $scope.id, page: $scope.page + 1 } : { page: $scope.page + 1 };
            Comments.get(query, function(data) {
                $scope.has_next = data.has_next;
                $scope.page = data.page;
                $scope.new_comments = data.results;
                $scope.new_originalComments = angular.copy($scope.new_comments);
                angular.forEach($scope.new_comments, function (comment) {
                    var index = $scope.new_comments.indexOf(comment);
                    var original_comment = $scope.new_originalComments[index];
                    comment.subcomments = [];
                    original_comment.subcomments = [];
                    SubComments.query({ id: comment.id }).$promise.then(function (response) {
                            comment.subcomments = response;
                            original_comment.subcomments = angular.copy(comment.subcomments);
                        }
                    );
                    comment.newSubCommentText = "";
                    comment.expandTextArea = false;
                    comment.expandChildTextArea = false;
                    $scope.comments.push(comment)
                    $scope.originalComments.push(original_comment);
                });
                $scope.busy = false;
            });
        };
        $scope.page = 0;
        $scope.busy = false;
        $scope.has_next = true;

        $scope.saveComment = function(comment) {
            var index = $scope.comments.indexOf(comment);
            if (comment.happiness && comment.happiness.assessment > 0) {
                var data = {id: $scope.employee.id, _assessment_id:comment.happiness.id,_assessed_by_id: $rootScope.currentUser.employee.id, _assessment: comment.happiness.assessment, _content:comment.content,_visibility: comment.visibility,_include_in_daily_digest: comment.include_in_daily_digest};
                Engagement.update(data, function(response) {
                    $scope.originalComments[index].content = comment.content;
                    $scope.originalComments[index].visibility = comment.visibility;
                    $scope.originalComments[index].happiness = comment.happiness;
                });
            } else {
                var data = {id: comment.id, _content: comment.content, _visibility: comment.visibility, _include_in_daily_digest: comment.include_in_daily_digest};
                console.log(data);
                Comment.update(data, function() {
                    $scope.originalComments[index].content = comment.content;
                    $scope.originalComments[index].visibility = comment.visibility;
                    $scope.originalComments[index].daily_digest = comment.daily_digest;
                });
            };
        }

        $scope.cancelEditComment = function(comment) {
            var index = $scope.comments.indexOf(comment);
            comment.content = $scope.originalComments[index].content;
        }

         $scope.saveSubComment = function(subcomment, comment) {
            var parent_index = $scope.comments.indexOf(comment);
            var subcomment_index = $scope.comments[parent_index].subcomments.indexOf(subcomment);
            var data = {id: subcomment.id, _content: subcomment.content};

            Comment.update(data, function() {
                $scope.originalComments[parent_index].subcomments[subcomment_index].content = subcomment.content;
            });
        }

        $scope.cancelEditSubComment = function(subcomment, comment) {
            var parent_index = $scope.comments.indexOf(comment);
            var subcomment_index = $scope.comments[parent_index].subcomments.indexOf(subcomment);
            subcomment.content = $scope.originalComments[parent_index].subcomments[subcomment_index].content;
        }

        $scope.addComment = function(equals) {
            var newComment = {id: -1, content: $scope.newComment.text, modified_date: new Date().toJSON(), owner: $rootScope.currentUser, newSubCommentText: '', visibility: $scope.newComment.visibility, happy: $scope.newComment.happy, include_in_daily_digest: $scope.newComment.include_in_daily_digest};
            newComment.subcomments=[];

            if ($scope.newComment.happy.assessment>0) {
                var data = {id: $scope.id, _assessed_by_id: $rootScope.currentUser.employee.id, _assessment: newComment.happy.assessment, _content:newComment.content, _visibility: newComment.visibility, _include_in_daily_digest: newComment.include_in_daily_digest};
                Engagement.addNew(data, function(response) {
                    newComment.id = response.comment.id;
                    newComment.happiness = response.comment.happiness;
                    newComment.visibility = response.comment.visibility;
                });
            } else {
                var data = {id: newComment.id, _model_name: "employee", _object_id: 0, _content: newComment.content, _visibility: newComment.visibility, _include_in_daily_digest: newComment.include_in_daily_digest};
                console.log(data);
                data.id = $scope.id;
                EmployeeComments.save(data, function (response) {
                    newComment.id = response.id;
                });
            };
            $scope.comments.push(newComment);
            $scope.originalComments.push(angular.copy(newComment));
            $scope.newComment = getBlankComment();
        }

        $scope.addSubComment = function(comment) {
            var newComment = {};
            newComment.id = -1;
            newComment.content = comment.newSubCommentText;
            newComment.modified_date = new Date().toJSON();
            newComment.owner = $rootScope.currentUser;

            var data = {id: newComment.id, _model_name: "comment", _object_id: comment.id,_content: newComment.content};

            data.id = comment.associated_object.id;
            EmployeeComments.save(data, function(response) {
                comment.subcomments.push(response);
                comment.newSubCommentText = "";
            });
        }

        $scope.deleteComment = function(comment) {
            if ($window.confirm('Are you sure you want to delete this comment?')) {
                var data = {id: comment.id};
                var index = $scope.comments.indexOf(comment);
                var deleteSuccess = function() {
                    $scope.comments.splice(index, 1);
                };

                Comment.remove(data, function() {
                        deleteSuccess();
                    });
            }
        };

        $scope.deleteSubComment = function(comment, subcomment) {
            if ($window.confirm('Are you sure you want to delete this comment?')) {
                var data = {id: subcomment.id};
                var comment_index = $scope.comments.indexOf(comment);
                var subcomment_index = $scope.comments[comment_index].subcomments.indexOf(subcomment);
                var deleteSuccess = function() {
                    $scope.comments[comment_index].subcomments.splice(subcomment_index, 1);
                    $scope.originalComments[comment_index].subcomments.splice(subcomment_index, 1);
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