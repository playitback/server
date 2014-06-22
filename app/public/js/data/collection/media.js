define('collection/media', ['backbone', 'model/media'], function(Backbone, MediaModel) {
	
	return Backbone.Collection.extend({
	
		model: MediaModel,
		
		season: null,
		
		fetchWithSeason: function(season, options) {
			this.season = season;
			
			this.fetch(options);
		},
		
		url: function() {
			if(this.season) {
				return '/media/season/' + this.season.id;
			}
			else {
				return '/media';
			}
		}
		
	});
	
});