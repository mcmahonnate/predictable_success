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
            quality.selected = true;
            vm.selectedQualities.push(quality);
        }

        function unselect(index) {
            var quality = vm.selectedQualities[index];
            for (var q in vm.cluster.qualities) {
                if (q.id === quality.id) {
                    q.selected = false;
                }
            }
            vm.selectedQualities.splice(index);
            angular.forEach(vm.cluster.qualities, function(q, key) {
                if (q.id === quality.id) {
                    q.selected = false;
                }
            });
        }

        function save() {
            PerceivedQualityService.createPerceivedQualities(vm.selectedQualities, vm.subject, vm.cluster)
                .then(function (data) {
                     Notification.success("Thanks we'll get those to " + vm.subject.first_name + " pronto.");
                     goTo('qualities/perception/my');
            });
        }
    }