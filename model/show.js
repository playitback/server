var Sequelize 	= require('sequelize'),
	moment		= require('moment'),
	tvdb		= require('tvdb');

module.exports = function() {
	
	var self = this,
		Show = this.sequelize.define('Show', {
		title: {
			type: Sequelize.STRING,
			allowNull: false
		},
		firstAired: {
			type: Sequelize.DATE,
			allowNull: false
		}
	}, {
		classMethods: {
			buildWithTvDbResults: function(results, callback) {
				if(typeof results != 'object' && typeof results.length === 'undefined')
					throw 'Show.buildWithTvDbResults: Invalid results parameter';
					
				if(typeof callback != 'function')
					throw 'Show.buildWithTvDbResults: Invalid callback parameter';
					
				var response = [];
					
				for(var r in results) {
					Show.buildWithTvDbResult(results[r], function(show) {
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
				var show = Show.build(this.mapWithTvDbResilt(result));
				
				show.setPoster(self.model.Poster.build({
					url: result.banner
				}));
			
				callback(show);
			},
			mapWithTvDbResult: function(result) {
				return {
					title: 			result.SeriesName,
					firstAired: 	moment(result.FirstAired).toDate()
				};
			}
		}
	});
	
	return Show;
	
}