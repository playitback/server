var Sequelize 	= require('sequelize'),
	TV			= require('../app/lib/provider/data/tvshow');

module.exports = function() {

	return this.sequelize.define('Poster', {
		url: {
			type: Sequelize.STRING
		}
	}, {
		classMethods: {
			mapWithTvDbResult: function(result) {
				return {
					url: TV.posterUrl(result.poster)
				}
			}
		}
	});

};