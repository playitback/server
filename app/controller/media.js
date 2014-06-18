var MediaController;

module.exports = {

	getIndex: function() {
		var type 		= this.req.params.type,
			model 		= this.model[type == 'tvshow' ? 'Show' : 'Movie'],
			self		= this;
							
		model.findAll().success(function(medias) {
			var response = {};
			
			response[type] = [];
			
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
		//this.model.Media.create
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
				var result = media.values;
								
				media.getPoster().success(function(poster) {
					result.poster = poster.values;
					
					results.push(result);
										
					if(results.length === medias.length) {
						self.response({ results: results });
					}
				});
			});
		});
	}
	
};