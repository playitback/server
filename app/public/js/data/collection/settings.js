define('collection/settings', ['backbone', '../../../../model/settings'], function(Backbone, SettingModel) {
	
	return Backbone.Collection.extend({
		
		model: SettingModel,
		
		url: function() {
			return '/settings';
		},

		parse: function(response) {
			return response.settings || response;
		}
		
	});
	
});