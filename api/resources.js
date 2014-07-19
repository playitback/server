module.exports = function() {

	var self = this;

	var requireAndBind = function(path) {
		var resource = require(path);
		
		if(typeof resource === 'object') {
			for(var key in resource) {
				resource[key] = resource[key].bind(self);
			}
		}
		
		return resource;
	};
	
	this.app.resource('media', requireAndBind('./resource/media'));
	
}