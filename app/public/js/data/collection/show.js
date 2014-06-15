define('collection/show', ['backbone', 'model/show'], function(Backbone, ShowModel) {
	
	return Backbone.Collection.extend({
	
		searchMode: false,
		
		model: ShowModel,
		
		initialize: function(options) {
			this.searchMode = options && options.search || this.searchMode;
		},
		
		search: function(options) {
			this.searchMode = true;
						
			return this.fetch(options);
		},
		
		url: function() {
			if(this.searchMode) {
				return '/media/tvshow/search';
			}
			else {
				return '/media/tvshow';
			}
		},
		
		parse: function(response) {
			if(this.searchMode) {
				return response.results || response;
			}
			else {
				return response.tvshows || response;
			}
		}
		
	});
	
});