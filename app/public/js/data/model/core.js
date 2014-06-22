define('model/core', ['backbone'], function(Backbone) {
	
	return Backbone.Model.extend({
		
		watchedStatusClassName: function() {
			var className = 'unwatched';
		
			if(this.model.has('stats')) {
				var stats = this.model.get('stats');
				
				if(stats.episodeCount === stats.watchedCount) {
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