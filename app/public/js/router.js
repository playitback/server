define('router', ['backbone', 'view/home', 'view/media', 'view/settings'], function(Backbone, HomeView, MediaView, SettingsView) {
	
	return Backbone.Router.extend({
		
		routes: {
			'':					'homeAction',
			'home':				'homeAction',
			'media/:type':		'mediaAction',
			'settings':			'settingsAction'
		},
		
		initialize: function() {
			Backbone.history.start();
		},
		
		homeAction: function() {
			new HomeView().render();
		},
		
		mediaAction: function(type) {
			new MediaView({ type: type }).render();
		},
		
		settingsAction: function() {
			new SettingsView().render();
		}
		
	});
	
});