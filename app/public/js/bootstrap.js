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
	require(['jquery.bootstrap'], function() {
		this.router = new Router();
	});
});