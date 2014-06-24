var Sequelize 	= require('sequelize');

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
							url: this.cachePosterWithUrl(banner.path)
						};
					}
				}
			},
			cachePosterWithUrl: function(url) {
				// @TODO: fetch the contents of the URL, make a local copy and return the local URL.
				// Probably relative to the root domain to make sure if the url changes (ip and port)...
				// ...it'll still work
				return url;
			}
		}
	});

};