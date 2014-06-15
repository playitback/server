var Sequelize = require('sequelize'),	
	Season;

module.exports = Season = function() {
	
	return this.sequelize.define('Season', {
		number: {
			type: Sequelize.INTEGER
		},
		year: {
			type: Sequelize.INTEGER
		}
	}, {
		classMethods: {
			buildWithTvDbResults: function(results, callback) {
				if(typeof results != 'object' && typeof results.length === 'undefined')
					throw 'Season.buildWithTvDbResults: Invalid results parameter';
					
				if(typeof callback != 'function')
					throw 'Season.buildWithTvDbResults: Invalid callback parameter';
					
				var response = [];
					
				for(var r in results) {
					Season.buildWithTvDbResult(results[r], function(show) {
						if(!show) {
							results.splice(r, 1);
						}
						else {
							response.push(show);
						}
						
						if(response.length === results.length) {
							callback(response);
						}
					});
				}
			},
			buildWithTvDbResult: function(result, callback) {
				var show = Season.build(this.mapWithTvDbResult(result));
				
				show.setPoster(self.model.Poster.build({
					url: result.banner
				}));
				
				// @TODO: create media (episode) objects
				this.model.Media.buildWithTvDbResults({}, function(episodes) {
					
				});
			
				callback(show);
			},
			
			mapWithTvDbResult: function(result) {
				return {};
			}
		}
	});
	
}