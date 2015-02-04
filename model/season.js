var Sequelize 	= require('sequelize'),	
	moment		= require('moment');

module.exports = Season = function(app) {

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
				var self 			= this,
					seasons 		= [],
					totalSeasons 	= results.length;

				results.forEach(function(result) {
					self.createWithRemoteResult(show, result, transaction, function(error, season) {
						if (error) {
							callback(error, null);
						}
						else {
							if (season) {
								seasons.push(season);
							}
							else {
								totalSeasons--;
							}

							if (seasons.length === totalSeasons) {
								callback(null, seasons);
							}
						}
					});
				});
			},
			
			createWithRemoteResult: function(show, result, transaction, callback) {
				// If transaction is a function, it's the callback
				if(typeof transaction == 'function') {
					callback = transaction;
					transaction = null;
				}

				this.mapWithRemoteResult(result).save({ transaction: transaction })
					.then(function(season) {
						app.model.Poster.createWithRemoteResult(result, transaction)
							.then(function(poster) {
								season.setPoster(poster, { transaction: transaction })
									.then(function() {
										app.theMovieDb.getSeason(show.remoteId, season.number, function(err, remoteSeason) {
											if (remoteSeason.episodes.length > 0) {
												app.model.Media.createWithRemoteResults(remoteSeason.episodes, transaction, function (episodes) {
													season.setEpisodes(episodes, {transaction: transaction}).then(function () {
														callback(null, season);
													})
													.catch(function (error) {
														callback(error, null);
													});
												});
											}
											else {
												callback(null, null);
											}
										});
									});
							});
					});
			},

			mapWithRemoteResults: function(results) {
				var built = [];

				for (var i in results) {
					built.push(this.mapWithRemoteResult(results[i]));
				}

				return built;
			},
			
			mapWithRemoteResult: function(result) {						
				return this.build({
					number: result.season_number,
					year: moment(result.air_date).format('YYYY')
				});
			}
		}
	});
	
}