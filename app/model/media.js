var Sequelize 	= require('sequelize'),
	_			= require('underscore'),
	moment		= require('moment'),
	fs			= require('fs'),
	fsUtil 		= require(__dirname + '/../lib/fs.util'),
	qualities	= require(__dirname + '/../const/qualities');

module.exports = function() {

	var TAG = 'model.media ',
        sequelize = this.get('sequelize'),
        theMovieDb = this.get('themoviedb'),
        log = this.get('log'),
        notification = this.get('notification'),
        settings = this.get('settings'),
        torrentModel = this.get('model.torrent'),
        posterModel = this.get('model.poster'),
        settingsModel = this.get('model.settings');

    // Constants
	var Type = {
		Movie: 			'movie',			// A movie file
		TV: 			'tv'				// A TV episode
	};
	
	var State = {
		Wanted: 		'wanted',			// Added, but not yet released or downloaded
		Downloading:	'downloading',		// Currently being downloaded
		RenameFailed: 	'renameFailed',		// Download finished, but failed to move it to downloaded dir
		Downloaded:		'downloaded',		// Downloaded and moved to media directory
		Skipped:		'skipped'			// Don't download
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

	// Construct a custom Sequelize.ENUM type using the defined qualities
	var qualityKeys = [];
	for (var key in qualities) {
		qualityKeys.push(key);
	}
	var qualityType = function() {
		return {
			type: 'ENUM',
			values: Array.prototype.slice.call(qualityKeys).reduce(function(result, element) {
				return result.concat(Array.isArray(element) ? element : [element]);
			}, [])
		};
	};
	qualityType.toString = qualityType.valueOf = function() { return 'ENUM'; };

	var Media = sequelize.define('Media', {
		type: {
			type:			Sequelize.ENUM(Type.Movie, Type.TV),
			allowNull: 		false
		},
		state: {
			type: 			Sequelize.ENUM(State.Wanted, State.Downloading, State.RenameFailed, State.Downloaded, State.Skipped),
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
		remoteId: {
			type:			Sequelize.STRING,
			allowNull:		false,
			unique:			true
		},
		transmissionId: {
			type:			Sequelize.INTEGER
		},
		quality: {
			type:			qualityType(),
			allowNull:		false
		},
		downloadProgress: {
			type:			Sequelize.FLOAT,
			default:		0
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
		},
		seasonNumber: {
			type:			Sequelize.INTEGER,
			validate: {
				notNullIfTvShow: notNullIfTvShow
			}
		},
		showName: {
			type:			Sequelize.STRING,
			validate: {
				notNullIfTvShow: notNullIfTvShow
			}
		},
		showYear: {
			type:		Sequelize.INTEGER,
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

			/**
			 *
			 * @returns {*[]}
			 */
			indexInclude: function() {
				return [
					{
						model: posterModel,
						as: 'poster'
					}
				];
			},

			fullInclude: function() {
				return [
                    posterModel
				];
			},
			
			getMediaForIndex: function(callback) {
				this.findAll({ where: { type: Type.Movie }, include: this.indexInclude() }).then(function(medias) {
					var response = [];
										
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

			deleteWithRemoteId: function(remoteId, callback) {
				if (typeof remoteId != 'number') {
					throw 'Invalid remote id';
				}

				this.find({ where: { remoteId: remoteId } }).then(function(media) {
					if (media) {
						media.destroy().then(function() {
							if (typeof callback == 'function') {
								callback();
							}
						});
					}
				});
			},
			
			createWithRemoteId: function(remoteId, transaction, callback) {
				var self = this;
				
			    theMovieDb.getMovie(remoteId, function(err, result) {
					if(err) {
						callback(err, null);
						
						return;
					}

					self.createWithRemoteResult(result, transaction, function (media) {
						callback(null, media);
					});
				});
			},
			
			createWithRemoteResults: function(results, transaction, season, show, callback) {
				if(typeof results != 'object' || typeof results.length != 'number') {
					throw 'Invalid results array';
				}

				// Season number / show name not required
				if (typeof seasonNumber == 'function') {
					callback = seasonNumber;
				}
				
				if(typeof callback != 'function') {
					throw 'Invalid callback';
				}
			
				var media 	= [],
					self	= this;
				
				results.forEach(function(result) {
					self.createWithRemoteResult(result, transaction, season, show, function(episode) {
						media.push(episode);

						if(media.length === results.length) {
							callback(media);
						}
					});
				});
			},
			createWithRemoteResult: function(result, transaction, season, show, callback) {
				var self = this;

				if (typeof season == 'function') {
					callback = season;
				}
								
				result.type = typeof result.episode_number === 'number' ? 
					Type.TV : 
					Type.Movie;

				// If transaction if a function, it's the callback
				if(typeof transaction === 'function') {
					callback = transaction;
					transaction = null;
				}

				this.find({ where: { remoteId: String(result.id) } }).then(function(media) {
					// Create or update media object
					media = self.mapWithRemoteResult(result, media, season, show);

					media.save({ transaction: transaction }).then(function (media) {
						if (typeof result.still_path === 'string') {
							posterModel.createWithRemoteResult(result, transaction).success(function (poster) {
								media.setStill(poster, {transaction: transaction}).success(function () {
									callback(media);
								});
							});
						}
						else if (typeof result.poster_path === 'string') {
                            posterModel.createWithRemoteResult(result, transaction).success(function (poster) {
								media.setPoster(poster, {transaction: transaction}).success(function () {
									callback(media);
								});
							});
						}
						else {
							callback(media);
						}
					})
					.catch(function(error) {
						// Handle for movies, TV shows leave to show model
						if (result.type == Type.Movie) {
							if (transaction) {
								transaction.rollback();

								transaction = null;
							}
						}

						log.error(TAG + 'Failed to create media', error)

						callback(null);
					});
				});
			},
			mapWithRemoteResult: function(result, media, season, show) {
				var type;

				// Search results
				if(typeof result.media_type === 'string') {
					type = result.media_type;
				}
				else if(typeof result.type === 'string') {
					type = result.type;
				}

				if(!media) {
					media = this.build();

					// Only set quality on initial creation, not update
					media.quality = settings.get(settingsModel.Key.Media.DefaultQuality[type]);

					if (type == Type.Movie) {
						media.state = State.Wanted; // defaults to wanted, we download them all
					}
					else if (type == Type.TV) {
						// Wanted if in the future, otherwise skip
						media.state	= (moment(result.air_date).diff(moment()) > 0 ? State.Wanted : State.Skipped);
					}
				}

				media.remoteId 	= result.id;
				media.type		= type;

				// Movie
				if(type === Type.Movie) {
					media.title 			= result.title;
					media.availableDate 	= moment(result.release_date).toDate();
				}
				
				// TV - won't have a type as it's an episode
				else {
					media.availableDate 	= moment(result.air_date);
					media.number			= result.episode_number;
					media.name				= result.name;
					media.seasonNumber		= season.number;
					media.showName			= show.title;
					media.showYear			= show.firstAired.getFullYear();
				}

				media.overview = result.overview;
							
				return media;
			},
			findAllAvailableAndWanted: function(callback) {
				this.findAll({ where: { state: State.Wanted, availableDate: { lte: new Date() } } })
					.then(function(media) {
						callback(media);
					});
			}
		},
		instanceMethods: {

			/**
			 *
			 * @param callback
			 */
			indexInfo: function(callback) {
				var _response 	= this.dataValues,
					self		= this;

                this.getPoster().then(function(poster) {
					if(poster) {
						_response.poster = poster.dataValues;
					}
					
					callback(_response);
				});
			},

			/**
			 *
			 * @param torrent
			 */
			download: function(torrent) {
				log.debug(TAG + 'Download torrent for ' + this.title || this.name);
				
				var self = this;
				
				if(typeof torrent === 'undefined' || !torrent) {
					this.loadBestTorrentAndDownload(function() {
						torrentModel.fetchSuitableWithMedia(self, function() {
							self.loadBestTorrentAndDownload();
						});
					});
					
					return;
				}
				
				torrent.download();
			},

			loadBestTorrentAndDownload: function(failCallback) {
				this.getTorrents({ orderBy: 'score', limit: 1 }).then(function(torrent) {
					if (torrent.length == 0) {
						if (typeof failCallback == 'function') {
							failCallback();
						}
						else {
							log.debug(TAG + 'No torrent found with suitable highest score');
						}
					}
					else {
						log.debug(TAG + 'Found torrent with suitable highest score');

						torrent[0].download();
					}
				});
			},

			/**
			 *
			 * @param callback
			 */
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
						
							callback(show.title.replace(' ', '.') + ' ' + 'S' + prefixedSeasonNumber + 'E' +
								prefixedEpisodeNumber + '|' + season.number + 'x' + prefixedEpisodeNumber + '|' +
								prefixedSeasonNumber + 'x' + prefixedEpisodeNumber);
						});
					});
				}
			},

			/**
			 * Construct the full path to the download directory for this media type
             *
			 * @returns {string}
			 */
			downloadDirectory: function() {
				return settings.get(settingsModel.Key.General.MediaDirectory) + '/Downloads/' + this.get('type');
			},

			/**
			 * Constructs the full path to the media location for this media type.
             *
             * This is where media is moved to when it's download.
             *
			 * @returns {string}
			 */
			mediaDirectory: function() {
				return settings.get(settingsModel.Key.General.MediaDirectory) + '/' + this.get('type');
			},

			/**
			 * Construct the directory to store this media in. Different based on type.
			 * Movies use the media name, TV episodes use the show name.
			 *
			 * @param callback A function to call when the media directory has loaded
			 */
			mediaFolder: function(callback) {
				var self = this;

				if (this.type == Type.Movie) {
					callback(self.mediaDirectory() + '/' + this.get('title') +
						' (' + this.get('availableDate').getFullYear() + ')');
				}
				else {
					this.getSeason().then(function(season) {
						season.getShow().then(function(show) {
							callback(self.mediaDirectory() + show.get('title') +
								'(' + show.get('firstAired').getFullYear() + ')');
						});
					});
				}
			},

			/**
			 * Returns the filename for this media
			 */
			mediaFile: function(file, callback) {
				var type = this.get('type'),
					self = this;

				var extension = file.name.split('.');
				extension = extension[extension.length - 1];

				if (type == Type.Movie) {
					callback(this.get('title') + '.' + extension);
				}
				else if (type == Type.TV) {
					this.getSeason().then(function(season) {
						if (season) {
							season.getShow().then(function(show) {
								if (show) {
									var season = season.get('number');
									season = (season < 10 ? '0' : '') + season;

									var episode = self.get('number');
									episode = (episode < 10 ? '0' : '') + episode;

									// TODO configure variants from settings
									callback(show.get('title') + '.S' + season + 'E' + episode + '.' +
										self.get('title').replace(' ', '.') + '.' + extension);
								}
							});
						}
					});
				}
			},

			/**
			 *
			 * @param callback
			 */
			createDownloadDirectory: function(callback) {
				var downloadDirectory = this.downloadDirectory();

				fsUtil.mkdirParent(downloadDirectory, '0777', function(err) {
					var success = !err || (err && err.code == 'EEXIST');

					if (!success) {
						log.warn(TAG + 'Download directory doesn\'t exist and can\'t be created');
					}

					callback(success);
				});
			},

			/**
			 *
			 * @param callback
			 */
			createMediaDirectory: function(callback) {
				var mediaDirectory = this.mediaDirectory();

				fsUtil.mkdirParent(mediaDirectory, '0777', function(err) {
					var success = !err || (err && err.code == 'EEXIST');

					if (!success) {
						log.warn(TAG + 'Media directory doesn\'t exist and can\'t be created');
					}

					callback(success);
				});
			},

			/**
			 * Create the media folder for this media
			 *
			 * @param callback
			 */
			createMediaFolder: function(callback) {
				var self = this;

				// Get the folder to put the downloaded data in to
				this.mediaFolder(function(folder) {
					// Make the directory, recursively
					fsUtil.mkdirParent(folder, function (success) {
						if (!success) {
							log.warn(TAG + 'Failed to make media directory during move. type: ' + self.get('type'));
						}

						callback(success);
					});
				});
			},

			/**
			 *
			 * @param remoteTorrent
			 */
			moveToMediaDirectory: function(remoteTorrent) {
				if (typeof remoteTorrent != 'object' || typeof remoteTorrent.files != 'object' ||
					typeof remoteTorrent.files.length != 'number' || typeof remoteTorrent.percentDone != 'number') {
					log.warn(TAG + 'Invalid torrent, failed to copy to media directory');

					return;
				}

				if (remoteTorrent.percentageDone < 100) {
					log.warn(TAG + 'Cannot move an incomplete download');

					return;
				}

				var self = this,
					downloadDirectory = this.downloadDirectory();

				this.createMediaFolder(function(success) {
					self.mediaFolder(function(folder) {
						if (!success) {
							return;
						}

						var _break = false;

						// Iterate, check it exists and move
						remoteTorrent.files.forEach(function (file) {
							if (_break) {
								return;
							}

							var downloadedFile = downloadDirectory + '/' + file.name,
								extension = file.name.split('.');

							if (extension.length < 2) {
								log.warn(TAG + 'Invalid torrent file. No valid extension.');

								_break = true;

								return;
							}

							extension = extension[extension.length - 1];

							var quality = self.qualityProfile();

							// TODO: This isn't working.
							if (quality.extensions.indexOf(extension) > -1 &&
								!settings.get(settingsModel.Key.Media.Renamer.MoveRemaining)) {
								return;
							}

							fs.exists(downloadedFile, function (exists) {
								if (!exists) {
								    log.warn(TAG + 'Torrent file doesn\'t exist, cannot copy to media directory');
								}
								else {
									self.mediaFile(file, function(mediaFile) {
										var mediaFile = folder + '/' + mediaFile;

										log.debug(TAG + 'Moving media file from: ' + downloadedFile + ', to: ' +
											mediaFile);

										var readStream = fs.createReadStream(downloadedFile),
											writeStream = fs.createWriteStream(mediaFile);

										readStream.on('error', function(error) {
											log.warn(TAG + 'Failed to move media file ' + error);
										});
										writeStream.on('error', function(error) {
											log.warn(TAG + 'Failed to move media file ' + error);
										});
										writeStream.on('close', function() {
											self.copyComplete(remoteTorrent);
										});
										readStream.pipe(writeStream);
									});
								}
							});
						});
					});
				});
			},

			/**
			 * Called when the media file is successfully moved
			 */
			copyComplete: function(remoteTorrent) {
				var self = this;

				this.updateAttributes({state: State.Downloaded})
					.then(function () {
						log.debug(TAG + 'Successfully download ' + self.get('type')
							+ ' ' + self.get('id'));

						// TODO: Tidy up downloads. Also set a setting to configure to do it
						// TODO: Notify UI

						notification.notifyOnDownladRenamed(self);
					})
					.catch(function(error) {
						log.debug(TAG + 'Failed to mark media as downloaded ' +
							self.get('id') + ', error: ' + error);
					});
			},

			/**
			 * Returns the quality profile currently belonging to this media object
			 *
			 * @returns {*}
			 */
			qualityProfile: function() {
				var quality = this.get('quality');

				if (typeof quality == 'string' && typeof qualities[quality] == 'object') {
					return qualities[quality];
				}
			},

			dropboxData: function() {
				return {
					remoteId: this.remoteId,
					downloadProgress: this.downloadProgress
				};
			}
		}
	});
	
	return Media;
};