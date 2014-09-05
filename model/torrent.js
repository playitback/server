var Sequelize = require('sequelize'),
	piratebay = require('pirateship'),
	score = require('../app/lib/score');

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
				
				var data = this.buildWithRemoteData(data);
						
				app.model.Torrent.bulkCreate(data)
					.success(function(torrents) {
						callback(torrents);
					});
			},
			buildWithRemoteData: function(data) {
				var response = [];
				
				for(var i in data) {
					var remote = data[i];
					
					var score = this.calculateScoreWithRemoteData(remote);
					
					if(score < 20) {
						continue;
					}
				
					response.push({
						magnet: remote.magnet,
						score: score
					});
				}
			
				return response;
			},
			calculateScoreWithRemoteData: function(data) {
				return score(data
			}
		},
		instanceMethods: {
			download: function() {
				app.log.debug('Download torrent');
			}
		}
	});
	
};