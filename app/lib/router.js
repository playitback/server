module.exports = function(routes) {

	if(typeof routes != 'object') {
		throw 'Invalid routes definition. Must be an object.';
	}
	
	var app = this,
		subHttpRequests = [];
	
	function handle404() {
		app.res.status(404).render('404');
	}
	
	function ucFirst(string) {
		return string.substring(0,1).toUpperCase() + string.substring(1);
	}
	
	function cancelSubHttpRequests() {
		for(var key in subHttpRequests) {
			subHttpRequests[key].abort();
		}
	}
	
	this.view = function(name) {
		this.res.render(name);
	};
	
	this.response = function(data, status) {
		if(typeof status === 'undefined') {
			status = 200;
		}
						
		this.res.json(status, data);
	};
	
	this.errorResponse = function(error, status) {
		if(typeof status === 'undefined') {
			status = 400;
		}
				
		if(this.req.header('Accept').indexOf('text/html') > -1) {
			this.view('400');
		}
		else {
			this.response({ error: error }, status);
		}
	};
	
	this.input = function(key) {
		var query = this.req.query;
				
		if(typeof query[key] != 'undefined') {
			return query[key];
		}
		
		return null;
	};
	
	this.addSubHttpRequest = function(request) {
		var self = this;
		
		var removeRequest = function() {
			subHttpRequests.splice(subHttpRequests.indexOf(this), 1);
		};
	
		request.on('abort', function() {
			removeRequest();
		});
		request.on('complete', function() {
			removeRequest();
		});
		request.on('error', function() {
			removeRequest();
		});
		
		subHttpRequests.push(request);
	}
	
	for(var uri in routes) {
		this.app.all(uri, function(req, res) {
			req.on('aborted', function() {
				cancelSubHttpRequests();
			});
		
			var route = routes[req.route.path],
				parts = route.split('@');
								
			app.req = req;
			app.res = res;
			
			var controllerName = parts.length > 0 ? parts[0] : null,
				actionName		= parts.length > 1 ? parts[1] : 'index';
								
			if(!controllerName) {
				handle404();
				
				return;
			}
			
			var controller;
				
			try {
				controller = require('../controller/' + controllerName);
			}
			catch(e) {				
				app.errorResponse(400);
				
				return;
			}
						
			var action = controller[actionName + 'Action'];
						
			if(typeof action != 'function') {
				action = controller[req.method.toLowerCase() + ucFirst(actionName)];
			}
						
			if(typeof action != 'function') {
				handle404();
				
				return;
			}
			
			try {
				action.call(app);
			}
			catch(e) {
				console.log('error: ' + e);
			
				app.errorResponse.call(app, e);
			}
		});
	}

}