module.exports = function(runHandler) {

	if(typeof runHandler != 'function') {
		throw 'Unit test runHandler not set or not valid';
	}

	this.assert = require('assert');
	
	var test = new (function() {
		this.run = function() {
			runHandler.call(this);
		};

        this.triggerRequest = function(path, data, method, headers, responseCallback) {
            if (typeof path != 'string') {
                throw 'Invalid or no path given';
            }

            // Look for callback in non-standard parameter
            if (typeof data == 'function') {
                responseCallback = data;
            }
            if (typeof headers == 'function') {
                responseCallback = headers;
            }
            if (typeof method == 'function') {
                responseCallback = method;
            }

            // Defaults
            if (typeof data != 'object') {
                data = {};
            }
            if (typeof headers != 'object') {
                headers = {};
            }
            if (typeof method != 'string') {
                method = 'GET';
            }

            this.get('router').handleRequest(
                new (function() {
                    this.method = method;
                    this.route = {
                        path: path
                    };
                    this.query = data;
                    this.header = function(name) {
                        return headers[name] || null;
                    };
                })(),
                new (function() {
                    this.status = 200;
                    this.jsonResponse = null;
                    this.viewName = null;
                    this.viewData = null;

                    this.status = function(status) {
                        this.status = status;
                    };

                    this.json = function(content) {
                        this.jsonResponse = content;

                        responseCallback.call(this);
                    };

                    this.view = function(name, data) {
                        this.viewName = name;
                        this.viewData = data;

                        responseCallback.call(this);
                    };
                })()
            );
        };
	})();
	
	require('../app');

    return this;
};