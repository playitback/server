define('collection/search', ['backbone'], function(Backbone) {
	
	return Backbone.Collection.extend({
		
		url: '/media/search'
		
	});
	
});