define('model/core', ['backbone', 'const/index', 'view/media/dialog/movie', 'view/media/dialog/show'], function(Backbone, Const, MovieDialog, ShowDialog) {
	
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
		},
		
		year: function() {
			if(this.has('firstAired')) {
				return this.get('firstAired').format('YYYY');
			}
			else if(this.has('year')) {
				return this.get('year');
			}
		},
		
		dialog: function() {
			if(this.has('type')) {
				if(this.get('type') === Const.Type.TV) {
					new ShowDialog({ model: this });
				}
				else if(this.get('type') === Const.Type.Movie) {
					new MovieDialog({ model: this });
				}
			}
			
			return null;
		}
		
	});
	
});