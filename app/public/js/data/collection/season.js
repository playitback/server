var angular = require('angular');

module.exports = angular.module('playback.data')
    .factory('SeasonCollection', ['NgBackboneCollection', 'SeasonModel', function(NgBackboneCollection, SeasonModel) {
        return NgBackboneCollection.extend({
            model: SeasonModel
        });
    }]);