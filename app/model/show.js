var Sequelize 	= require('sequelize'),
	moment		= require('moment');

module.exports = function() {

    var sequelize = this.get('sequelize'),
        theMovieDb = this.get('theMovieDb'),
        posterModel = this.get('model.poster'),
        seasonModel = this.get('model.season'),
        mediaModel = this.get('model.media');
	
	var Show = sequelize.define('Show', {
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

			indexInclude: function() {
				return [
					posterModel
				];
			},

			fullInclude: function() {
				return [
					posterModel,
                    {
                        model: posterModel,
                        as: 'backdrop'
                    },
					{
						model: seasonModel,
						as: 'Seasons',
						include: [
							posterModel,
							{
								model: mediaModel,
								as: 'Episodes',
								include: [
									{
										model: posterModel,
										as: 'Still'
									}
								]
							}
						]
					}
				];
			},

			getMediaForIndex: function(callback) {
				this.findAll({ include: this.fullInclude() }).then(function(medias) {
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

				theMovieDb.getTv(remoteId, function(error, result) {
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
						self.createPosterWithRemoteResult(show, result, transaction, callback);
					})
					.catch(function(error) {
						if (transaction) {
							transaction.rollback();

							transaction = null;
						}

						log.error('failed to create show with remoteId', result.id, error);

						callback(error, null);
					});
				});
			},

            createPosterWithRemoteResult: function(show, result, transaction, callback) {
                var self = this;

                // Attempt to load the poster and delete it before creating new one.
                show.getPoster().then(function(poster) {
                    if (poster) {
                        poster.destroy({ force: true });
                    }

                    posterModel.createWithRemoteResult(result, transaction, 'backdrop_path').then(function (poster) {
                        show.setPoster(poster, {transaction: transaction}).then(function () {
                            self.createBackdropWithRemoteResult(show, result, transaction, callback);
                        });
                    });
                });
            },

            createBackdropWithRemoteResult: function(show, result, transaction, callback) {
                var self = this;

                // Attempt to load the poster and delete it before creating new one.
                show.getBackdrop().then(function(backdrop) {
                    if (backdrop) {
                        backdrop.destroy({ force: true });
                    }

                    posterModel.createWithRemoteResult(result, transaction).then(function (backdrop) {
                        show.setBackdrop(backdrop, { transaction: transaction }).then(function () {
                            self.createSeasonsWithRemoteResult(show, result, transaction, callback);
                        });
                    });
                });
            },

            createSeasonsWithRemoteResult: function(show, result, transaction, callback) {
                app.model.Season.createWithRemoteResults(show, result.seasons, transaction, function (error, seasons) {
                    if (error || !seasons) {
                        callback(error, null);
                    }
                    else {
                        show.setSeasons(seasons, {transaction: transaction}).then(function () {
                            callback(null, show);
                        });
                    }
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
				var response = this.toJSON();

				this.watchedStats(function(stats) {
					response.stats = stats;

					callback(response);
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
				sequelize.query('SELECT COUNT(m.id) AS count ' +
						'FROM Seasons s ' +
						'JOIN Media m ON m.SeasonId = s.Id ' +
						'WHERE s.ShowId = \'' + this.id + '\' AND ' +
							'm.watchStatus != \'' + mediaModel.WatchStatus.Watched + '\'', null, {
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
                sequelize.query(
                    'SELECT COUNT(m.id) AS count ' +
                    'FROM Seasons s ' +
                    'JOIN Media m ON m.SeasonId = s.Id ' +
                    'WHERE s.ShowId = \'' + this.id + '\' AND ' +
                        'm.watchStatus = \'' + mediaModel.WatchStatus.Watched + '\'',
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
};