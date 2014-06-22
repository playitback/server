define('model/media', ['backbone'], function(Backbone) {
	
	/**
	 * Doesn't make perfect sense as Show will subclass this, but this represents visible media
	 */
	
	return Backbone.Model.extend({
		
		
		seen: function() {
			
		}
		
	});
	
});