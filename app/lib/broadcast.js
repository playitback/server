var dgram = require('dgram');

module.exports = function() {

    var log = this.get('log');

	var server = dgram.createSocket('udp4');
	
	server.bind(41234);
	
	log.debug('Broadcasting on port 41234');

	return this;
	
};