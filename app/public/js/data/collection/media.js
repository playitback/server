var angular = require('angular'),
    app = angular.module('playback');

module.exports = app.factory('MediaCollection', ['NgBackboneCollection', 'MediaModel', function(NgBackboneCollection, MediaModel) {
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