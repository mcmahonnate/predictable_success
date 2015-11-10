    angular
        .module('feedback')
        .controller('ProcessSubmissionController', ProcessSubmissionController);

    function ProcessSubmissionController($routeParams, $location, $window, $scope, analytics, Notification, FeedbackSubmissionService, FeedbackDigestService) {
        analytics.trackPage($scope, $location.absUrl(), $location.url());
        var vm = this;
        vm.submissionId = $routeParams.id;
        vm.submission = null;
        vm.form = null;
        vm.addToDigest = addToDigest;
        vm.save = save;
        vm.close = close;
        vm.back = back;

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
