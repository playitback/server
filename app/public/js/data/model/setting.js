define('model/setting', ['backbone'], function(Backbone) {
	
	return Backbone.Model.extend({
	
		url: function() {
			if(!this.has('key')) {
				throw 'Setting key not set. Cannot fetch without it.';
			}
		
			return '/setting/' + this.get('key');
		}
		
	});
	
});