angular.module('appRoutes', [])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
    // home page
    .when('/', {
        templateUrl: 'views/mainBody.html',
        controller: 'mainController'
    })
    .when('/http', {
        templateUrl: 'views/mainBody.html',
        controller: 'httpController'
    })
    .when('/mqtt', {
        templateUrl: 'views/mqtt.html',
        controller: 'mqttController'
    })
    .when('/wifi', {
        templateUrl: 'views/wifi.html',
        controller: 'wifiController'
    })
    .when('/balls', {
        templateUrl: 'views/balls.html',
        controller: 'ballsController'
    })
    .when('/records', {
        templateUrl: 'views/records.html',
        controller: 'recordsController'
    })
    .when('/triangle', {
        templateUrl: 'views/triangle.html',
        controller: 'triangleController'
    })
    .when('/simon', {
        templateUrl: 'views/simon.html',
        controller: 'simonController'
    })
    .otherwise({
        templateUrl: 'views/error.html'
    });

    $locationProvider.html5Mode(true);
}]);