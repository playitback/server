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
					self.createWithRemoteResult(show, result, transaction, function (error, season) {
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

				var self = this;

				show.getSeasons({ where: { number: result.season_number }}).then(function(seasons) {
					var season;
					if (typeof seasons == 'object' && typeof seasons.length == 'number' && seasons.length > 0) {
						season = seasons[0];
					}

					season = self.mapWithRemoteResult(result, season);

					season.save({ transaction: transaction }).then(function (season) {
						season.getPoster().then(function(poster) {
							if (poster) {
								poster.destroy({ force: true });
							}

							app.model.Poster.createWithRemoteResult(result, transaction)
								.then(function (poster) {
									season.setPoster(poster, {transaction: transaction})
										.then(function () {
											app.theMovieDb.getSeason(show.remoteId, season.number, function (err, remoteSeason) {
												if (remoteSeason.episodes.length > 0) {
													app.model.Media.createWithRemoteResults(remoteSeason.episodes, transaction, season, show, function (episodes) {
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
			
			mapWithRemoteResult: function(result, season) {
				if (!season) {
					season = this.build();
				}

				return season.set({
					number: result.season_number,
					year: moment(result.air_date).format('YYYY')
				});
			}
		}
	});
	
}