define('model/media', ['model/core', 'const/index'], function(CoreModel, Const) {
	
	/**
	 * Doesn't make perfect sense as Show will subclass this, but this represents visible media
	 */
	
	return CoreModel.extend({

		status: function() {
			var state = this.get('state'),
				watchStatus = this.get('watchStatus');

			// Seen status takes priority. If they've seen it, they must have it downloaded
			if (watchStatus == Const.WatchStatus.Watched) {
				return Const.WatchStatus.Watched;
			}
			else {
				return state;
			}
		}
			
	});
	
});