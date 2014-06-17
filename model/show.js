var Sequelize 	= require('sequelize'),
	moment		= require('moment'),
	TV			= require('../app/lib/provider/data/tvshow');

module.exports = function() {
	
	var self = this;
	var Show = this.sequelize.define('Show', {
		tvDbId: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
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
		
			createWithTvDbResults: function(results, callback) {
				if(results.length === 0) {
					callback([]);
					
					return;
				}
			
				if(typeof results != 'object' && typeof results.length === 'undefined')
					throw 'Show.buildWithTvDbResults: Invalid results parameter';
					
				if(typeof callback != 'function')
					throw 'Show.buildWithTvDbResults: Invalid callback parameter';
					
				var response = [];
									
				results.forEach(function(result) {
					Show.find({ where: { tvDbId: result.id }}).success(function(show) {
						if(show) {
							response.push(show);
							
							if(response.length === results.length) {
								callback(response);
							}
						}
						else {
							Show.createWithTvDbResult(result, function(show) {
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
					});
				});
			},
			
			createWithTvDbResult: function(result, callback) {
				var show = Show.build(this.mapWithTvDbResult(result));
								
				show.setPoster(self.model.Poster.build({
					url: TV.posterUrl(result.banner)
				}));
								
				/*
				this.model.Season.buildWithTvDbResults(result.seasons, function(seasons) {
					show.setSeasons(seasons).success(function() {
						callback(show);
					});
				});
				*/
				
				show.save().success(function() {
					callback(show);
				});
			},
			
			mapWithTvDbResult: function(result) {
				return {
					tvDbId:			result.id,
					title: 			result.name,
					firstAired: 	moment(result.FirstAired).toDate()
				};
			}
		}
	});
	
	return Show;
	
}