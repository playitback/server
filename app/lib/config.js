var fs = require('fs');

module.exports = function() {
	
	var config = {};

	var recursivelyLoadConfig = function(directory) {
		fs.readdirSync(directory).forEach(function(fileName) {
			if (fileName.indexOf('.js') > -1) {
				config[fileName.replace('.js', '')] = require(directory + '/' + fileName);
			}
		});
	};

	recursivelyLoadConfig(__dirname + '/../config');
	recursivelyLoadConfig(__dirname + '/../config/' + process.env.NAME);

	this.get = function(key) {
		var keyParts = key.split('.'),
			value = null;

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