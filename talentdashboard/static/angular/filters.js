angular.module('tdb.filters', []).
filter('noCents', function() {
  return function(value) {
    return value.replace(/\.\d+/, '');
  };
});
