var TVDB = require('tvdb'),
	TVShowHelper;

module.exports = TVShowHelper = {

	apiKey: 			'486BF4F394DF82E9',
	
	mirror: 			null,
	instance: 			null,
	
	tvdb: function() {
		if(!TVShowHelper.instance) {
			TVShowHelper.instance = new TVDB({ apiKey: TVShowHelper.apiKey });
		}
		
		return TVShowHelper.instance;
	},
	
	getMirrors: function(callback) {
		if(!TVShowHelper.mirror) {
			TVShowHelper.tvdb().getMirrors(function(err, mirrors) {
				if(err) {
					callback(true);
					
					return;
				}
				
				// Set TVDB mirror URL locally. Remove protocol as it's not used by Node's HTTP library
				TVShowHelper.mirror = mirrors[0].url.replace('http://', '');
				
				TVShowHelper.tvdb().setMirror(TVShowHelper.mirror);
				
				callback(false);
			});
		}
		else {
			callback();
		}
	},

	search: function(query, callback) {
		var self = this;
						
		TVShowHelper.getMirrors(function(err) {
			if(err) {
				// @TODO: log error
				callback([]);
				
				return;
			}
		
			TVShowHelper.tvdb().findTvShow(query, function(err, tvShows) {
				if(err) {
					// @TODO: log error
					callback([]);
					
					return;
				}
								
				self.model.Show.buildWithTvDbResults(tvShows, function(shows) {
					callback(shows);
				});
			})
		});
	},
	
	posterUrl: function(uri) {
		return TVShowHelper.tvdb().geturi;
	}
	
};