define('model/core', ['backbone', 'const'], function(Backbone, Const) {
	
	return Backbone.Model.extend({
		
		watchedStatusClassName: function() {
			var className = 'unwatched';
		
			if(this.has('stats')) {
				var stats = this.get('stats');
				
				if(stats.episodeCount === stats.watchedCount) {
					className = 'watched';
				}
			}
			else if(this.has('watchStatus')) {
				var watchStatus = this.get('watchStatus');
				
				if(watchStatus === Const.WatchStatus.Watched) {
					className = 'watched';
				}
			}
			
			return className;
		},
		
		unWatchedCount: function() {
			if(this.model.has('stats')) {
				var stats = this.model.get('stats');
				
				return (stats.episodeCount - stats.watchedCount);
			}
			
			return '';
		}
		
	});
	
});