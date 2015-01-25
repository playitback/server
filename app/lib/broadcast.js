var dgram = require('dgram');

module.exports = function(app) {

	var server = dgram.createSocket('udp4');
	
	server.bind(41234);
	
	app.log.debug('Broadcasting on port 41234');

	return this;
	
};