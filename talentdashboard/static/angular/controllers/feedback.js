angular.module('feedback.controllers', [])
    .controller(
        'MenuCtrl',
        ['$scope', '$location', 'User',
            function ($scope, $location, User) {
                $scope.user = User.get();
                $scope.menuClass = function (path) {
                    var current = $location.path();
                    return current.indexOf(path) == 0 ? "active" : "";
                };
            }
        ])
    .controller(
        'RequestFeedbackCtrl',
        ['$scope', '$interval', 'FeedbackRequest', 'Employee', 'Notification',
            function ($scope, $interval, FeedbackRequest, Employee, Notification) {
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
                        $scope.search.selectedReviewers = [];
                        Notification.success("Your request will be delivered");
                    });
                };
            }
        ]
    )
    .controller(
        'FeedbackRequestsCtrl',
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
            }
        ]
    )
    .controller(
        'ReplyToFeedbackRequestCtrl',
        ['$scope', '$routeParams', '$interval', '$location', 'FeedbackRequest', 'FeedbackSubmission', 'Notification',
            function ($scope, $routeParams, $interval, $location, FeedbackRequest, FeedbackSubmission, Notification) {
                $scope.alerts = [];
                $scope.request = null;
                $scope.showSuccessAlert = false;
                $scope.feedback = {excels_at: "", could_improve_on: ""};
                FeedbackRequest.get({id: $routeParams.id}, function (response) {
                    $scope.request = response;
                });

                $scope.cancel = function () {
                    $location.path('/submit');
                };

                $scope.submit = function () {
                    var submission = new FeedbackSubmission({
                        feedback_request: $routeParams.id,
                        subject: $scope.request.requester.id,
                        excels_at: $scope.feedback.excels_at,
                        could_improve_on: $scope.feedback.could_improve_on
                    });

                    submission.$save(function () {
                        Notification.success("Your feedback was saved");
                        $location.path('/submit');
                    });
                };
            }
        ]
    )
    .controller(
        'SubmitFeedbackCtrl',
        ['$scope', '$location', 'Employee', 'FeedbackSubmission',
            function ($scope, $location, Employee, FeedbackSubmission) {
                $scope.searchText = "";
                $scope.feedback = new FeedbackSubmission({
                    excels_at: "",
                    could_improve_on: "",
                    subject: null
                });
                $scope.employees = Employee.query();
                $scope.search = {
                    selectedEmployee: null
                };
                $scope.submit = function () {
                    $scope.feedback.subject = $scope.search.selectedEmployee.id;
                    $scope.feedback.$save(function (f) {
                        $location.path('/submit');
                    });
                };
                $scope.cancel = function () {
                    $location.path('/submit');
                };
            }
        ]
    )
    .controller(
        'CoachReportCtrl',
        ['$scope', 'CoachReport',
            function ($scope, CoachReport) {
                CoachReport.query({}, function(results) {
                    $scope.report = results;
                });
            }
        ]
    )
    .controller(
        'CompiledFeedbackCtrl',
        ['$scope', '$routeParams', '$location', 'CoachReport', 'Notification',
            function($scope, $routeParams, $location, CoachReport, Notification) {
                $scope.feedbackItemIds = [];

                CoachReport.query({}, function(data) {
                    for(var i = 0; i < data.length; i++) {
                        var item = data[i];
                        if(item.employee.id.toString() === $routeParams.id) {
                            $scope.report = item;
                            for(var j = 0, len = $scope.report.undelivered_feedback.length; j < len; j++) {
                                var id = $scope.report.undelivered_feedback[j].id;
                                $scope.feedbackItemIds.push({id: id});
                            }
                            break;
                        }
                    }
                });

                $scope.markDelivered = function() {
                    CoachReport.markDelivered($scope.feedbackItemIds, function() {
                        Notification.success($scope.report.total_feedback_items.toString() + " items were marked as delivered");
                        $location.path('/deliver');
                    })
                };

                $scope.email = function() {
                    CoachReport.sendEmail($scope.feedbackItemIds, function() {
                        Notification.success($scope.report.total_feedback_items.toString() + " feedback items will be emailed to " + $scope.report.employee.full_name);
                        $location.path('/deliver');
                    })
                };
            }
        ]
    )
;
