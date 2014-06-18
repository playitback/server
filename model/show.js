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
			
			createWithTvDbId: function(tvDbId, callback) {
				var _self = this;
			
				TV.tvdb().getInfo(tvDbId, function(result) {
					_self.createWithTvDbResult(result, function(show) {
						callback(show);
					});
				});
			},
			
			createWithTvDbResult: function(result, callback) {
				this.create(this.mapWithTvDbResult(result))
					.success(function(show) {
						show.setPoster(self.model.Poster.create(self.model.Poster.mapWithTvDbResult(result))
							.success(function() {
								self.model.Season.buildWithTvDbResults(result.seasons, function(seasons) {
									show.setSeasons(seasons).success(function() {
										callback(show);
									});
								});
							});
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