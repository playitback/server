var Sequelize = require('sequelize'),
	piratebay = require('pirateship');

module.exports = function() {

	var app = this;
	
	return this.sequelize.define('Torrent', {
		magnet: {
			type: Sequelize.STRING,
			allowNull: false
		},
		score: {
			type: Sequelize.INTEGER
		}
	}, {
		getterMethods: {
			magnet: function() {
				return JSON.parse(this.magnet);
			}
		},
		setterMethods: {
			magnet: function() {
				return JSON.stringify(this.magnet);
			}
		},
		classMethods: {
			fetchSuitableWithMedia: function(media, callback, persist) {
				if(typeof persist === 'undefined') {
					persist = false;
				}
				
				var self = this;
				
				media.torrentQuery(function(query) {
					piratebay.search(0, query, function(results) {
						app.log.debug('Found ' + results.length + ' results for ' + query);
						
						self.buildWithResults(results, persist, function(torrents) {
							callback(torrents);	
						});
					},
					function() {
						callback([]);
					});
				});
			},
			buildWithResults: function(data, persist, callback) {
				if(data.length === 0) {
					callback([]);
					
					return;
				}
				
				console.log('Torrent.buildWithResults');
			
				var torrents = [];
			
				for(var i in data) {
					this.buildWithRemoteData(data[i], persist, function(torrent) {
						torrents.push(torrent);
												
						if(torrents.length === data.length) {
							callback(torrents);
						}
					});
				}
			},
			buildWithRemoteData: function(data, persist, callback) {
				callback(app.model.Torrent.create({
					magnet: data.magnet,
					score: this.calculateScoreWithRemoteData(data)
				}));
			},
			calculateScoreWithRemoteData: function(data) {
				
			}
		},
		instanceMethods: {
			download: function() {
				app.log.debug('Download torrent');
			}
		}
	});
	
};