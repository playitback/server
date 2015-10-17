var angular = require('angular');

require('./core');

module.exports = angular.module('playback.data')
    .factory('SeasonModel', ['CoreModel', function(CoreModel) {
	    return CoreModel.extend({

	    });
    }]);