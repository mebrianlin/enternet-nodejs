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
    .otherwise({
        templateUrl: 'views/error.html'
    });

    $locationProvider.html5Mode(true);
}]);