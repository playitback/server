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

requirejs(['router'], function(Router) {
	this.router = new Router();
});