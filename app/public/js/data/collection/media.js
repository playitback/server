var angular = require('angular');

module.exports = angular.module('playback.data')
    .factory('MediaCollection', ['NgBackboneCollection', 'MediaModel', function(NgBackboneCollection, MediaModel) {
        return NgBackboneCollection.Collection.extend({
            model: MediaModel,
            season: null,

            fetchWithSeason: function (season, options) {
                this.season = season;

                this.fetch(options);
            },

            url: function () {
                if (this.season) {
                    return '/media/season/' + this.season.id;
                }
                else {
                    return '/media';
                }
            }
        });
    }]);