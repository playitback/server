var Sequelize 	= require('sequelize'),
	_			= require('underscore');

module.exports = function() {
	
	var Type = {
		Movie: 			'movie',
		TV: 			'tv'
	};
	
	var State = {
		Wanted: 		'wanted',
		Snatched:		'snatched',
		RenameFailed: 	'renameFailed',
		Downloaded:		'downloaded'
	};
	
	var WatchStatus = {
		Watched:		'watched',
		UnWatched:		'unwatched'
	};
	
	var self = this;
	var Media = this.sequelize.define('Media', {
		type: {
			type:			_.values(Type),
			allowNull: 		false
		},
		state: {
			type: 			_.values(State),
			defaultValue:	State.Wanted
		},
		watchStatus: {
			type:			_.values(WatchStatus),
			defaultValue:	WatchStatus.UnWatched
		},
		
		// Movie only
		title: {
			type: 			Sequelize.STRING,
			validate: {
				notNullIfMovie: function(value) {
					if(typeof value === 'undefined') {
						value = null;
					}
				
					if(this.type === Type.Movie && value === null) {
						throw new Error('Movie\'s require a title');
					}
				}
			}
		},
		year: {
			type:			Sequelize.INTEGER,
			notNullIfMovie: function(value) {
				if(typeof value === 'undefined') {
					value = null;
				}
			
				if(this.type === Type.Movie && value === null) {
					throw new Error('Movie\'s require a year');
				}
			}
		},
		
		// TV only (episode)
		number: {
			type:			 Sequelize.INTEGER,
			notNullIfTvShow: function(value) {
				if(typeof value === 'undefined') {
					value = null;
				}
				
				if(this.type === Type.TV && value === null) {
					throw new Error('TV Show\'s require an episode number');
				}
			}
		}
	},
	{
		classMethods: {
			Type:			Type,
			State:			State,
			WatchStatus: 	WatchStatus,
			
			createWithTvDbResults: function(show, results, callback) {
				var mediaResults = [];
				
				for(var r in results) {
					this.createWithTvDbResult(show, results[r], function(result) {
						mediaResults.push(result);
						
						if(mediaResults.length === results.length) {
							callback(mediaResults);
						}
					});
				}
			},
			createWithTvDbResult: function(show, result, callback) {
				var _self = this;
			
				show.getSeasons({ where: { number: result.SeasonNumber }}).success(function(seasons) {
					var assignToSeason = function(season) {
						_self.create(_self.mapWithTvDbResult(result))
							.success(function(episode) {
								season.addEpisode(episode)
									.success(function() {
										callback(episode);
									});
							});
					};
				
					if(seasons.length === 0) {
						self.model.Season.createWithTvDbResult(result, function(season) {
							assignToSeason(season);
						});
					}
					else {
						assignToSeason(seasons[0]);
					}
				});
			},
			mapWithTvDbResult: function(result) {
				return {
					type: 'tv',
					number: result.number
				};
			}
		},
		instanceMethods: {
			indexInfo: function(callback) {
				var _response 	= this.values,	
					_self		= this;
							
				this.getPoster().success(function(poster) {
					_response.poster = poster.values;
					
					callback(_response);
				});
			},
			download: function(torrent) {
				if(typeof torrent === 'undefined' || !torrent) {
					torrent = this.loadBestTorrent(function(torrent) {
						torrent.download();
					});
					
					return;
				}
				
				torrent.download();
			},
			loadBestTorrent: function() {
				var self = this;
			
				this.fetchSuitableTorrents(function() {
					self.torrentWithHighestScore(function(torrent) {
						callback(torrent);
					});
				});
			},
			fetchSuitableTorrents: function(callback) {
				this.model.Torrent.fetchRemoteWithQuery(this.torrentQuery(), function() {
					callback();
				}, true);
			},
			torrentWithHighestScore: function(callback) {
				this.model.Torrent.find({ where: { mediaId: this.id }, orderBy: 'score', limit: 1 }).success(function(torrent) {
					callback(torrent);
				});
			}
		}
	});
	
	return Media;
	
}