define('collection/search', ['backbone', 'model/search'], function(Backbone, SearchModel) {
	
	return Backbone.Collection.extend({
	
		model: SearchModel,
		
		url: '/media/search',
		
		parse: function(response) {
			return response.results || response;
		}
		
	});
	
});