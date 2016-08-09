angular
    .module('devzones')
    .directive('devzoneComments', devzoneComments);

function devzoneComments() {
    var directive = {
        restrict: 'E',
        templateUrl: "/static/angular/devzones/partials/_widgets/comments.html",
        scope: {
            comments: '=',
            id: '='
        },
        controller: function ($rootScope) {
            var vm = this;
            vm.currentUser = $rootScope.currentUser;
        },
        controllerAs: 'devzoneComments',
        bindToController: true,
    };

    return directive;
}