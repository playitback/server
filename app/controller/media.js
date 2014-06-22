module.exports = {

	getIndex: function() {
		var showId 		= this.req.params.showId,
			type		= this.req.params.type,
			response 	= {};
	
		if(typeof showId != 'undefined') {
			
		}
		else if(typeof type != 'undefined') {
			this.model.modelWithType(type).getMediaForIndex(function(media) {
				response[type] = media;
				
				self.response(response);
			});
		}
	},
	
	postIndex: function() {
		var self = this;
	
		if(typeof this.req.body.tvDbId != 'undefined') {
			this.model.Show.createWithTvDbId(this.req.body.tvDbId, function(show) {
				show.getPoster().success(function(poster) {
					var response = show.values;
					
					response.poster = poster.values;
					
					self.response({ tvshow: response });
				});
			});
		}
	},

	getSearch: function() {	
		var query,
			type,
			self = this;
	
		if(!(query = this.input('query'))) {
			throw 'missing_required_param';
		}
			
		require('../lib/provider/data/' + this.req.params.type).search.call(this, query, function(media) {		
			self.response({ results: media });
		});
	}
	
};