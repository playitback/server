define('model/movie', ['backbone'], function(Backbone) {
	
	return Backbone.Model.extend({
	
		label: function() {
			return this.get('name');
		}
		
	});
	
});