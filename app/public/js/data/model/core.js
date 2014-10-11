define('model/core', ['backbone', 'const/index'], function(Backbone, Const) {
	
	return Backbone.Model.extend({
		
		watchedStatusClassName: function() {
			var className = 'unwatched',
				state = this.get('state');
				
			if(state == Const.State.Downloaded || this.has('stats')) {
				// TV Shows - episode watched count
				if(this.has('stats')) {
					var stats = this.get('stats');
					
					if(stats.episodeCount == 0) {
						className = 'wanted';
					}
					else if(stats.episodeCount === stats.watchedCount) {
						className = 'watched';
					}
				}
				else if(this.has('watchStatus')) {
					var watchStatus = this.get('watchStatus'),
						state = this.get('state');
					
					if(watchStatus === Const.WatchStatus.Watched) {
						className = 'watched';
					}
				}
			}
			else {
				className = state;
			}	
			
			return className;
		},
		
		unWatchedCount: function() {
			if(this.has('stats')) {
				var stats = this.get('stats');
				
				return (stats.episodeCount - stats.watchedCount);
			}
			
			return '';
		},
		
		year: function() {
			if(this.has('firstAired')) {
				return this.get('firstAired').format('YYYY');
			}
			else if(this.has('year')) {
				return this.get('year');
			}
		}
		
	});
	
});