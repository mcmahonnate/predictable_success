    angular
        .module('feedback')
        .controller('FeedbackWorksheetController', FeedbackWorksheetController);

    function FeedbackWorksheetController($routeParams, $location, $modal, $window, $scope, $rootScope, analytics, Notification, FeedbackRequestService, FeedbackDigestService) {
        analytics.trackPage($scope, $location.absUrl(), $location.url());
        var vm = this;
        vm.employeeId = $routeParams.id;
        vm.progressReport = null;
        vm.digest = null;
        vm.getFeedbackProgressReport = getFeedbackProgressReport;
        vm.getCurrentDigest = getCurrentDigest;
        vm.save = save;
        vm.deliverDigest = deliverDigest;
        vm.printDigest = printDigest;
        vm.poke = poke;
        vm.showProgressReport = true;
        vm.coach = $rootScope.currentUser.employee;
        vm.employee = null;
        vm.hasExcelsAtSubmissions = false;
        vm.hasCouldImproveOnSubmissions = false;
        vm.hasHelpWithSubmissions = false;
        vm.questions = {
            excelsAtQuestion: $rootScope.customer.feedback_excels_at_question,
            couldImproveOnQuestion: $rootScope.customer.feedback_could_improve_on_question,
            leadershipQuestion: $rootScope.customer.feedforward_leadership_question
        };
        activate();

        function activate() {
            getFeedbackProgressReport();
            getCurrentDigest();
        }

        function poke() {
            $modal.open({
                animation: true,
                windowClass: 'xx-dialog fade zoom',
                backdrop: 'static',
                templateUrl: '/static/angular/feedback/partials/_modals/poke.html',
                controller: 'PokeForFeedbackController as poke',
                resolve: {
                    coach: function () {
                        return vm.coach;
                    },
                    employee: function () {
                        return vm.employee;
                    },
                    requests: function () {
                        return vm.progressReport.unanswered_requests;
                    },
                }
            });
        }

        function getCurrentDigest() {
            return FeedbackDigestService.getCurrentDigestForEmployee(vm.employeeId)
                .then(function (data) {
                    vm.digest = data;
                    vm.coach = vm.digest.delivered_by ? vm.digest.delivered_by : $rootScope.currentUser.employee;
                    angular.forEach(vm.digest.submissions, function(submission) {
                        if (submission.excels_at || submission.excels_at_summarized) {
                            vm.hasExcelsAtSubmissions = true;
                        }
                        if (submission.could_improve_on || submission.could_improve_on_summarized) {
                            vm.hasCouldImproveOnSubmissions = true;
                        }
                        if (submission.help_with || submission.help_with_summarized) {
                            vm.hasHelpWithSubmissions = true;
                        }
                    });
                    return vm.digest;
                })
                .catch(function() {
                    vm.coach = $rootScope.currentUser.employee;
                });;
        }

        function getFeedbackProgressReport() {
            return FeedbackRequestService.getFeedbackProgressReportForEmployee(vm.employeeId)
                .then(function (data) {
                    vm.progressReport = data;
                    vm.employee = vm.progressReport.employee;
                    if (vm.progressReport.all_submissions_not_delivered_and_not_in_digest.length>0 ||
                        vm.progressReport.unanswered_requests.length>0) {
                        vm.showProgressReport = true;
                    }
                    return vm.progressReport;
                })
                .catch(function() {
                    Notification.error("You don't have access to this digest.");
                    $location.path('/feedback/');
                });;
        }

        function save() {
            return FeedbackDigestService.save(vm.digest)
                .then(function (data) {
                    Notification.success("Your changes were saved.")
                });
        }

        function deliverDigest() {
            if($window.confirm("Are you sure you want to deliver this to " + vm.digest.subject.full_name + " now?")) {
                return FeedbackDigestService.deliverDigest(vm.digest)
                    .then(function (data) {
                        Notification.success("The digest will be delivered to " + vm.digest.subject.full_name + ".");
                        $location.path('/my-coachees/');
                    });
            }
        }

        function printDigest() {
            $window.print();
        }
    }
