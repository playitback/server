var MediaController;

module.exports = {

	getIndex: function() {
		var type 		= this.req.params.type,
			model 		= this.model[type == 'tvshow' ? 'Show' : 'Movie'],
			self		= this;
							
		model.findAll().success(function(medias) {
			var response = {};
			
			response[type] = [];
			
			if(medias.length === 0) {
				self.response(response);
				
				return;
			}
			
			medias.forEach(function(media) {
				var _response = media.values;
			
				media.getPoster().success(function(poster) {
					_response.poster = poster.values;
					
					response[type].push(_response);
					
					if(response[type].length === medias.length) {
						self.response(response);
					}
				});
			});
		});
	},
	
	postIndex: function() {
		var self = this;
	
		if(typeof this.req.body.tvDbId != 'undefined') {
			this.model.Show.createWithTvDbId(this.req.body.tvDbId, function(show) {
				self.response({ tvshow: show });
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
			
		require('../lib/provider/data/' + this.req.params.type).search.call(this, query, function(medias) {
			var results = [];
		
			medias.forEach(function(media) {
				self.response({ results: media });
			});
		});
	}
	
};