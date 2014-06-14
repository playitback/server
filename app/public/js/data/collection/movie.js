define('collection/movie', ['backbone', 'model/movie'], function(Backbone, MovieModel) {
	
	return Backbone.Collection.extend({
		
		search: false,
		
		model: MovieModel,
		
		initialize: function(options) {
			this.search = options && options.search || this.search;
		},
		
		search: function(options) {
			this.search = true;
						
			return this.fetch(options);
		},
		
		url: function() {
			if(this.search) {
				return 'media/search?type=movie';
			}
		},
		
		parse: function(response) {
			if(this.search) {
				return response.results || response;
			}
			else {
				return response.movies || response;
			}
		}
		
	});
	
});