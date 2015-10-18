var Sequelize = require('sequelize'),
    score = require(__dirname + '/../lib/score');

module.exports = function() {

	var TAG = 'model.torrent ',
        sequelize = this.get('sequelize');
	
	var torrentModel = sequelize.define('Torrent', {
		exactTopic: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true
		},
		fileName: {
			type: Sequelize.STRING,
			allowNull: false
		},
		trackers: {
			type: Sequelize.STRING,
			allowNull: false
		},
		infoHash: {
			type: Sequelize.STRING,
			allowNull: false
		},
		seeders: {
			type: Sequelize.INTEGER,
			defaultValue: 0
		},
		leachers: {
			type: Sequelize.INTEGER,
			defaultValue: 0
		},
		size: {
			type: Sequelize.INTEGER,
			defaultValue: 0
		},
		sizeUnit: {
			type: Sequelize.STRING
		},
		score: {
			type: Sequelize.INTEGER
		}
	}, {
		classMethods: {
			fetchSuitableWithMedia: function(media, callback, persist) {
				if(typeof persist === 'undefined') {
					persist = false;
				}

				app.log.debug(TAG + 'fetchSuitableWithMedia persist: ' + persist);

				var self = this;
				
				media.torrentQuery(function(query) {
					app.log.debug(TAG + 'fetchSuitableWithMedia torrent search query: ' + query);


				});
			},
			buildWithResults: function(media, data, persist, callback) {
				if(data.length === 0) {
					callback([]);
					
					return;
				}

				app.log.debug(TAG + 'buildWithResults ' + data.length);

				var data = this.buildWithRemoteData(media, data);

				if (data.length > 0) {
                    sequelize.transaction().then(function(transaction) {
						var created = 0;

						for (var i in data) {
							var torrent = torrentModel.build(data[i]);

							media.addTorrent(torrent).then(function() {
								created++;

								if (created == data.length) {
									transaction.commit();

									callback();
								}
							})
							.catch(function(err) {
								created++;

								if (created == data.length) {
									transaction.rollback();

									callback();
								}
							});
						}
					});
				}
			},
			buildWithRemoteData: function(media, data) {
				var response = [];
								
				for(var i in data) {
					var remote = data[i];
					var score = this.calculateScoreWithRemoteData(media, remote);

					// TODO check fileName for valid keywords from the media's quality
					// Need to wait on media.quality to be set though
					if(score < 200) {
						continue;
					}

					response.push({
						exactTopic: remote.magnet.xt,
						fileName: remote.magnet.dn,
						trackers: remote.magnet.tr.join(','),
						infoHash: remote.magnet.infoHash,
						seeders: remote.seeds,
						leachers: remote.leaches,
						size: remote.size,
						sizeUnit: remote.sizeUnit,
						score: score
					});
				}
			
				return response;
			},
			calculateScoreWithRemoteData: function(media, data) {
				return score(media, data);
			}
		},
		instanceMethods: {

			/**
			 *
			 */
			download: function() {
				app.log.debug('Download torrent');

				var magnetUrl = this.magnetUrl(),
					self = this;

				this.getMedia().then(function(media) {
					media.createDownloadDirectory(function(exists) {
						if (!exists) {
							return;
						}

						var transmission = new Transmission(app);

						transmission.addUrl(magnetUrl, {
							'download-dir': media.downloadDirectory()
						}, function (err, torrent) {
							if (err) {
								app.log.error(TAG + 'Failed to add torrent to Transmission with error: ' + err);
							}
							else {
								app.log.debug(TAG + 'Torrent added successfully', torrent.id);

								media.updateAttributes({
									state: mediaModel.Media.State.Downloading,
									transmissionId: torrent.id
								}).then(function () {
									media.setDownloadingTorrent(self).then(function() {
										app.notification.notifyOnDownloadStart(media);
									});
								});
							}
						});
					});
				});
			},
			magnetUrl: function() {
				var url = 'magnet:?' +
					'xt=' + this.get('exactTopic') + '&' +
					'dn=' + this.get('fileName');

				var trackers = this.get('trackers').split(',');

				trackers.forEach(function(tracker) {
					url += '&tr=' + encodeURIComponent(tracker);
				});

				return url;
			}
		}
	});

    return torrentModel;
	
};