define('collection/show', ['backbone', 'model/show'], function(Backbone, ShowModel) {
	
	return Backbone.Collection.extend({
	
		search: false,
		
		model: ShowModel,
		
		initialize: function(options) {
			this.search = options && options.search || this.search;
		},
		
		search: function(options) {
			this.search = true;
						
			return this.fetch(options);
		},
		
		url: function() {
			if(this.search) {
				return '/media/search?type=tvshow';
			}
		},
		
		parse: function(response) {
			if(this.search) {
				return response.results || response;
			}
			else {
				return response.tvshows || response;
			}
		}
		
	});
	
});