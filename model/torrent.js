var Sequelize = require('sequelize'),
	piratebay = require('pirateship');

module.exports = function() {

	return this.sequelize.define('Torrent', {
		magnet: {
			type: Sequelize.STRING,
			allowNull: false
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
				
				var _self = this;
				
				media.torrentQuery(function(query) {
					piratebay.search(0, query, function(results) {
						_self.buildWithResults(results, persist, function(torrents) {
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
			
				var torrents = [];
			
				for(var i in data) {
					this.buildWithRemoteData(data[i], persist, function(torrent) {
						torrents.push(torrent);
						
						if(torrents === data.length) {
							callback(torrents);
						}
					});
				}
			},
			buildWithRemoteData: function(data, persist, callback) {
				return {
					magnet: data.magnet,
					score: this.calculateScoreWithRemoteData(data)
				}
			},
			calculateScoreWithRemoteData: function(data) {
				
			}
		},
		instanceMethods: {
			download: function() {
				
			}
		}
	});
	
};