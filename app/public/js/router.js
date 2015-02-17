define('router', [
	'backbone', 'view/home', 'view/media/index', 'view/settings', 'view/media/info', 'view/media/season'], 
	function(Backbone, HomeView, MediaView, SettingsView, MediaInfoView, MediaSeasonView) {
	
	this.setCurrentSection = function(section) {
		$('ul.main li').removeClass('current');
		$('ul.main li.' + section).addClass('current');
	}
	
	return Backbone.Router.extend({
		
		routes: {
			'':																	'homeAction',
			'home':																'homeAction',
			'media/:type':														'mediaAction',
			'media/:type/:mediaId':												'mediaViewAction',
			'media/:type/:mediaId/season/:seasonNumber': 						'mediaViewAction',
			'media/:type/:mediaId/season/:seasonNumber/episode/:episodeNumber':	'mediaViewAction',
			'settings':															'settingsAction',
			'settings/:type':													'settingsAction'
		},
		
		initialize: function() {

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
		
		settingsAction: function(type) {
			this.loadView(SettingsView, { type: type });
		},
		
		loadView: function(view, options) {
			$('#content').html('');
			$('.header').remove();
			
			new view(options).render();
		}
		
	});
	
});