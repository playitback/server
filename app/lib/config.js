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
			if(value && typeof value[keyParts[i]] != 'undefined') {
				value = value[keyParts[i]];
			}
				
			if(typeof this._config[keyParts[i]] != 'undefined') {
				value = this._config[keyParts[i]];
			}
			
			if(typeof value != 'object') {
				break;
			}
		}
		
		return value;
	};
	
	return this;
	
}