define('view/media/dialog/show', ['view/media/dialog/media', 'model/show', 'collection/season', 'collection/media'], function(MediaDialog, ShowModel, SeasonCollection, MediaCollection) {
	
	var ViewMode = {
		Show: 	'show',
		Season: 'season'
	};
	
	var listItem = $('<li></li>')
		.append(
			$('<label></label>')
		)
		.append(
			$('<span></span>', { 'class': 'status' })
		)
		.append(
			$('<span></span>', { 'class': 'right' })
		)
	
	return MediaDialog.extend({
	
		viewMode: ViewMode.Show,
	
		initialize: function() {
			this.show 		= new ShowModel();
			this.seasons 	= new SeasonCollection();
			this.episodes 	= new MediaCollection();
		},
		
		postRender: function() {
			this.$el.find('.inner').append(
				$('<ul></ul>')
			);
		
			this.createEvents();
			this.fetchShow();
		},
		
		createEvents: function() {
			this.show.off('change').on('change', this.updateShow);
			this.seasons.off('add').on('add', this.addSeason);
			this.seasons.off('remove').on('remove', this.removeSeason);
			this.episodes.off('add').on('add', this.addEpisode);
			this.episodes.off('remove').on('remove', this.removeEpisode);
		},
		
		fetchShow: function() {
			this.show.fetch();
		},
		
		updateShow: function() {
			this.updateHead();
		
			if(this.viewMode === ViewMode.Show) {
				this.fetchSeasons();
			}
			else if(this.viewMode === ViewMode.Season) {
				this.fetchEpisodes();
			}
		},
		
		updateHead: function() {
			var head = this.$el.find('.inner .head'),
				photo = head.find('.photo');
			
			if(this.show.has('poster')) {
				var poster = this.show.get('poster');
				
				photo.find('img').attr('src', poster.url);
			}
			
			
		},
		
		fetchSeasons: function() {
			this.seasons.fetch();
		},
		
		fetchEpisodes: function() {
			this.episodes.fetch();
		},
		
		addSeason: function(season) {
			season.listItem = listItem.clone();
			
			season.listItem.find('label').text('Season ' + season.get('number'));
			season.listItem.find('span.status').addClass(season.watchedStatusClass()).text(season.unatchedCount());
			season.listItem.find('span.right').text(season.get('year'));
		
			this.$el.find('.inner ul').append(season.listItem);
		},
		
		removeSeason: function(season) {
			
		},
		
		addEpisode: function(episode) {
			
		},
		
		removeEpisode: function(episode) {
			
		}
		
	});
	
});