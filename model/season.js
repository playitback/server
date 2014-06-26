var Sequelize 	= require('sequelize'),	
	moment		= require('moment');

module.exports = Season = function() {
	
	var self = this;
	
	return this.sequelize.define('Season', {
		number: {
			type: Sequelize.INTEGER
		},
		year: {
			type: Sequelize.INTEGER
		}
	}, {
		classMethods: {
			createWithRemoteResults: function(show, results, callback) {
				var _self 	= this,
					seasons = [];
			
				results.forEach(function(result) {
					_self.createWithRemoteResult(show, result, function(season) {
						seasons.push(season);
						
						if(seasons.length === results.length) {
							callback(seasons);
						}
					});
				});
			},
			
			createWithRemoteResult: function(show, result, callback) {
				var _self = this;
			
				_self.create(_self.mapWithRemoteResult(result))
					.success(function(season) {
						self.model.Poster.createWithRemoteResult(result)
							.success(function(poster) {
								season.setPoster(poster)
									.success(function() {
										self.theMovieDb.getSeason(show.remoteId, season.number, function(err, remoteSeason) {
											self.model.Media.createWithRemoteResults(remoteSeason.episodes, function(episodes) {
												season.setEpisodes(episodes)
													.success(function() {
														callback(season);
													});
											});
										});
									});
							});
					});
			},
			
			mapWithRemoteResult: function(result) {						
				return {
					number: result.season_number,
					year: moment(result.air_date).format('YYYY')
				};
			}
		}
	});
	
}