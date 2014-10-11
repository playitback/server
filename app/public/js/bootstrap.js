requirejs.config({
	baseUrl: '/js/lib',
	paths: {
		view: '../view',
		model: '../data/model',
		collection: '../data/collection',
		router: '../router',
		'const': '../data/const'
	}
});

requirejs(['router', 'jquery'], function(Router) {
	require(['jquery.bootstrap'], function(SettingsCollection) {
		this.router = new Router();
		
		require(['collection/settings'], function(SettingsCollection) {
			window.settings = new SettingsCollection();
		
			window.settings.fetch();	
		});
	});
});