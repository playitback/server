var angular = require('angular');

module.exports =  angular.module('collection.season', ['model.season'])
    .factory('SeasonCollection', ['NgBackboneCollection', 'SeasonModel', function(NgBackboneCollection, SeasonModel) {
        return NgBackboneCollection.extend({
            model: SeasonModel
        });
    }]);