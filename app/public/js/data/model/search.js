define('model/search', ['backbone'], function(Backbone) {
	
	return Backbone.Model.extend({
		
		label: function() {
			return this.get('title') + ' <span>' + this.get('year') + '</span>';
		}
		
	});
	
});