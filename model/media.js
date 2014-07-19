var Sequelize 	= require('sequelize'),
	_			= require('underscore'),
	moment		= require('moment');

module.exports = function() {
	
	var Type = {
		Movie: 			'movie',			// A movie file
		TV: 			'tv'				// A TV episode
	};
	
	var State = {
		Wanted: 		'wanted',			// Added, but not yet released or downloaded
		Downloading:	'downloading',		// Currently being downloaded
		RenameFailed: 	'renameFailed',		// Download finished, but failed to move it to downloaded dir
		Downloaded:		'downloaded'		// Downloaded and moved to media directory
	};
	
	var WatchStatus = {
		Watched:		'watched',			// The media has been watched
		UnWatched:		'unwatched'			// The media hasn't been watched, default
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
			type: 			Sequelize.ENUM(State.Wanted, State.Downloading, State.RenameFailed, State.Downloaded),
			defaultValue:	State.Wanted
		},
		watchStatus: {
			type:			Sequelize.ENUM(WatchStatus.Watched, WatchStatus.UnWatched),
			defaultValue:	WatchStatus.UnWatched
		},
		availableDate: {
			type:			Sequelize.DATE,
			allowNull:		false
		},
		
		// Movie only
		title: {
			type: 			Sequelize.STRING,
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
			
			createWithRemoteId: function(remoteId, callback) {
				var _self = this;
				
				self.theMovieDb.getMovie(remoteId, function(err, result) {
					if(err) {
						callback(err);
						
						return;
					}
					
					_self.createWithRemoteResult(result, function(show) {
						callback(show);
					});
				});
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
					else if(typeof result.poster_path === 'string') {
						self.model.Poster.createWithRemoteResult(result).success(function(poster) {
							media.setPoster(poster).success(function() {
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
					mapped.title 			= result.title;
					mapped.availableDate 	= moment(result.release_date).toDate();
				}
				
				// TV
				else if(mapped.type === Type.TV) {
					mapped.availableDate 	= moment(result.air_date).toDate();
					mapped.number			= result.episode_number;
					mapped.name				= result.name;
					mapped.overview			= result.overview;
				}
							
				return mapped;
			},
			findAllAvailableAndWanted: function(callback) {
				this.findAll({ where: { state: State.Wanted, availableDate: { lte: new Date() } } })
					.success(function(media) {
						callback(media);
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
				var _self = this;
						
				this.fetchSuitableTorrents(function() {
					_self.torrentWithHighestScore(function(torrent) {
						callback(torrent);
					});
				});
			},
			fetchSuitableTorrents: function(callback) {			
				self.model.Torrent.fetchSuitableWithMedia(this, function() {
					callback();
				}, true);
			},
			torrentWithHighestScore: function(callback) {
				this.model.Torrent.find({ where: { mediaId: this.id }, orderBy: 'score', limit: 1 }).success(function(torrent) {
					callback(torrent);
				});
			},
			torrentQuery: function(callback) {
				if(this.type === Type.Movie) {
					callback(this.title + ' ' + moment(this.availableDate).format('YYYY'));
				}
				else if(this.type === Type.TV) {
					var episode = this;
				
					this.getSeason().success(function(season) {
						season.getShow().success(function(show) {
							var prefixedSeasonNumber = (season.number < 10 ? '0' : '') + season.number,
								prefixedEpisodeNumber	= (episode.number < 10 ? '0' : '') + episode.number;
						
							callback(show.title.replace(' ', '.') + ' ' + 'S' + prefixedSeasonNumber + 'E' + prefixedEpisodeNumber + '|' + season.number + 'x' + prefixedEpisodeNumber + '|' + prefixedSeasonNumber + 'x' + prefixedEpisodeNumber);
						});
					});
				}
			}
		}
	});
	
	return Media;
	
}