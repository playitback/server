module.exports = function() {
	
	this.config = {};
	
	try {
		this.config = require('../config/' + this.env);
	}
	catch(e) {
		throw 'Configuration for environment (' + this.env + ') doesn\'t exist.';
	}
	
	this.get = function(key) {
		var keyParts = key.split('.'),
			value = null;
			
		for(var key in keyParts) {
			value = this.config[key] || value;
		}
		
		return value;
	};
	
}