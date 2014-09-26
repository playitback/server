var Sequelize = require('sequelize'),
	piratebay = require('pirateship'),
	score = require('../app/lib/score');

module.exports = function() {

	var app = this;
	
	return this.sequelize.define('Torrent', {
		exactTopic: {
			type: Sequelize.STRING,
			allowNull: false
		},
		fileName: {
			type: Sequelize.STRING,
			allowNull: false
		},
		trackerUrl: {
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
				
				var self = this;
				
				media.torrentQuery(function(query) {
					piratebay.search(0, query, function(results) {
						app.log.debug('Found ' + results.length + ' results for ' + query);
						
						self.buildWithResults(media, results, persist, function(torrents) {
							callback(torrents);	
						});
					},
					function() {
						callback([]);
					});
				});
			},
			buildWithResults: function(media, data, persist, callback) {
				if(data.length === 0) {
					callback([]);
					
					return;
				}
				
				console.log('Torrent.buildWithResults');
				
				var data = this.buildWithRemoteData(media, data);
														
				/*app.model.Torrent.bulkCreate(data)
					.success(function(torrents) {
						callback(torrents);
					});*/
			},
			buildWithRemoteData: function(media, data) {
				var response = [];
								
				for(var i in data) {
					var remote = data[i];
					var score = this.calculateScoreWithRemoteData(media, remote);
										
					if(score < 20) {
						continue;
					}
				
					response.push({
						exactTopic: remote.magnet.et,
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
			}
		}
	});
	
};