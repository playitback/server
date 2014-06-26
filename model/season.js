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
						self.model.Poster.createWithRemoteResult(remoteSeason)
							.success(function(poster) {
								season.setPoster(poster)
									.success(function() {
										self.theMovieDb.getSeason(show.id, season.number, function(remoteSeason) {
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
					number: result.SeasonNumber,
					year: moment(result.FirstAired).format('YYYY')
				};
			}
		}
	});
	
}