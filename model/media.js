var Sequelize 	= require('sequelize'),
	_			= require('underscore'),
	moment		= require('moment');

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
	
	var notNullIfTvShow = function(value) {
		if(typeof value === 'undefined') {
			value = null;
		}
		
		if(this.type === Type.TV && value === null) {
			throw new Error('Required for TV Shows');
		}
	};
	
	var notNullIfMovie = function(value) {
		if(typeof value === 'undefined') {
			value = null;
		}
		
		if(this.type === Type.Movie && value === null) {
			throw new Error('Required for Movies');
		}
	};
	
	var self = this;
	var Media = this.sequelize.define('Media', {
		type: {
			type:			Sequelize.ENUM(Type.Movie, Type.TV),
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
				notNullIfMovie: notNullIfMovie
			}
		},
		year: {
			type:			Sequelize.INTEGER,
			validate: {
				notNullIfMovie: notNullIfMovie
			}
		},
		
		// TV only (episode)
		number: {
			type:			 Sequelize.INTEGER,
			validate: {
				notNullIfTvShow: notNullIfTvShow
			}
		},
		airDate: {
			type:			Sequelize.DATE,
			validate: {
				notNullIfTvShow: notNullIfTvShow
			}
		},
		name: {
			type:			Sequelize.STRING,
			validate: {
				notNullIfTvShow: notNullIfTvShow
			}
		},
		overview: {
			type:			Sequelize.STRING,
			validate: {
				notNullIfTvShow: notNullIfTvShow
			}
		}
	},
	{
		classMethods: {
			Type:			Type,
			State:			State,
			WatchStatus: 	WatchStatus,
			
			getMediaForIndex: function(callback) {
				var _self = this;
			
				this.findAll({ where: { type: Type.Movie }}).success(function(medias) {
					var response 		= [],
						checkedShows 	= 0;
										
					if(medias.length === 0) {
						_self.response(response);
						
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
			
			createWithRemoteId: function(remoteId, callback) {
				// TODO
			},
			
			createWithRemoteResults: function(results, callback) {
				if(typeof results != 'object' || typeof results.length != 'number') {
					throw 'Invalid results array';
				}
				
				if(typeof callback != 'function') {
					throw 'Invalid callback';
				}
			
				var media 	= [],
					_self	= this;
				
				results.forEach(function(result) {
					_self.createWithRemoteResult(result, function(episode) {
						media.push(episode);
						
						if(media.length === results.length) {
							callback(media);
						}
					});
				});
			},
			createWithRemoteResult: function(result, callback) {
				var _self = this;
								
				result.type = typeof result.episode_number === 'number' ? Type.TV : Type.Movie;
			
				this.create(this.mapWithRemoteResult(result)).success(function(media) {
					if(typeof result.still_path === 'string') {
						self.model.Poster.createWithRemoteResult(result).success(function(poster) {
							media.setStill(poster).success(function() {
								callback(media);
							});
						});
					}
					else {
						callback(media);
					}
				});
			},
			mapWithRemoteResult: function(result) {
				var mapped = {
					remoteId: result.id
				};
				
				// Search results
				if(typeof result.media_type === 'string') {
					mapped.type = result.media_type;
				}
				else if(typeof result.type === 'string') {
					mapped.type = result.type;
				}
								
				if(mapped.type === Type.Movie) {
					mapped.title 	= result.title;
					mapped.year 	= result.release_date.split('-')[0];
				}
				
				// TV
				else if(mapped.type === Type.TV) {
					mapped.airDate 	= moment(result.air_date).toDate();
					mapped.number	= result.episode_number;
					mapped.name		= result.name;
					mapped.overview	= result.overview;
				}
							
				return mapped;
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