define('model/show', ['model/core', 'moment'], function(CoreModel, moment) {
	
	return CoreModel.extend({
		
		label: function() {
			return this.get('title') + ' (' + this.get('firstAired').format('YYYY') + ')';
		},
		
		parse: function(response) {
			response = response.tvshow || response;
		
			if(typeof response.firstAired != 'undefined') {
				response.firstAired = moment(response.firstAired);
			}
		
			return response;
		},
		
		url: function() {
			return '/media/tvshow' + (this.has('id') ? '/' + this.get('id') : '');
		}
		
	});
	
});