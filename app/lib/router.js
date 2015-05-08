var fs = require('fs'),
	Request = require('./request');

module.exports = function() {

	var router = this,
        config = this.get('config'),
        routes = config.get('routes');

    if(typeof routes != 'object') {
        throw 'Invalid routes definition. Must be an object.';
    }

	this.subHttpRequests = [];

	function handle404(res) {
		res.status(404).render('404');
	}
	
	function ucFirst(string) {
		return string.substring(0,1).toUpperCase() + string.substring(1);
	}
	
	function cancelSubHttpRequests() {
		for(var key in router.subHttpRequests) {
			router.subHttpRequests[key].abort();
		}
	}
	
	for(var uri in routes) {
		this.get('server').all(uri, function(req, res) {
			req.on('aborted', function() {
				cancelSubHttpRequests();
			});
		
			var route = routes[req.route.path],
				parts = route.split('@'),
				rootKey = req.body.rootKey || req.query.rootKey || null;

			var controllerName = parts.length > 0 ? parts[0] : null,
				actionName		= parts.length > 1 ? parts[1] : 'index';
								
			if(!controllerName) {
				handle404(res);
				
				return;
			}
			
			var controller;
			var request = new Request(req, res, rootKey);

			try {
				controller = require('../controller/' + controllerName);

                // Add DI integration
                router.get('container').extend(controller);
			}
			catch(e) {
				request.errorResponse(e.message, 400);
				
				return;
			}
						
			var action = controller[actionName + 'Action'];
						
			if(typeof action != 'function') {
				action = controller[req.method.toLowerCase() + ucFirst(actionName)];
			}
						
			if(typeof action != 'function') {
				handle404(res);
				
				return;
			}
			
			try {
				action.call(request);
			}
			catch(e) {
				//throw e;

				request.errorResponse.call(request, e);
			}
		});
	}

	return this;
};