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
			var head 			= this.$el.find('.inner .head'),
				photo 			= head.find('.photo'),
				meta 			= head.find('.meta'),
				metaMain 		= meta.find('.main'),
				metaMainFields 	= metaMain.find('.field'),
				metaAttr 		= meta.find('.attr');
			
			if(this.show.has('poster')) {
				var poster = this.show.get('poster');
				
				photo.find('img').attr('src', poster.url);
			}
			
			metaMain.find('h2').text(this.show.get('title'));
			
			var metaMainField 		= metaMainFields.find('.field').clone(),
				firstAiredField 	= metaMainField.clone(),
				nextEpisodeField	= metaMainField.clone();
			
			metaMainFields.find('.field').remove();
			
			firstAiredField.find('label').text('First Aired');
			firstAiredField.find('span').text('');
			nextEpisodeField.find('label').text('Next Episode');
			nextEpisodeField.find('span').text('');
			
			metaMainFields
				.append(firstAiredField)
				.append(nextEpisodeField);
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
			season.listItem.find('span.status').addClass(season.watchedStatusClass()).text(season.unWatchedCount());
			season.listItem.find('span.right').text(season.get('year'));
		
			this.$el.find('.inner ul').append(season.listItem);
		},
		
		removeSeason: function(season) {
			if(typeof season.listItem != 'undefined') {
				season.listItem.remove();
			}
		},
		
		addEpisode: function(episode) {
			episode.listItem = listItem.clone();
			
			episode.listItem.find('label').text('Episode ' + episode.get('number'));
			episode.listItem.find('span.status').addClass(episode.watchedStatusClass()).text(episode.unWatchedCount());
			episode.listItem.find('span.right').text(episode.get('year'));
			
			this.$el.find('.inner ul').append(episode.listItem);
		},
		
		removeEpisode: function(episode) {
			if(typeof episode.listItem != 'undefined') {
				episode.listItem.remove();
			}
		}
		
	});
	
});