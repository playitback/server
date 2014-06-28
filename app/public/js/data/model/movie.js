define('model/movie', ['model/media'], function(MediaModel) {
	
	return MediaModel.extend({
	
		label: function() {
			return this.get('name');
		},
		
		parse: function(response) {
			return response.movie || response;
		}
		
	});
	
});