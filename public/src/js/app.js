var app = angular.module('iotApp', [
    'ngRoute',
    'colorpicker.module',
    'appRoutes',
    'mainCtrl',
    'httpCtrl',
    'mqttCtrl',
    'wifiCtrl',
    'ballsCtrl',
    'triangleCtrl'
]);

app.config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$routeProvider',
    function($controllerProvider, $compileProvider, $filterProvider, $provide, $routeProvider) {
    app.register = {
        controller: $controllerProvider.register,
        directive: $compileProvider.directive,
        filter: $filterProvider.register,
        factory: $provide.factory,
        service: $provide.service
    };

    $routeProvider
    .when('/activity/:name', {
        templateUrl: function(rd) {
            return 'src/activity/views/' + rd.name + '.html';
        },
        resolve:  {
            load: ['$q', '$route', '$rootScope', function($q, $route, $rootScope) {
                var deferred = $q.defer();

                var dependencies = [
                    'dist/js/' + $route.current.params.name + 'Ctrl.min.js'
                ];

                $script(dependencies, function () {
                    $rootScope.$apply(function() {
                        deferred.resolve();
                    });
                });
                return deferred.promise;
            }
        ]}
    });
}]);
