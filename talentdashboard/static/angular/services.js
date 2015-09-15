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
}])
.factory('privacyMode', function($cookieStore, $http){
    return function(scope) {
    
        // check if privacy cookie exists
        var privacy = $cookieStore.get('privacy');

        if (privacy) {
            // indicate privacy mode is on in navigation
            document.getElementsByClassName("privacy-mode")[0].className = 'privacy-mode privacy-mode-active';

            setTimeout(function(){                 

                // Private images    
                var images = document.getElementsByClassName('headshot-image');
                for(var i = 0; i < images.length; i++) {
                    var img = images[i];

                        $cookieStore.put('privacy', true);
                        img.setAttribute('data-original-src', img.src);
                        img.src = 'http://theoldreader.com/kittens/200/200/?foo=' + [i];
                        console.log('Turning on cat mode');  
                }   

                // Private names
                var employeeName = document.getElementsByClassName("sensitive-text");
                for(var i = 0; i < employeeName.length; i++) {   
                    var name = employeeName[i];
                    name.className = 'sensitive-text sensitive-text-active';
                }
            }, 2000);
        }    
    }
});

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