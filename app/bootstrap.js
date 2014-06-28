var express 		= require('express'),
	expressLess 	= require('express-less'),
	bodyParser		= require('body-parser'),
	winston			= require('winston');

module.exports = function() {

	// Express
	this.app.use(express.static(__dirname + '/public'));
	this.app.use('/css', expressLess(__dirname + '/public/less'));
	this.app.set('view engine', 'jade');
	this.app.set('views', __dirname + '/views');
	this.app.use(bodyParser.urlencoded());
	this.app.use(bodyParser.json());
		
	
	// Log
	this.log.add(winston.transports.File, { filename: 'playback.log' });
	
};