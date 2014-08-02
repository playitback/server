define('router', [
	'backbone', 'view/home', 'view/media/index', 'view/settings', 'view/media/info', 'view/media/season'], 
	function(Backbone, HomeView, MediaView, SettingsView, MediaInfoView, MediaSeasonView) {
	
	this.setCurrentSection = function(section) {
		$('ul.main li').removeClass('current');
		$('ul.main li.' + section).addClass('current');
	}
	
	return Backbone.Router.extend({
		
		routes: {
			'':																'homeAction',
			'home':															'homeAction',
			'media/:type':													'mediaAction',
			'media/:type/:mediaId':											'mediaViewAction',
			'media/:type/:mediaId/season/:seasonId': 						'mediaSeasonAction',
			'media/:type/:mediaId/season/:seasonId/episode/:episodeId':		'mediaViewAction',
			'settings':														'settingsAction'
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
		
		mediaViewAction: function(type, mediaId, seasonId, episodeId) {
			this.loadView(MediaInfoView, { type: type, mediaId: mediaId, seasonId: seasonId, episodeId: episodeId });
		},
		
		mediaSeasonAction: function(type, mediaId, seasonId) {
			this.loadView(MediaInfoView, { type: type, mediaId: mediaId, seasonId: seasonId });
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