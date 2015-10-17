var angular = require('angular'),
    moment = require('moment');

module.exports = angular.module('playback.data')
    .factory('ShowModel', ['CoreModel', function(CoreModel) {
        return CoreModel.extend({

            label: function() {
                return this.get('title') + ' (' + this.get('first_aired').format('YYYY') + ')';
            },

            parse: function(response) {
                response = response.tv || response;

                if(typeof response.first_aired != 'undefined') {
                    response.first_aired = moment(response.first_aired);
                }
                if (typeof response.seasons == 'object' && typeof response.seasons.length == 'number') {
                    response.seasons = new SeasonCollection(response.seasons);
                }

                return response;
            },

            url: function() {
                return '/media/tv' + (this.has('id') ? '/' + this.get('id') : '');
            }
	    });
    }]);