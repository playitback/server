var angular = require('angular'),
    app = angular.module('playback');

require('./core');

module.exports = app.factory('MediaModel', ['CoreModel', function(CoreModel) {
	
	/**
	 * Doesn't make perfect sense as Show will subclass this, but this represents visible media
	 */
	
	return CoreModel.extend({

		status: function() {
			return this.watchedStatusClassName();
		}
			
	});

}]);