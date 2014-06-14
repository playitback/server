module.exports = function(routes) {

	if(typeof routes != 'object') {
		throw 'Invalid routes definition. Must be an object.';
	}
	
	var self = this;
	
	function handle404() {
		self.res.render('404');
	}
	
	function ucFirst(string) {
		return string.substring(0,1).toUpperCase() + string.substring(1);
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
	
	for(var uri in routes) {
		this.app.all(uri, function(req, res) {
			var route = routes[req.route.path],
				parts = route.split('@');
				
			self.req = req;
			self.res = res;
			
			var controllerName 	= parts.length > 0 ? parts[0] : null,
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
				handle404();
				
				return;
			}
			
			var action = controller[actionName + 'Action'];
			
			if(typeof action != 'function') {
				action = controller[req.method + ucFirst(actionName)];
			}
			
			if(typeof action != 'function') {
				handle404();
				
				return;
			}
			
			try {
				action.call(self);
			}
			catch(e) {
				self.errorResponse.call(self, e.message, 400);
			}
		});
	}

}