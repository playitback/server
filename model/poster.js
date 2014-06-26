var Sequelize = require('sequelize');

module.exports = function() {

	var self = this;
	
	return this.sequelize.define('Poster', {
		url: {
			type: Sequelize.STRING
		}
	}, {
		classMethods: {
			createWithRemoteResult: function(result, callback) {
				return this.create(this.mapWithRemoteResult(result));
			},
			
			mapWithRemoteResult: function(result, key) {
				var posterUri = null;
				
				if(typeof key != 'undefined') {
					if(typeof result[key] === 'string') {
						posterUri = result[key];
					}
				}
				else if(typeof result.still_path === 'string') {
					posterUri = result.still_path;
				}
				else if(typeof result.poster_path === 'string') {
					posterUri = result.poster_path;
				}
				
				if(!posterUri) {
					throw 'Poster URI not found';
				}
						
				return {
					url: this.cachePosterWithUrl(self.theMovieDb.posterUrl(posterUri))
				};
			},
			
			cachePosterWithUri: function(uri) {
				// @TODO: Get poster configuration and cache the sizes we need.
				return url;
			}
		}
	});

};