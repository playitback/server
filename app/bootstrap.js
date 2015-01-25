var express 		= require('express'),
	expressLess 	= require('express-less'),
	bodyParser		= require('body-parser'),
	winston			= require('winston');

module.exports = function(app) {

	// Express
	app.server.use(express.static(__dirname + '/public'));
	app.server.use('/css', expressLess(__dirname + '/public/less'));
	app.server.set('view engine', 'jade');
	app.server.set('views', __dirname + '/views');
	app.server.use(bodyParser.urlencoded());
	app.server.use(bodyParser.json());
		
	
	// Log
	app.log.add(winston.transports.File, { filename: 'playback.log', level: 'debug' });
	
	if(app.env === 'dev') {
		app.log.remove(winston.transports.Console);
		app.log.add(winston.transports.Console, { level: 'debug' });
	}
	
};