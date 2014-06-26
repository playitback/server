define('model/search', ['backbone', 'model/show', 'model/media', 'const/index'], function(Backbone, ShowModel, MediaModel, Const) {
	
	return Backbone.Model.extend({
		
		label: function() {
			return this.get('title') + ' <span>' + this.get('year') + '</span>';
		},
		
		mediaObject: function() {
			var type = this.get('type');
			
			if(type === Const.Type.TV) {
				return new ShowModel(this.attributes);
			}
			else if(type === Const.Type.Movie) {
				return new MediaModel(this.attributes);
			}
			else {
				throw 'Invalid type';
			}
		}
		
	});
	
});