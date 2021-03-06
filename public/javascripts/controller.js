(function() {
    var app = angular.module('sidisi', []);

    app.factory('$localstorage', ['$window', function($window) {
        return {
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key, defaultObject) {
                if ($window.localStorage[key] != undefined)
                    return JSON.parse($window.localStorage[key] || defaultObject);
                return defaultObject;
            },
            remove: function(key) {
                $window.localStorage.removeItem(key);
            },
            clear: function() {
                $window.localStorage.clear();
            }
        }
    }]);

    app.controller('IndexController', function($scope, $http, $localstorage, $interval, $sce) {
        var calendarUrl = "https://calendar.google.com/calendar/embed?showTitle=0&showNav=0&showDate=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0&mode=AGENDA&height=600&wkst=2&bgcolor=%23FFFFFF&src=" +
            $localstorage.get('calendar', '5cvs7pm04q5bv2s9d9ua0jgf6k@group.calendar.google.com') +
            "&color=%232952A3&src=%23contacts@group.v.calendar.google.com&color=%232F6309&src=de.german%23holiday%40group.v.calendar.google.com&color=%230F4B38&ctz=Europe%2FBerlin";
        $scope.iframeUrl = $sce.trustAsResourceUrl(calendarUrl);

        $interval(function() {
            getTime();
        }, 2000);

        $interval(function() {
            if ($scope.activecard < ($scope.feeds.length - 1)) {
                $scope.activecard = $scope.activecard + 1;
            } else {
                $scope.activecard = 0;
                $scope.getFeeds();
            }
        }, 20000);

        $interval(function() {
            getWeather();
            var iframe = document.getElementById('calendar');
            iframe.src = iframe.src;
        }, 300000);

        $scope.reload = function() {
            location.reload();
        };

        var getTime = function() {
            var date = new Date();
            var hour = date.getHours();
            var minute = date.getMinutes();

            var time = ((hour < 10) ? " 0" : " ") + hour;
            time += ((minute < 10) ? ":0" : ":") + minute;

            $scope.time = time;
        };

        var getFeeds = function() {
            var url = '/plugins/news/' + $localstorage.get('news', 'welt');
            var options = $localstorage.getObject('newsOptions', {});
            for (var i in options) {
                url += '/' + options[i].value;
            }
            var req = {
                method: 'GET',
                url: '/plugins/news/' + $localstorage.get('news', 'welt')
            };
            $http(req)
                .then(function(result) {
                    $scope.feeds = result.data.feeds;
                });
        };

        var getWeather = function() {
            var url = '/plugins/weather/' + $localstorage.get('weather', 'openweathermap');
            var options = $localstorage.getObject('weatherOptions', [{
                    "value": "London"
                },
                {
                    "value": "888d975eca036d6e210440f202cd6fa5"
                }
            ]);
            for (var i in options) {
                url += '/' + options[i].value;
            }
            var req = {
                method: 'GET',
                url: url
            };
            $http(req)
                .then(function(result) {
                    $scope.weather = result.data;
                });
        };

        $scope.nextFeed = function() {
            if ($scope.activecard < ($scope.feeds.length - 1)) {
                $scope.activecard = $scope.activecard + 1;
            } else {
                $scope.activecard = 0;
            }
        };
        $scope.prevFeed = function() {
            if ($scope.activecard == 0) {
                $scope.activecard = $scope.feeds.length - 1;
            } else {
                $scope.activecard = $scope.activecard - 1;
            }
        };

        getTime();
        getFeeds();
        getWeather();
    });

    app.controller('SettingsController', function($scope, $http, $localstorage) {
        $scope.settings = {};
        $scope.changed = false;

        $scope.$watch('settings', function(newValue, oldValue) {
            if (newValue !== oldValue) {
                $scope.changed = true;
                if (newValue.news !== oldValue.news)
                    delete $scope.settings.newsOptions;
                if (newValue.weather !== oldValue.weather)
                    delete $scope.settings.weatherOptions;
            }
        }, true);

        var getSettings = function() {
            getNewsProviders();
            getWeatherProviders();
            $scope.settings.news = $localstorage.get('news', 'welt');
            $scope.settings.newsOptions = $localstorage.getObject('newsOptions', null);
            $scope.settings.weather = $localstorage.get('weather', 'openweathermap');
            $scope.settings.weatherOptions = $localstorage.getObject('weatherOptions', null);
            $scope.settings.calendar = $localstorage.get('calendar', '');
        };

        $scope.saveSettings = function() {
            $localstorage.set('news', $scope.settings.news);
            if ($scope.settings.newsOptions != null)
                $localstorage.setObject('newsOptions', $scope.settings.newsOptions);
            $localstorage.set('weather', $scope.settings.weather);
            if ($scope.settings.weatherOptions != null)
                $localstorage.setObject('weatherOptions', $scope.settings.weatherOptions);
            $localstorage.set('calendar', $scope.settings.calendar);

            $scope.changed = false;
            var snackbarContainer = document.querySelector('#toast-saved');
            snackbarContainer.MaterialSnackbar.showSnackbar({
                message: 'Changes saved'
            });
        };

        $scope.deleteSettings = function() {
            $localstorage.clear();
            getSettings();
            var snackbarContainer = document.querySelector('#toast-saved');
            snackbarContainer.MaterialSnackbar.showSnackbar({
                message: 'Settings deleted'
            });
        }

        $scope.doSettings = function(action) {
            if (action == "clear") {
                $localstorage.clear();
                getSettings();
              }
        }

        var getNewsProviders = function() {
            var req = {
                method: 'GET',
                url: '/plugins/news/list'
            };
            $http(req)
                .then(function(result) {
                    $scope.newsProviders = result.data.newsProviders;
                });
        };

        var getWeatherProviders = function() {
            var req = {
                method: 'GET',
                url: '/plugins/weather/list'
            };
            $http(req)
                .then(function(result) {
                    $scope.weatherProviders = result.data.weatherProviders;
                });
        };

        getSettings();
    });
})();
