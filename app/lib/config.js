module.exports = function(app) {
	
	var config = {};
	
	try {
		config = require('../config/' + app.env);
	}
	catch(e) {
		throw 'Configuration for environment (' + app.env + ') doesn\'t exist.';
	}

	this.get = function(key) {
		var keyParts = key.split('.'),
			value = null;

		console.log('get config with key', key);

		for(var i in keyParts) {
			if(value && typeof value[keyParts[i]] != 'undefined') {
				value = value[keyParts[i]];
			}

			if(typeof config[keyParts[i]] != 'undefined') {
				value = config[keyParts[i]];
			}

			if(typeof value != 'object') {
				break;
			}
		}

		return value;
	};

	return this;
	
};