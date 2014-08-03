define('collection/settings', ['backbone', 'model/setting'], function(Backbone, SettingModel) {
	
	return Backbone.Collection.extend({
		
		model: SettingModel
		
	});
	
});