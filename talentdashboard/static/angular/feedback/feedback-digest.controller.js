    angular
        .module('feedback')
        .controller('FeedbackDigestController', FeedbackDigestController);

    function FeedbackDigestController($routeParams, $window, $location, $scope, $rootScope, $modal, analytics, FeedbackSubmissionService, FeedbackDigestService, Notification) {
        analytics.trackPage($scope, $location.absUrl(), $location.url());
        var vm = this;
        vm.updateExcelsAtHelpfulness = updateExcelsAtHelpfulness;
        vm.updateCouldImproveOnWasHelpful = updateCouldImproveOnWasHelpful;
        vm.digestId = $routeParams.id;
        vm.digest = null;
        vm.getDigest = getDigest;
        vm.printDigest = printDigest;
        vm.shareDigest = shareDigest;
        vm.goTo = goTo;
        vm.coach = null;
        vm.employee = null;
        vm.questions = {
            excelsAtQuestion: $rootScope.customer.feedback_excels_at_question,
            couldImproveOnQuestion: $rootScope.customer.feedback_could_improve_on_question
        };
        activate();

        function activate() {
            getDigest();
        }

        function getDigest() {
            return FeedbackDigestService.getDigest(vm.digestId)
                .then(function (data) {
                    vm.digest = data;
                    vm.coach = vm.digest.delivered_by;
                    vm.employee = vm.digest.subject;
                    return vm.digest;
                })
                .catch(function() {
                    Notification.error("You don't have access to this feedback digest.");
                    $location.path('/feedback/');
                });
        }

        function updateExcelsAtHelpfulness(submission) {
            FeedbackSubmissionService.updateExcelsWasHelpful(submission)
                .then(function (data) {
                    submission.excels_at_helpful = data.excels_at_helpful;
                    var reviewer = submission.reviewer ? submission.reviewer.first_name : 'Anonymous';
                    Notification.success("Thanks! We'll get that to " + reviewer + " right away.");
                })
                .catch(function() {
                    Notification.error("Something went wrong.");
                });
        }

        function updateCouldImproveOnWasHelpful(submission) {
            FeedbackSubmissionService.updateCouldImproveOnWasHelpful(submission)
                .then(function (data) {
                    submission.could_improve_on_helpful = data.could_improve_on_helpful;
                    var reviewer = submission.reviewer ? submission.reviewer.first_name : 'Anonymous';
                    Notification.success("Thanks! We'll get that to " + reviewer + " right away.");
                })
                .catch(function() {
                    Notification.error("Something went wrong.");
                });
        }        

        function shareDigest() {
            analytics.trackEvent($scope, $location.absUrl(), 'Feedback Share', 'click', vm.employee.id);
            var modalInstance = $modal.open({
                animation: true,
                windowClass: 'xx-dialog fade zoom',
                backdrop: 'static',
                templateUrl: '/static/angular/feedback/partials/_modals/share-feedback.html',
                controller: 'ShareFeedbackController as share',
                resolve: {
                    digest: function () {
                        return vm.digest
                    }
                }
            });
        }

        function printDigest() {
            $window.print();
        }

        function goTo(path) {
            $location.path(path);
        };
    }
