
var app = angular.module('educationVideos', ['ionic', 'ngResource']);

// trust as url - http://stackoverflow.com/questions/20049261/sce-trustasresourceurl-globally
app.filter('iframeUrl', ['$sce', function($sce) {
    return function(videoUrl) {
        return $sce.trustAsResourceUrl("http://www.screencast.com/users/Graham_Woods/folders/Education/media/" + videoUrl + "/embed");
    };
}]);

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.backButton.previousTitleText(false);
    $stateProvider
        .state('list', {
            url: '/',
            templateUrl: 'views/list.html',
            controller: 'ListCtrl'
        })
        .state('video', {
            url: '/video/:id',
            templateUrl: 'views/video.html',
            controller: 'VideoCtrl'
        });
    $urlRouterProvider.otherwise('/');
});

// cache data - http://curran.github.io/screencasts/introToAngular/exampleViewer/#/42
app.factory('CachedVideos', ['$http',
    function($http) {
        var cachedData;

        function getData(callback) {
            if (cachedData) {
                callback(cachedData);
            } else {
                $http.get('data.json').success(function(data) {
                    cachedData = data;
                    callback(data);
                });
            }
        }

        return {
            list: getData,
            find: function(id, callback) {
                getData(function(data) {
                    var Video = data.filter(function(entry) {
                        return entry.id === id;
                    })[0];
                    callback(Video);
                });
            }
        };
    }
]);

app.controller('ListCtrl', ['$scope', '$http', 'CachedVideos',
    function($scope, $http, CachedVideos) {
        CachedVideos.list(function(CachedVideos) {
            $scope.list_data = CachedVideos;
        });
    }
]);

app.controller('VideoCtrl', ['$scope', '$state', '$window', 'CachedVideos',
    function($scope, $state, $window, CachedVideos) {
        CachedVideos.find($state.params.id, function(Video) {
            $scope.video_data = Video;
        });
        $scope.device_height = $window.innerHeight - 80;
    }
]);

app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});