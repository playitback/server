var angular = require('angular');

require('./core');

module.exports = angular.module('playback.data')
    .factory('MediaModel', ['CoreModel', function(CoreModel) {
	
        /**
         * Doesn't make perfect sense as Show will subclass this, but this represents visible media
         */
        return CoreModel.extend({

            status: function() {
                return this.watchedStatusClassName();
            }

        });
    }]);