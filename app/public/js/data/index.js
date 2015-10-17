var angular = require('angular');

var container = angular.module('playback.data', ['ngBackbone']);

var models = ['core', 'media', 'movie', 'search', 'season', 'setting', 'show'],
    collections = ['media', 'movie', 'search', 'season', 'settings', 'show'];

for (var m in models) {
    require('./model/' + models[m]);
}

for (var c in collections) {
    require('./collection/' + collections[c]);
}