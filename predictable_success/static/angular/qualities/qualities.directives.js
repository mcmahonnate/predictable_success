angular
    .module('qualities')
    .directive('packery', ['$rootScope', function($rootScope) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                if($rootScope.packery === undefined || $rootScope.packery === null){
                    console.log('making packery!');
                    $rootScope.packery = new Packery(element[0].parentElement, {itemSelector: '.quality', gutter: 20, columnWidth: '.quality'});
                    $rootScope.packery.bindResize();
                    $rootScope.packery.appended(element[0]);
                    $rootScope.packery.items.splice(1,1); // hack to fix a bug where the first element was added twice in two different positions
                }
                else{
                    $rootScope.packery.appended(element[0]);
                }
                var draggie = new Draggabilly( element[0] );
                $rootScope.packery.bindDraggabillyEvents( draggie );
                $rootScope.packery.layout();
                console.log(element);
            }
        };
    }])