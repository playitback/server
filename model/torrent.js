var Sequelize = require('sequelize'),
	piratebay = require('../app/lib/provider/download/thepiratebay');

module.exports = function() {

	return this.sequelize.define('Torrent', {
		
	}, {
		classMethods: {
			fetchRemoteWithQuery: function(query, callback, persist) {
				if(typeof persist === 'undefined') {
					persist = false;
				}
				
				piratebay.search(0, query, function(results) {
					self.buildWithPirateBayData(results, persist, function(torrents) {
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
				
			}
		},
		instanceMethods: {
			download: function() {
				
			}
		}
	});
	
};