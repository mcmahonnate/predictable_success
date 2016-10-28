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
        setDimension: function (dimensionValue) {
            scope.$on('$viewContentLoaded', function(event) {
                switch (dimensionValue) {
                    case 'Prospect':
                        $window.ga('set', 'dimension1', dimensionValue);
                        break;
                    case 'Paid Member':
                        $window.ga('set', 'dimension2', dimensionValue);
                        break;
                    case 'Team Member':
                        $window.ga('set', 'dimension3', dimensionValue);
                        break;
                }
            });
        },
        setPage: function (locationPath) {
            $window.ga('set', 'page', locationPath);
            var host = $window.location.host;
            if (host.indexOf("0.0.0.0") > 0 || host.indexOf("localhost") > 0) {
                console.log(locationPath);
            }
        },
        trackPage: function () {
            var host = $window.location.host;
            if (host.indexOf("0.0.0.0") < 0 && host.indexOf("localhost") < 0) {
                $window.ga('send', 'pageview');
            } else {
                console.log('Page not tracked');
            }
        },
        trackEvent: function (category, action, label) {
            var host = $window.location.host;
            if (host.indexOf("0.0.0.0") < 0 && host.indexOf("localhost") < 0) {
                $window.ga('send', {
                    hitType: 'event',
                    eventCategory: category,
                    eventAction: action,
                    eventLabel: label
                });
            } else {
                console.log('Event not tracked', action);
            }
        }
    };
}]);