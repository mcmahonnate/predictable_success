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
        controller: function () {
        },
        controllerAs: 'devzoneComments',
        bindToController: true,
    };

    return directive;
}