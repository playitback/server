var angular = require('angular');

module.exports =  angular.module('collection.season', ['model.show'])
    .factory('ShowCollection', ['NgBackboneCollection', 'ShowModel', function(NgBackboneCollection, ShowModel) {
        return NgBackboneCollection.extend({

            searchMode: false,

            model: ShowModel,

            initialize: function(options) {
                this.searchMode = options && options.search || this.searchMode;
            },

            search: function(options) {
                this.searchMode = true;

                return this.fetch(options);
            },

            url: function() {
                if(this.searchMode) {
                    return '/media/tv/search';
                }
                else {
                    return '/media/tv';
                }
            },

            parse: function(response) {
                if(this.searchMode) {
                    return response.results || response;
                }
                else {
                    return response.tv || response;
                }
            }

        });
    }]);