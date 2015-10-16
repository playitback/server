var angular = require('angular'),
    app = angular.module('playback');

require('../model/movie');

module.exports = app.factory('MovieCollection',
    ['NgBackboneCollection', 'MovieModel', function(NgBackboneCollection, MovieModel) {
        return NgBackboneCollection.extend({
            searchMode: false,
            model: MovieModel,

            initialize: function(options) {
                this.searchMode = options && options.search || this.searchMode;
            },

            search: function(options) {
                this.searchMode = true;

                return this.fetch(options);
            },

            url: function() {
                if(this.searchMode) {
                    return '/media/movie/search';
                }
                else {
                    return '/media/movie';
                }
            },

            parse: function(response) {
                if(this.searchMode) {
                    return response.results || response;
                }
                else {
                    return response.movie || response;
                }
            }

        });
    }]);