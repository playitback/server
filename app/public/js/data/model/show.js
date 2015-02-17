define('model/show', ['model/core', 'moment'], function(CoreModel, moment) {
	
	return CoreModel.extend({
		
		label: function() {
			return this.get('title') + ' (' + this.get('first_aired').format('YYYY') + ')';
		},
		
		parse: function(response) {
			response = response.tv || response;
		
			if(typeof response.first_aired != 'undefined') {
				response.first_aired = moment(response.first_aired);
			}
			//if (typeof response.)
		
			return response;
		},
		
		url: function() {
			return '/media/tv' + (this.has('id') ? '/' + this.get('id') : '');
		}
		
	});
	
});