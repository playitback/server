var angular = require('angular');

module.exports = angular.module('playback.data')
    .factory('SeasonCollection', ['NgBackboneCollection', 'SettingModel', function(NgBackboneCollection, SettingModel) {
        return NgBackboneCollection.extend({
            model: SettingModel,

            url: function() {
                return '/settings';
            },

            parse: function(response) {
                return response.settings || response;
            }

        });
    }]);