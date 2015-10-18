var Sequelize = require('sequelize');

module.exports = function(app) {

	var self = this,
        sequelize = this.get('sequelize'),
        theMovieDb = this.get('theMovieDb');
	
	return sequelize.define('Poster', {
		url: {
			type: Sequelize.STRING
		}
	}, {
		classMethods: {
			createWithRemoteResult: function(result, transaction, key) {
				return this.mapWithRemoteResult(result, key).save({ transaction: transaction });
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
						
				return app.model.Poster.build({
					url: posterUri ? this.cachePosterWithUrl(theMovieDb.posterUrl(posterUri)) : null
				});
			},
			
			cachePosterWithUrl: function(url) {
				// TODO: Get poster configuration and cache the sizes we need.
				return url;
			}
		}
	});

};