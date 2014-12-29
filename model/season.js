var Sequelize 	= require('sequelize'),	
	moment		= require('moment');

module.exports = Season = function() {
	
	var app = this;
	
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

				results.forEach(function(result) {
					self.createWithRemoteResult(show, result, transaction, function(season) {
						seasons.push(season);
						
						if(seasons.length === results.length) {
							callback(seasons);
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
			
				this.create(self.mapWithRemoteResult(result), { transaction: transaction })
					.success(function(season) {
						app.model.Poster.createWithRemoteResult(result, transaction)
							.success(function(poster) {
								season.setPoster(poster, { transaction: transaction })
									.then(function() {
										app.theMovieDb.getSeason(show.remoteId, season.number, function(err, remoteSeason) {
											app.model.Media.createWithRemoteResults(remoteSeason.episodes, transaction, function(episodes) {
												season.setEpisodes(episodes)
													.then(function() {
														callback(season);
													})
													.catch(function(error) {
														transaction.rollback();

														app.log.error('failed to set episodes on season', season.id, error);
													});
											});
										});
									})
									.catch(function(error) {
										transaction.rollback();

										app.log.error('failed to set poster on season', season.id, error);
									});
							})
							.catch(function(error) {
								transaction.rollback();

								app.log.debug('failed to create poster', error);
							});
					})
					.catch(function(error) {
						transaction.rollback();

						app.log.error('failed to create season with remote id', season.remoteId, error);
					})
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