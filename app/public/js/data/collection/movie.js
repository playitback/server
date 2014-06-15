define('collection/movie', ['backbone', 'model/movie'], function(Backbone, MovieModel) {
	
	return Backbone.Collection.extend({
		
		searchMode: false,
		
		model: MovieModel,
		
		initialize: function(options) {
			this.searchMode = options && options.search || this.searchMode;
		},
		
		search: function(options) {
			this.searchMode = true;
						
			return this.fetch(options);
		},
		
		url: function() {
			if(this.searchMode) {
				return '/media/movies/search';
			}
			else {
				return '/media/movies';
			}
		},
		
		parse: function(response) {
			if(this.searchMode) {
				return response.results || response;
			}
			else {
				return response.movies || response;
			}
		}
		
	});
	
});