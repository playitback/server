var Sequelize = require('sequelize');

module.exports = function() {
	
	var Media = this.sequelize.define('Media', {
		type: {
			type:			Sequelize.ENUM('movie', 'tv'),
			allowNull: 		false
		},
		state: {
			type: 			Sequelize.ENUM('wanted', 'snatched', 'renameFailed', 'downloaded'),
			defaultValues:	'wanted'
		},
		
		// Movie only
		title: {
			type: 			Sequelize.STRING,
			allowNull: 		false
		},
		year: {
			type:			Sequelize.INTEGER
		},
		
		// TV only
		number: {
			type:			Sequelize.INTEGER
		}
	},
	{
		classMethods: {
			createWithTvDbResults: function(results, callback) {
				var mediaResults = [];
				
				for(var r in results) {
					Media.createWithTvDbResult(results[r], function(result) {
						mediaResults.push(result);
						
						if(mediaResults.length === results.length) {
							callback(mediaResults);
						}
					});
				}
			},
			createWithTvDbResult: function(result, callback) {
				
			}
		},
		instanceMethods: {
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
				var self = this;
			
				this.fetchSuitableTorrents(function() {
					self.torrentWithHighestScore(function(torrent) {
						callback(torrent);
					});
				});
			},
			fetchSuitableTorrents: function(callback) {
				this.model.Torrent.fetchRemoteWithQuery(this.torrentQuery(), function() {
					callback();
				}, true);
			},
			torrentWithHighestScore: function(callback) {
				this.model.Torrent.find({ where: { mediaId: this.id }, orderBy: 'score', limit: 1 }).success(function(torrent) {
					callback(torrent);
				});
			}
		}
	});
	
	return Media;
	
}