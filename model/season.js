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
				var self 	= this,
					seasons = [];

				console.log('create seasons', results.length);
				results.forEach(function(result) {
					self.createWithRemoteResult(show, result, transaction, function(error, season) {
						console.log('created season', error);
						if (error) {
							callback(error, null);
						}
						else {
							seasons.push(season);

							console.log(seasons.length, results.length);

							if (seasons.length === results.length) {
								callback(null, seasons);
							}
						}
					});
				});
			},
			
			createWithRemoteResult: function(show, result, transaction, callback) {
				var self = this;

				// If transaction is a function, it's the callback
				if(typeof transaction == 'function') {
					callback = transaction;
					transaction = null;
				}
				

				self.mapWithRemoteResult(result).save({ transaction: transaction })
					.then(function(season) {
						app.model.Poster.createWithRemoteResult(result, transaction)
							.success(function(poster) {
								season.setPoster(poster, { transaction: transaction })
									.then(function() {
										app.theMovieDb.getSeason(show.remoteId, season.number, function(err, remoteSeason) {
											app.model.Media.createWithRemoteResults(remoteSeason.episodes, transaction, function(episodes) {
												console.log('created episodes');
												season.setEpisodes(episodes, { transaction: transaction }).then(function() {
													console.log('added episodes to season');
													callback(null, season);
												})
												.catch(function(error) {
													console.log('failed to add episodes to season', error);
													callback(error, null);
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
			
			mapWithRemoteResult: function(result) {						
				return this.build({
					number: result.season_number,
					year: moment(result.air_date).format('YYYY')
				});
			}
		}
	});
	
}