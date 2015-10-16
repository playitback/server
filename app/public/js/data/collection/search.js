var angular = require('angular');

module.exports =  angular.module('collection.search', ['model.search'])
    .factory('SearchCollection', ['NgBackboneCollection', 'SearchModel', function(NgBackboneCollection, SearchModel) {
        return Backbone.Collection.extend({

            model: SearchModel,

            url: '/media/search',

            parse: function(response) {
                return response.results || response;
            }

        });
    }]);