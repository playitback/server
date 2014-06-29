module.exports = function() {
	
	this._config = {};
	
	try {
		this._config = require('../config/' + this.env);
	}
	catch(e) {
		throw 'Configuration for environment (' + this.env + ') doesn\'t exist.';
	}
	
	this.get = function(key) {
		var keyParts = key.split('.'),
			value = null;
						
		for(var i in keyParts) {
			value = this._config[keyParts[i]] || value;
		}
		
		return value;
	};
	
	return this;
	
}