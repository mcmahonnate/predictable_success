angular.module('feedback.controllers', [])
    .controller(
        'MenuCtrl',
        ['$scope', '$location',
            function ($scope, $location) {
                $scope.menuClass = function(page) {
                    var current = $location.path().replace(/\//g, '');
                    return page === current ? "active" : "";
                };
            }
        ])
    .controller(
        'RequestFeedbackCtrl',
        ['$scope', '$interval', 'FeedbackRequest', 'Employee',
            function ($scope, $interval, FeedbackRequest, Employee) {
                $scope.selectedItem = null;
                $scope.searchText = "";
                $scope.message = "";
                $scope.pendingRequests = FeedbackRequest.pending();
                $scope.potentialReviewers = Employee.potentialReviewers();
                $scope.search = {
                    selectedReviewers: []
                };
                $scope.submit = function () {
                    var requests = [];
                    for (var i = 0; i < $scope.search.selectedReviewers.length; i++) {
                        var reviewer = $scope.search.selectedReviewers[i];
                        var request = { reviewer: reviewer.id, message: $scope.message };
                        requests.push(request);
                    }
                    FeedbackRequest.save(requests, function (data) {
                        Array.prototype.unshift.apply($scope.pendingRequests, data);
                        $scope.potentialReviewers = Employee.potentialReviewers();
                        var multiple = $scope.search.selectedReviewers.length > 1;
                        $scope.search.selectedReviewers = [];

                        $scope.showSuccessAlert = true;
                        $interval(function() {
                            $scope.showSuccessAlert = false;
                        }, 1000, 1);
                    });
                };
            }
        ]
    )
    .controller(
        'FeedbackTodoCtrl',
        ['$scope', 'FeedbackRequest',
            function ($scope, FeedbackRequest) {
                $scope.search = { selectedRequest: null };
                $scope.todos = null;
                $scope.hasTodos = null;
                FeedbackRequest.todo(null, function (response) {
                    $scope.todos = [];
                    $scope.hasTodos = response.length > 0;
                    for (var i = 0; i < response.length; i++) {
                        var request = response[i];
                        $scope.todos.push(request);
                    }
                });
                $scope.select = function (id) {
                    console.log(id);
                };
            }
        ]
    )
    .controller(
        'SubmitFeedbackCtrl',
        ['$scope', '$routeParams', '$interval', '$location', 'FeedbackRequest', 'FeedbackSubmission',
            function ($scope, $routeParams, $interval, $location, FeedbackRequest, FeedbackSubmission) {
                $scope.request = null;
                $scope.showSuccessAlert = false;
                $scope.feedback = {excels_at: "", could_improve_on: ""};
                FeedbackRequest.get({id: $routeParams.id}, function (response) {
                    $scope.request = response;
                });

                $scope.cancel = function() {
                    $location.path('/todo');
                };

                $scope.submit = function () {
                    var submission = new FeedbackSubmission({
                        feedback_request: $routeParams.id,
                        subject: $scope.request.requester.id,
                        excels_at: $scope.feedback.excels_at,
                        could_improve_on: $scope.feedback.could_improve_on
                    });

                    submission.$save(function (s) {
                        $scope.showSuccessAlert = true;
                        $interval(function() {
                            $scope.showSuccessAlert = false;
                        }, 1000, 1);

                        $location.path('/todo');
                    });
                }
            }
        ]
    )
;
