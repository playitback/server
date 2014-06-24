module.exports = function(runHandler) {

	if(typeof runHandler != 'function') {
		throw 'Unit test runHandler not set or not valid';
	}

	this.asert = require('assert');
	
	var test = {
		app: null,
		run: function() {
			if(!this.app) {
				throw 'test.app should be set before running a test';
			}
			
			runHandler.call(this.app);
		}
	};
	
	require('../app');
	
};