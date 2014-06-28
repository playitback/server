define('model/search', ['backbone', 'model/show', 'model/movie', 'const/index', 'moment'], function(Backbone, ShowModel, MovieModel, Const, moment) {
	
	return Backbone.Model.extend({
	
		parse: function(response) {
			if(typeof response.firstAired === 'string') {
				response.firstAired = moment(response.firstAired);
			}
		
			return response;
		},
		
		label: function() {
			var year = '';
			
			if(this.has('year')) {
				year = this.get('year');
			}
			else if(this.has('firstAired')) {
				year = this.get('firstAired').format('YYYY');
			}
		
			return this.get('title') + ' <span>' + year + '</span>';
		},
		
		mediaObject: function() {
			var type = this.get('type');
			
			if(type === Const.Type.TV) {
				return new ShowModel(this.attributes);
			}
			else if(type === Const.Type.Movie) {
				return new MovieModel(this.attributes);
			}
			else {
				throw 'Invalid type';
			}
		}
		
	});
	
});