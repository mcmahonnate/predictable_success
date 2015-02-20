angular.module('feedback.controllers', [])
    .controller(
        'RequestFeedbackCtrl',
        ['$scope',  '$mdToast', 'FeedbackRequest', 'Employee',
            function($scope, $mdToast, FeedbackRequest, Employee) {
                $scope.selectedItem = null;
                $scope.searchText = "";
                $scope.pendingRequests = FeedbackRequest.pending();
                $scope.potentialReviewers = Employee.potentialReviewers();
                $scope.search = {
                    selectedReviewers: []
                };
                $scope.submit = function() {
                    var requests = [];
                    for(var i=0; i < $scope.search.selectedReviewers.length; i++) {
                        var reviewer = $scope.search.selectedReviewers[i];
                        var request = { reviewer: reviewer.id };
                        requests.push(request);
                    }
                    FeedbackRequest.save(requests, function(data) {
                        Array.prototype.unshift.apply($scope.pendingRequests, data);
                        $scope.potentialReviewers = Employee.potentialReviewers();
                        var multiple = $scope.search.selectedReviewers.length > 1;
                        $scope.search.selectedReviewers = [];
                        $mdToast.show(
                            $mdToast.simple()
                                .content('Your request'.concat(multiple ? 's were' : ' was').concat(' sent.'))
                        );
                    });
                };
            }
        ]
    )
    .controller(
        'FeedbackTodoCtrl',
        ['$scope', 'FeedbackRequest',
            function($scope, FeedbackRequest) {
                $scope.search = { selectedRequest: null };
                $scope.todos = null;
                $scope.hasTodos = null;
                FeedbackRequest.todo(null, function(response) {
                    $scope.todos = [];
                    $scope.hasTodos = response.length > 0;
                    for(var i=0; i < response.length; i++) {
                        var request = response[i];
                        var item = {name: request.reviewer.full_name, request_id: request.id};
                        $scope.todos.push(item);
                    }
                });
                $scope.select = function(id) {
                    console.log(id);
                };
            }
        ]
    )
    .controller(
        'SubmitFeedbackCtrl',
        ['$scope', '$routeParams', '$mdToast', '$location', 'FeedbackRequest', 'FeedbackSubmission',
            function($scope, $routeParams, $mdToast, $location, FeedbackRequest, FeedbackSubmission) {
                $scope.request = null;
                $scope.feedback = {excels_at: "", could_improve_on: ""};
                FeedbackRequest.get({id: $routeParams.id}, function(response) {
                    $scope.request = response;
                });

                $scope.submit = function() {
                    var submission = new FeedbackSubmission({
                        feedback_request: $routeParams.id,
                        subject: $scope.request.requester.id,
                        excels_at: $scope.feedback.excels_at,
                        could_improve_on: $scope.feedback.could_improve_on
                    });

                    submission.$save(function(s) {
                        $mdToast.show(
                            $mdToast.simple()
                                .content('Thanks for your feedback!')
                        );
                        $location.path('/todo');
                    });
                }
            }
        ]
    )
;
