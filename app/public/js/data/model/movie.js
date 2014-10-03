define('model/movie', ['model/media', 'moment'], function(MediaModel, moment) {
	
	return MediaModel.extend({
	
		label: function() {
			return this.get('name');
		},
		
		parse: function(response) {
			response = response.movie || response;
		
			if(typeof response.availableDate != 'undefined') {
				response.availableDate = moment(response.availableDate);
			}
					
			return response;
		}
		
	});
	
});