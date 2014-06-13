var Sequelize = require('sequelize');

module.exports = function(sequelize) {
	
	var Media = sequelize.define('Media', {
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
		}
	});
	
	return Media;
	
}