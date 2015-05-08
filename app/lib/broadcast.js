var dgram = require('dgram');

module.exports = function() {

	var server = dgram.createSocket('udp4');
	
	server.bind(41234);
	
	this.get('log').debug('Broadcasting on port 41234');

	return this;
	
};