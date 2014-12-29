var Sequelize = require('sequelize');

module.exports = function() {

	var self = this;
	
	return this.sequelize.define('Poster', {
		url: {
			type: Sequelize.STRING
		}
	}, {
		classMethods: {
			createWithRemoteResult: function(result, transaction) {
				return this.create(this.mapWithRemoteResult(result), { transaction: transaction });
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
						
				return {
					url: posterUri ? this.cachePosterWithUrl(self.theMovieDb.posterUrl(posterUri)) : null
				};
			},
			
			cachePosterWithUrl: function(url) {
				// @TODO: Get poster configuration and cache the sizes we need.
				return url;
			}
		}
	});

};