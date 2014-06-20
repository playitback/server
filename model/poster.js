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
				for(var i in result.banners) {
					var banner = result.banners[i];
					
					if(banner.type === 'poster') {
						return {
							url: TV.posterUrl(banner.path)
						};
					}
				}
			}
		}
	});

};