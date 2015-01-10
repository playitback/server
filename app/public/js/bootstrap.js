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

// Global storage
window.app = {};

requirejs(['router', 'jquery'], function(Router) {
	require(['jquery.bootstrap'], function() {
		app.router = new Router();
		
		require(['collection/settings'], function(SettingsCollection) {
			app.settings = new SettingsCollection();

			var startRouter = function() {
				Backbone.history.start();

				// Redirect a query string hash request to sync settings
				if ('string' == typeof window.location.hash &&
					window.location.hash.indexOf('access_token=') > -1 &&
					window.location.hash.indexOf('settings/sync') === -1) {
					app.router.navigate('settings/sync?' + window.location.hash.substr(1));
				}
			};

			app.settings.fetch({
				success: function() {
					startRouter();
				},
				error: function() {
					startRouter();
				}
			});
		});
	});
});