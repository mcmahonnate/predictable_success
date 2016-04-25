    angular
        .module('qualities')
        .controller('AssessQualitiesController', AssessQualitiesController);

    function AssessQualitiesController(analytics, $location, $scope, $routeParams, $rootScope, Notification, QualityClusterService, PerceivedQualityService, PerceptionRequestService) {
        analytics.trackPage($scope, $location.absUrl(), $location.url());
        var vm = this;

        vm.clusters = []
        vm.cluster = null;
        vm.message = '';
        vm.unsolicited = false;
        vm.selfAssessment = false;
        vm.selectedCluster = null;
        vm.employees = [];
        vm.qualities = [];
        vm.selectedQualities = [];
        vm.getCluster = getCluster;
        vm.select = select;
        vm.unselect = unselect;
        vm.save = save;
        vm.subject = null;
        vm.panel_index = 0;
        vm.stepNext = stepNext;
        vm.stepBack = stepBack;
        vm.goTo = goTo;
        vm.array1Start = 0;
        vm.array1End = 0;
        vm.array2Start = 0;
        vm.array2End = 0;
        vm.array3Start = 0;
        vm.array3End = 0;
        activate();

        function activate() {
            if ($routeParams.requestId) {
                getRequest();
            } else if ($routeParams.employeeId && $routeParams.categoryId) {
                if ($routeParams.employeeId = 'self') {
                    getCluster($routeParams.categoryId);
                    vm.subject = $rootScope.currentUser.employee;
                    vm.selfAssessment = true;
                }
            }
            else {
                vm.unsolicited = true;
                getEmployees();
                getClusters();
            }
        }

        function getRequest() {
            PerceptionRequestService.getRequest($routeParams.requestId)
                .then(function(request){
                    getCluster(request.category);
                    vm.subject = request.requester;
                    vm.message = request.message;
                },
                function() {
                    Notification.error("You don't have access to this request.")
                }
            )
        }

        function stepNext() {
            vm.panel_index++;
        }

        function stepBack() {
            vm.panel_index--;
        }

        function goTo(path) {
            $location.path(path);

            /* Cancel out and remove modal */
            $('.modal').modal('hide');
            $('.modal-backdrop').remove();
            $('body').removeClass('modal-open');
        };

        function setArrayLimits(arrayLength) {
            var arrayLimit = Math.floor(arrayLength/3);;
            if (!(arrayLength%3==0)) {
                arrayLimit++;
                vm.array1Start = 0;
                vm.array1End = arrayLimit;
                vm.array2Start = vm.array1End;
                vm.array2End = arrayLimit + arrayLimit;
                vm.array3Start = vm.array2End;
                vm.array3End = arrayLength;
            } else {
                vm.array1Start = 0;
                vm.array1End = arrayLimit;
                vm.array2Start = vm.array1End;
                vm.array2End = arrayLength - arrayLimit;
                vm.array3Start = vm.array2End;
                vm.array3End = arrayLength;
            }

        }

        function getEmployees() {
            return PerceivedQualityService.getEmployees()
                .then(function (employees) {
                    vm.employees = employees;
                    return vm.employees;
                });
        }

        function getClusters() {
            QualityClusterService.getQualityClusters()
                .then(function (data) {
                    vm.clusters = data;
                    return vm.clusters;
                });
        }

        function getCluster(clusterId) {
            QualityClusterService.getQualityCluster(clusterId)
                .then(function (data) {
                    vm.cluster = data;
                    setArrayLimits(vm.cluster.qualities.length);
                    return vm.cluster;
                });
        }

        function select(quality) {
            if (!quality.selected) {
                quality.selected = true;
                vm.selectedQualities.push(quality);
            } else {
                unselect(quality)
            }
        }

        function unselect(quality)
        {
            var index;
            quality.selected = false;
            angular.forEach(vm.selectedQualities, function(q, key) {
                if (q.id === quality.id) {
                    index = key;
                }
            });
            vm.selectedQualities.splice(index, 1);
        }

        function save() {
            console.log(vm.selectedQualities);
            PerceivedQualityService.createPerceivedQualities(vm.selectedQualities, vm.subject, vm.cluster)
                .then(function (data) {
                    if (vm.selfAssessment) {
                        Notification.success("Thanks!");
                    } else {
                        Notification.success("Thanks we'll get those to " + vm.subject.first_name + " pronto.");
                    }
                    goTo('qualities/perception/my');
            });
        }
    }