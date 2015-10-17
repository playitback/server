module.exports = function($stateProvider) {
    var mediaInfoController = require('../controller/media/info');

    $stateProvider
        .state('home', {
            url: '/home',
            controller: require('../controller/home'),
            templateUrl: 'views/home.html'
        })
        .state('media', {
            url: '/media/:type',
            controller: require('../controller/media/index'),
            templateUrl: 'views/media/index.html'
        })
        .state('mediaInfo', {
            url: '/media/:type/:mediaId',
            controller: mediaInfoController,
            templateUrl: 'views/media/info.html'
        })
        .state('mediaInfoSeason', {
            url: '/media/:type/:mediaId/season/:seasonNumber',
            controller: mediaInfoController,
            templateUrl: 'views/media/season.html'
        })
        .state('settings', {
            url: '/settings/:type?',
            controller: require('../controller/settings'),
            templateUrl: 'views/settings.html'
        })
};
