var angular = require('angular'),
    moment = require('moment');

module.exports = angular.module('playback.data')
    .factory('MovieModel', ['MediaModel', function(MediaModel) {
        return MediaModel.extend({
            label: function() {
                return this.get('name');
            },

            url: function() {
                return '/media/movie/' + this.id;
            },

            parse: function(response) {
                response = response.movie || response;

                if(typeof response.availableDate != 'undefined') {
                    response.availableDate = moment(response.availableDate);
                }

                return response;
            }
        });
    }]);