    angular
        .module('feedback')
        .controller('ProcessSubmissionController', ProcessSubmissionController);

    function ProcessSubmissionController($routeParams, $location, $modal, $scope, $rootScope, $window, analytics, Notification, FeedbackSubmissionService, FeedbackDigestService) {
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

        function _addToDigest() {
            FeedbackDigestService.addSubmissionToCurrentDigest(vm.submission)
                .then(function () {
                    Notification.success("The feedback has been added to the digest.");
                    back();
                });
        }

        function _removeFromDigest() {
            FeedbackDigestService.removeSubmissionFromCurrentDigest(vm.submission)
                .then(function () {
                    Notification.success("The feedback has been removed from the digest.");
                    back();
                });
        }

        function addToDigest() {
            if(vm.form.$dirty) {
                save(_addToDigest);
            } else {
                _addToDigest()
            }
        }

        function removeFromDigest() {
            if(vm.form.$dirty) {
                confirm(_removeFromDigest);
            } else {
                _removeFromDigest()
            }
        }

        function save(callbackFunction) {
            FeedbackSubmissionService.updateCoachSummary(vm.submission)
                .then(function() {
                    vm.form.$setPristine();
                    Notification.success("Your changes were saved.");
                    if (callbackFunction) {
                        callbackFunction();
                    };
                });
        }

        function close() {
            if(vm.form.$dirty) {
                confirm(back);
            } else {
                back()
            }
        }

        function back() {
            console.log('BACK');
            $window.history.back();
        }


        function confirm(callbackFunction) {
            var modalInstance = $modal.open({
                animation: true,
                windowClass: 'xx-dialog fade zoom',
                backdrop: 'static',
                templateUrl: '/static/angular/feedback/partials/_modals/submission-is-dirty.html',
                controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {
                    $scope.close = function(value) {
                        $modalInstance.close(value);
                    }
                }],
                resolve: {}
            });
            modalInstance.result.then(
                function (value) {
                    if (value) {
                        save(callbackFunction)
                    } else {
                        callbackFunction()
                    }
                }
            );
        }
    }
