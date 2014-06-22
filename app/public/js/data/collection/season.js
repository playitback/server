define('collection/season', ['backbone', 'model/season'], function(Backbone, SeasonModel) {
	
	return Backbone.Collection.extend({
		
		model: SeasonModel
		
	});
	
});