define('router', ['backbone', 'view/home', 'view/media', 'view/settings'], function(Backbone, HomeView, MediaView, SettingsView) {
	
	this.setCurrentSection = function(section) {
		$('ul.main li').removeClass('current');
		$('ul.main li.' + section).addClass('current');
	}
	
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
			this.loadView(HomeView);
		},
		
		mediaAction: function(type) {
			this.loadView(MediaView, { type: type });
		},
		
		settingsAction: function() {
			this.loadView(SettingsView);
		},
		
		loadView: function(view, options) {
			$('#content').html('');
			$('.header').remove();
			
			new view(options).render();
		}
		
	});
	
});