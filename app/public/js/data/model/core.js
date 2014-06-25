define('model/core', ['backbone', 'const/index'], function(Backbone, Const) {
	
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
			if(this.has('stats')) {
				var stats = this.get('stats');
				
				return (stats.episodeCount - stats.watchedCount);
			}
			
			return '';
		}
		
	});
	
});