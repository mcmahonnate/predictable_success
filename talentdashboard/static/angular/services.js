angular.module('tdb.services', ['ngResource'])

.factory('fileReader', ['$q', '$log', function ($q, $log) {

        var onLoad = function(reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.resolve(reader.result);
                });
            };
        };

        var onError = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result);
                });
            };
        };

        var onProgress = function(reader, scope) {
            return function (event) {
                scope.$broadcast("fileProgress",
                    {
                        total: event.total,
                        loaded: event.loaded
                    });
            };
        };

        var getReader = function(deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            reader.onprogress = onProgress(reader, scope);
            return reader;
        };

        var readAsDataURL = function (file, scope) {
            var deferred = $q.defer();

            var reader = getReader(deferred, scope);
            reader.readAsDataURL(file);

            return deferred.promise;
        };

        return {
            readAsDataUrl: readAsDataURL
        };
}]);

angular.module('analytics', ['ng'])

.service('analytics', ['$window', function($window) {
    return {
        trackPage: function (scope, absoluteUrl, locationPath) {

          if (absoluteUrl.indexOf("0.0.0.0") < 0 && absoluteUrl.indexOf("localhost") < 0) {
            scope.$on('$viewContentLoaded', function(event) {
              $window.ga('send', 'pageview', locationPath);
            });
          } else {
            console.log('not tracked', locationPath);
          }
        }
    };
}]);