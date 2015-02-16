var Sequelize 	= require('sequelize'),
	moment		= require('moment');

module.exports = function(app) {
	
	var Show = this.sequelize.define('Show', {
		remoteId: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		title: {
			type: Sequelize.STRING,
			allowNull: false
		},
		firstAired: {
			type: Sequelize.DATE,
			allowNull: false
		},
		overview: {
			type: Sequelize.STRING,
			allowNull: true
		}
	}, {
		classMethods: {
		
			getMediaForIndex: function(callback) {
				this.findAll().then(function(medias) {
					var response 		= [];
																
					if(medias.length === 0) {
						callback(response);
						
						return;
					}
					
					medias.forEach(function(media) {
						media.indexInfo(function(_response) {
							response.push(_response);
													
							if(response.length === medias.length) {
								callback(response);
							}
						});
					});
				});
			},
			
			createWithRemoteId: function(remoteId, transaction, callback) {
				var self = this;

				app.theMovieDb.getTv(remoteId, function(error, result) {
					if(error) {
						callback(error, null);
						
						return;
					}
					
					self.createWithRemoteResult(result, transaction, function(error, show) {
						callback(error, show);
					});
				});
			},
			
			createWithRemoteResult: function(result, transaction, callback) {
				var self = this;

				this.find({ where: { remoteId: String(result.id) } }).then(function(show) {
					show = self.mapWithRemoteResult(result, show);

					// Create or update show object
					show.save({ transaction: transaction }).then(function (show) {
						// Attempt to load the poster and delete it before creating new one.
						show.getPoster().then(function(poster) {
							if (poster) {
								poster.destroy({ force: true });
							}

							app.model.Poster.createWithRemoteResult(result, transaction).then(function (poster) {
								show.setPoster(poster, {transaction: transaction}).then(function () {
									app.model.Season.createWithRemoteResults(show, result.seasons, transaction, function (error, seasons) {
										if (error || !seasons) {
											callback(error, null);
										}
										else {
											show.setSeasons(seasons, {transaction: transaction}).then(function () {
												console.log('added seasons to show');
												callback(null, show);
											});
										}
									});
								});
							});
						});
					})
					.catch(function(error) {
						if (transaction) {
							transaction.rollback();

							transaction = null;
						}

						app.log.error('failed to create show with remoteId', result.id, error);

						callback(error, null);
					});
				});
			},
			
			mapWithRemoteResult: function(result, show) {
				if (!show) {
					show = this.build();
				}

				return show.set({
					remoteId:		result.id,
					title: 			result.name,
					firstAired: 	moment(result.first_air_date).toDate(),
					overview:		result.overview
				});
			}
		},
		instanceMethods: {

			/**
			 *
			 * @param callback
			 */
			indexInfo: function(callback) {
				var response 	= this.toJSON(),
					self		= this;

				this.getPoster().then(function(poster) {
					if (poster) {
						response.poster = poster.values;
					}

					self.watchedStats(function(stats) {
						response.stats = stats;
						
						callback(response);
					});
				});
			},

			/**
			 *
			 * @param callback
			 */
			watchedStats: function(callback) {
				var self = this,
					stats = {
						watchedCount: 0,
						episodeCount: 0
					};
			
				this.totalEpisodeCount(function(count) {
					stats.episodeCount = count;

					self.watchedEpisodeCount(function(count) {
						stats.watchedCount = count;
						
						callback(stats);
					});
				});
			},

			/**
			 *
			 * @param callback
			 */
			totalEpisodeCount: function(callback) {
				app.model.sequelize
					.query('SELECT COUNT(m.id) AS count ' +
						'FROM Seasons s ' +
						'JOIN Media m ON m.SeasonId = s.Id ' +
						'WHERE s.ShowId = \'' + this.id + '\' AND ' +
							'm.watchStatus != \'' + app.model.Media.WatchStatus.Watched + '\'', null, {
						plain: true,
						raw: true
					})
					.then(function(rows) {
						callback(rows.count);
					});
			},

			/**
			 *
			 * @param callback
			 */
			watchedEpisodeCount: function(callback) {
				app.model.sequelize
					.query(
						'SELECT COUNT(m.id) AS count ' +
						'FROM Seasons s ' +
						'JOIN Media m ON m.SeasonId = s.Id ' +
						'WHERE s.ShowId = \'' + this.id + '\' AND ' +
							'm.watchStatus = \'' + app.model.Media.WatchStatus.Watched + '\'',
						null,
						{
							plain: true,
							raw: true
						}
					)
					.then(function(rows) {
						callback(rows.count);
					});
			},

			/**
			 *
			 */
			dropboxData: function() {

			}
		}
	});
	
	return Show;
	
}