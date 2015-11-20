    angular
        .module('feedback')
        .controller('ProcessSubmissionController', ProcessSubmissionController);

    function ProcessSubmissionController($routeParams, $location, $window, $scope, $rootScope, analytics, Notification, FeedbackSubmissionService, FeedbackDigestService) {
        analytics.trackPage($scope, $location.absUrl(), $location.url());
        var vm = this;
        vm.submissionId = $routeParams.id;
        vm.submission = null;
        vm.form = null;
        vm.addToDigest = addToDigest;
        vm.removeFromDigest = removeFromDigest;
        vm.save = save;
        vm.close = close;
        vm.back = back;
        vm.questions = {
            excelsAtQuestion: $rootScope.customer.feedback_excels_at_question,
            couldImproveOnQuestion: $rootScope.customer.feedback_could_improve_on_question
        };
        activate();

        function activate() {
            getSubmission();
        }

        function getSubmission() {
            return FeedbackSubmissionService.getFeedbackSubmission(vm.submissionId)
                .then(function (data) {
                    vm.submission = data;
                    return vm.submission;
                });
        }

        function checkForUnsavedChanges() {
            if(vm.form.$dirty) {
                if($window.confirm("You have unsaved changes. Would you like to save your changes before closing?")) {
                    save();
                }
            }
        }

        function addToDigest() {
            checkForUnsavedChanges();
            FeedbackDigestService.addSubmissionToCurrentDigest(vm.submission)
                .then(function() {
                    Notification.success("The feedback has been added to the digest.");
                    close();
            });
        }

        function removeFromDigest() {
            FeedbackDigestService.removeSubmissionFromCurrentDigest(vm.submission)
                .then(function() {
                    Notification.success("The feedback has been removed from the digest.");
                    close();
            });
        }

        function save() {
            FeedbackSubmissionService.updateCoachSummary(vm.submission)
                .then(function() {
                    vm.form.$setPristine();
                    Notification.success("Your changes were saved.");
                });
        }

        function close() {
            checkForUnsavedChanges();
            $location.path('/feedback/' + vm.submission.subject.id + '/worksheet');
        }

        function back() {
            $window.history.back();
        }
    }
