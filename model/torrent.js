var Sequelize = require('sequelize'),
	piratebay = require('pirateship');

module.exports = function() {

	return this.sequelize.define('Torrent', {
		magnet: {
			type: Sequelize.STRING,
			allowNull: false
		}
	}, {
		classMethods: {
			fetchRemoteWithQuery: function(query, callback, persist) {
				if(typeof persist === 'undefined') {
					persist = false;
				}
				
				var _self = this;
				
				piratebay.search(0, query, function(results) {
					_self.buildWithPirateBayResults(results, persist, function(torrents) {
						callback(torrents);	
					});
				},
				function() {
					callback([]);
				});
			},
			buildWithPirateBayResults: function(data, persist, callback) {
				if(data.length === 0) {
					callback([]);
					
					return;
				}
			
				var torrents = [];
			
				for(var i in data) {
					this.buildWithPirateBayResult(data[i], persist, function(torrent) {
						torrents.push(torrent);
						
						if(torrents === data.length) {
							callback(torrents);
						}
					});
				}
			},
			buildWithPirateBayResult: function(data, persist, callback) {
				return {
					magnet: data.magnet
				}
			}
		},
		instanceMethods: {
			download: function() {
				
			}
		}
	});
	
};