angular.module('feedback.controllers', [])
    .controller(
        'MenuCtrl',
        ['$scope', '$rootScope', '$location', '$http', 'User',
            function ($scope, $rootScope, $location, $http, User) {
                $scope.user = User.get();
                $scope.unreadFeedback = $scope.unansweredRequests = $scope.toBeDelivered = null;
                var update = function() {
                    $http.get('/api/v1/feedback/menu/')
                        .success(function(data) {
                            $scope.unreadFeedback = data.unreadFeedback ? data.unreadFeedback : null;
                            $scope.unansweredRequests = data.unansweredRequests ? data.unansweredRequests : null;
                            $scope.toBeDelivered = data.toBeDelivered ? data.toBeDelivered : null;
                        }
                    );
                };
                update();
                $scope.menuClass = function (path) {
                    var current = $location.path();
                    return current.indexOf(path) == 0 ? "active" : "";
                };

                $rootScope.$on("feedbackRead", function(e, id){
                    update();
                });
                $rootScope.$on("feedbackDelivered", function(e, id){
                    update();
                });
                $rootScope.$on("feedbackSubmitted", function(e, id){
                    update();
                });
            }
        ]
    )
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
                    FeedbackRequest.save(
                        requests,
                        function(value) {
                            Array.prototype.unshift.apply($scope.pendingRequests, value);
                            $scope.potentialReviewers = Employee.potentialReviewers();
                            $scope.search.selectedReviewers = [];
                            Notification.success("Your request will be delivered");
                        },
                        function(httpResponse) {
                            Notification.error("Your feedback request failed. Please try again.");
                        }
                    );
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
    // TODO: Refactor these controllers to a base
    .controller(
        'ReplyToFeedbackRequestCtrl',
        ['$scope', '$rootScope', '$routeParams', '$interval', '$location', '$http', 'FeedbackRequest', 'FeedbackSubmission', 'Notification',
            function ($scope, $rootScope, $routeParams, $interval, $location, $http, FeedbackRequest, FeedbackSubmission, Notification) {
                $scope.request = null;
                $scope.feedback = new FeedbackSubmission({
                    feedback_request: $routeParams.id,
                    excels_at: "",
                    could_improve_on: "",
                    subject: null,
                    confidentiality: null
                });

                FeedbackRequest.get({id: $routeParams.id}, function (response) {
                    $scope.request = response;
                    $scope.feedback.subject = $scope.request.requester.id;
                });

                $http.get('/api/v1/feedback/submissions/confidentiality-options/')
                    .success(function(data) {
                        $scope.confidentialityOptions = data;
                    }
                );

                $scope.cancel = function () {
                    $location.path('/submit');
                };

                $scope.submit = function () {
                    $scope.feedback.$save(
                        function(value) {
                            Notification.success("Your feedback was saved");
                            $rootScope.$broadcast("feedbackSubmitted", value.id);
                            $location.path('/submit');
                        },
                        function(httpResponse) {
                           Notification.error("An error occurred while saving your feedback. Please try again.");
                        }
                    );
                };
            }
        ]
    )
    .controller(
        'SubmitFeedbackCtrl',
        ['$scope', '$rootScope', '$location', '$http', 'Notification', 'Employee', 'FeedbackSubmission',
            function ($scope, $rootScope, $location, $http, Notification, Employee, FeedbackSubmission) {
                $scope.searchText = "";

                $scope.feedback = new FeedbackSubmission({
                    excels_at: "",
                    could_improve_on: "",
                    subject: null,
                    confidentiality: null
                });
                $scope.employees = Employee.query();

                $http.get('/api/v1/feedback/submissions/confidentiality-options/')
                    .success(function(data) {
                        $scope.confidentialityOptions = data;
                    }
                );

                $scope.search = {
                    selectedEmployee: null
                };

                $scope.submit = function () {
                    if(!$scope.search.selectedEmployee) {
                        Notification.warning("You must choose the employee you want to give feedback to.");
                        return;
                    }
                    $scope.feedback.subject = $scope.search.selectedEmployee.id;
                    $scope.feedback.$save(
                        function(value) {
                            Notification.success("Your feedback was saved");
                            $rootScope.$broadcast("feedbackSubmitted", value.id);
                            $location.path('/submit');
                        },
                        function(httpResponse) {
                           Notification.error("An error occurred while saving your feedback. Please try again.");
                        }
                    );
                };
                $scope.cancel = function () {
                    $location.path('/submit');
                };
            }
        ]
    )
    .controller(
        'CoacheesReportCtrl',
        ['$scope', 'CoacheeReport',
            function ($scope, CoacheeReport) {
                CoacheeReport.query({}, function(results) {
                    $scope.report = results;
                });
            }
        ]
    )
    .controller(
        'CoacheeFeedbackCtrl',
        ['$scope', '$rootScope', '$routeParams', '$location', 'CoacheeReport', 'FeedbackSubmission', 'Notification',
            function($scope, $rootScope, $routeParams, $location, CoacheeReport, FeedbackSubmission, Notification) {
                CoacheeReport.get({id: $routeParams.id}, function(data) {
                    $scope.report = data;
                });

                $scope.markDelivered = function(feedback) {
                    FeedbackSubmission.markDelivered(
                        [{id: feedback.id}],
                        function(value) {
                            Notification.success(feedback.subject.full_name + " will receive this feedback.");
                            $rootScope.$broadcast("feedbackDelivered", feedback.id);
                            $location.path('/deliver');
                        },
                        function(httpResponse) {
                            Notification.error("An error occurred while processing your request. Please try again.");
                        })
                };
            }
        ]
    )
    .controller(
        'MyFeedbackCtrl',
        ['$scope', '$location', 'FeedbackSubmission',
            function($scope, $location, FeedbackSubmission) {
                $scope.items = [];
                $scope.noResults = false;

                FeedbackSubmission.mine(
                    {},
                    function(value) {
                        $scope.items = value;
                        $scope.noResults = value.length === 0;
                    }
                );
            }
        ]
    )
    .controller(
        'ViewFeedbackCtrl',
        ['$scope', '$rootScope', '$routeParams', '$location', 'FeedbackSubmission',
            function($scope, $rootScope, $routeParams, $location, FeedbackSubmission) {

                var broadcastItemRead = function() {
                    $rootScope.$broadcast("feedbackRead", data.id);
                };

                FeedbackSubmission.get(
                    {id: $routeParams.id},
                    function(value) {
                        $scope.feedback = value;
                        FeedbackSubmission.markRead([{id: value.id}], broadcastItemRead);
                    }
                );
            }
        ]
    )
;
