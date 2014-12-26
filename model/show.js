var Sequelize 	= require('sequelize'),
	moment		= require('moment');

module.exports = function() {
	
	var self = this;
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
		}
	}, {
		classMethods: {
		
			getMediaForIndex: function(callback) {
				var _self = this;
							
				this.findAll().success(function(medias) {
					var response 		= [],
						checkedShows 	= 0;
																
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
				var _self = this;
				
				self.theMovieDb.getTv(remoteId, function(err, result) {
					if(err) {
						callback(err);
						
						return;
					}
					
					_self.createWithRemoteResult(result, transaction, function(show) {
						callback(show);
					});
				});
			},
			
			createWithRemoteResult: function(result, transaction, callback) {
				if(typeof transaction == 'function') {
					callback = transaction;
					transaction = null;
				}

				this.create(this.mapWithRemoteResult(result), { transaction: transaction })
					.success(function(show) {
						self.model.Poster.createWithRemoteResult(result, transaction)
							.success(function(poster) {
								show.setPoster(poster)
									.success(function() {
										self.model.Season.createWithRemoteResults(show, result.seasons, transaction, function(seasons) {
											show.setSeasons(seasons).success(function() {
												callback(show);
											});
										});
									});
							});
					});
			},
			
			mapWithRemoteResult: function(result) {
				return this.build({
					remoteId:		result.id,
					title: 			result.name,
					firstAired: 	moment(result.first_air_date).toDate(),
					type:			self.model.Media.Type.TV
				});
			}
		},
		instanceMethods: {
			indexInfo: function(callback) {
				var _response 	= this.values,	
					_self		= this;
							
				this.getPoster().success(function(poster) {
					if(poster) {
						_response.poster = poster.values;
					}
										
					_self.watchedStats(function(stats) {
						_response.stats = stats;
						
						callback(_response);
					});
				});
			},
			watchedStats: function(callback) {
				var _self = this,
					stats = {
						watchedCount: 0,
						episodeCount: 0
					};
			
				this.totalEpisodeCount(function(count) {
					stats.episodeCount = count;
					
					_self.watchedEpisodeCount(function(count) {
						stats.watchedCount = count;
						
						callback(stats);
					});
				});
			},
			totalEpisodeCount: function(callback) {
				self.model.sequelize
					.query('SELECT COUNT(m.id) AS count FROM Seasons s JOIN Media m ON m.SeasonId = s.Id WHERE s.ShowId = \'' + this.id + '\' AND m.state = \'' + self.model.Media.State.Downloaded + '\'', null, { plain: true, raw: true })
					.success(function(rows) {
						callback(rows.count);
					});
			},
			watchedEpisodeCount: function(callback) {
				self.model.sequelize
					.query('SELECT COUNT(m.id) AS count FROM Seasons s JOIN Media m ON m.SeasonId = s.Id WHERE s.ShowId = \'' + this.id + '\' AND m.watchStatus = \'' + self.model.Media.WatchStatus.Watched + '\'', null, { plain: true, raw: true })
					.success(function(rows) {
						callback(rows.count);
					});
			}
		}
	});
	
	return Show;
	
}