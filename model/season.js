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
			createWithRemoteResults: function(show, results, transaction, callback) {
				var _self 	= this,
					seasons = [];

				results.forEach(function(result) {
					_self.createWithRemoteResult(show, result, transaction, function(season) {
						seasons.push(season);
						
						if(seasons.length === results.length) {
							callback(seasons);
						}
					});
				});
			},
			
			createWithRemoteResult: function(show, result, transaction, callback) {
				var _self = this;

				// If transaction is a function, it's the callback
				if(typeof transaction == 'function') {
					callback = transaction;
					transaction = null;
				}
			
				_self.create(_self.mapWithRemoteResult(result), { transaction: transaction })
					.success(function(season) {
						self.model.Poster.createWithRemoteResult(result, transaction)
							.success(function(poster) {
								season.setPoster(poster, { transaction: transaction })
									.success(function() {
										self.theMovieDb.getSeason(show.remoteId, season.number, function(err, remoteSeason) {
											self.model.Media.createWithRemoteResults(remoteSeason.episodes, transaction, function(episodes) {
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