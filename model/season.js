var Sequelize 	= require('sequelize'),	
	moment		= require('moment');

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
			createWithTvDbResult: function(result, callback) {
				this.create(this.mapWithTvDbResult(result))
					.success(function(season) {
						callback(season);	
					});
			},
			
			mapWithTvDbResult: function(result) {
				return {
					number: result.SeasonNumber,
					year: moment(result.FirstAired).format('YYYY')
				};
			}
		}
	});
	
}