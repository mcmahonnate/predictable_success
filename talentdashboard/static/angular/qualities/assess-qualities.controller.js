    angular
        .module('qualities')
        .controller('AssessQualitiesController', AssessQualitiesController);

    function AssessQualitiesController(analytics, $location, $scope, Notification, QualityClusterService, PerceivedQualityService) {
        analytics.trackPage($scope, $location.absUrl(), $location.url());
        var vm = this;

        vm.clusters = []
        vm.cluster = null;
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
        vm.getLimit = getLimit;

        activate();

        function activate() {
            getEmployees();
            getClusters();
        }

        function stepNext() {
            vm.panel_index++;
            console.log(vm.panel_index);
        }

        function stepBack() {
            vm.panel_index--;
            console.log(vm.panel_index);
        }

        function goTo(path) {
            $location.path(path);

            /* Cancel out and remove modal */
            $('.modal').modal('hide');
            $('.modal-backdrop').remove();
            $('body').removeClass('modal-open');
        };

        function getLimit(arrayLength) {
            var limit = arrayLength/2;
            if (!(arrayLength%2==0)) {
                limit++;
            }
            return limit;

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
                    return vm.cluster;
                });
        }

        function select(quality) {
            if (!quality.selected) {
                console.log('select');
                quality.selected = true;
                vm.selectedQualities.push(quality);
                console.log(vm.selectedQualities);
            } else {
                console.log('unselect');
                unselect(quality)
                console.log(vm.selectedQualities);
            }
        }

        function unselect(quality)
        {
            var index;
            quality.selected = false;
            angular.forEach(vm.selectedQualities, function(q, key) {
                if (q.id === quality.id) {
                    index = key;
                    console.log(index);
                }
            });
            vm.selectedQualities.splice(index, 1);
        }

        function save() {
            console.log(vm.selectedQualities);
            PerceivedQualityService.createPerceivedQualities(vm.selectedQualities, vm.subject, vm.cluster)
                .then(function (data) {
                    console.log(data);
                     Notification.success("Thanks we'll get those to " + vm.subject.first_name + " pronto.");
                     goTo('qualities/perception/my');
            });
        }
    }