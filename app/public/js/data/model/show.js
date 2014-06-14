define('model/show', ['backbone', 'moment'], function(Backbone, moment) {
	
	return Backbone.Model.extend({
		
		label: function() {
		
			return this.get('title') + ' (' + this.get('firstAired').format('YYYY') + ')';
		},
		
		parse: function(response) {
			response.firstAired = moment(response.firstAired);
		
			return response;
		}
		
	});
	
});