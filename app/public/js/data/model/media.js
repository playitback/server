define('model/media', ['model/core', 'const/index'], function(CoreModel, Const) {
	
	/**
	 * Doesn't make perfect sense as Show will subclass this, but this represents visible media
	 */
	
	return CoreModel.extend({

		status: function() {
			return this.watchedStatusClassName();
		}
			
	});
	
});