var Sequelize = require('sequelize'),
	piratebay = require('pirateship'),
	score = require('../app/lib/score'),
	Transmission = require('../app/lib/transmission');

module.exports = function(app) {

	var TAG = 'model.torrent ';
	
	return this.sequelize.define('Torrent', {
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

					piratebay.search(0, query, function(results) {
						app.log.debug(TAG + 'fetchSuitableWithMedia Found ' + results.length + ' results for ' + query);
						
						self.buildWithResults(media, results, persist, function(torrents) {
							callback(torrents);	
						});
					},
					function(error) {
						app.log.debug(TAG + 'fetchSuitableWithMedia Pirate bay error: ' + error);

						callback([]);
					});
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
					app.model.sequelize.transaction().then(function(transaction) {
						var created = 0;

						for (var i in data) {
							var torrent = app.model.Torrent.build(data[i]);

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
			download: function() {
				app.log.debug('Download torrent');

				var magnetUrl = this.magnetUrl();

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
									state: app.model.Media.State.Downloading,
									transmissionId: torrent.id
								}).then(function () {
									// TODO: notify UI
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
	
};