var angular = require('angular');

require('angularRoute');
require('backbone');
require('angularBackbone');
require('angularUiRouter');

var app = angular.module('playback', [
    'ui.router', 'ngRoute', 'ngBackbone'
]);

app.filter('sanitize', ['$sce', function($sce) {
    return function(htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    }
}]);

app.config(['$stateProvider', '$urlRouterProvider', function(stateProvider, $urlRouterProvider) {
    // Load routes
    require('./config/routes')(stateProvider);

    // Set default route
    $urlRouterProvider.otherwise('home');
}]);

app.run(function($rootScope) {

});

angular.element(document).ready(function() {
    angular.bootstrap(document, ['playback']);
});
