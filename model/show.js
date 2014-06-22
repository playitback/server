var Sequelize 	= require('sequelize'),
	moment		= require('moment'),
	TV			= require('../app/lib/provider/data/tvshow');

module.exports = function() {
	
	var self = this;
	var Show = this.sequelize.define('Show', {
		tvDbId: {
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
		
			createWithTvDbResults: function(results, callback) {
				if(results.length === 0) {
					callback([]);
					
					return;
				}
			
				if(typeof results != 'object' && typeof results.length === 'undefined')
					throw 'Show.buildWithTvDbResults: Invalid results parameter';
					
				if(typeof callback != 'function')
					throw 'Show.buildWithTvDbResults: Invalid callback parameter';
					
				var response = [];
									
				results.forEach(function(result) {
					Show.find({ where: { tvDbId: result.id }}).success(function(show) {
						if(show) {
							response.push(show);
							
							if(response.length === results.length) {
								callback(response);
							}
						}
						else {
							Show.createWithTvDbResult(result, function(show) {
								if(!show) {
									results.splice(r, 1);
								}
								else {
									response.push(show);
								}
														
								if(response.length === results.length) {
									callback(response);
								}
							});
						}
					});
				});
			},
			
			createWithTvDbId: function(tvDbId, callback) {
				var _self = this;
							
				TV.tvdb().getInfo(tvDbId, function(err, result) {
					if(err) {
						callback(err);
						
						return;
					}
									
					_self.createWithTvDbResult(result, function(show) {
						callback(show);
					});
				});
			},
			
			createWithTvDbResult: function(result, callback) {
				this.create(this.mapWithTvDbResult(result.tvShow))
					.success(function(show) {
						self.model.Poster.create(self.model.Poster.mapWithTvDbResult(result))
							.success(function(poster) {
								show.setPoster(poster)
									.success(function() {
										self.model.Media.createWithTvDbResults(show, result.episodes, function(seasons) {
											show.setSeasons(seasons).success(function() {
												callback(show);
											});
										});
									});
							});
					});
			},
			
			mapWithTvDbResult: function(result) {
				return {
					tvDbId:			result.id,
					title: 			result.name,
					firstAired: 	moment(result.FirstAired).toDate()
				};
			}
		},
		instanceMethods: {
			indexInfo: function(callback) {
				var _response 	= this.values,	
					_self		= this;
							
				this.getPoster().success(function(poster) {
					_response.poster = poster.values;
					
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
					.query('SELECT COUNT(m.id) AS count FROM Seasons s JOIN Media m ON m.SeasonId = s.Id WHERE s.ShowId = \'' + this.id + '\'', null, { plain: true, raw: true })
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