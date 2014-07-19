var express 	= require('express'),
	Resource	= require('express-resource');

module.exports = function(app) {

	// Bind required data
	this.model 		= app.model;	
	this.env		= app.env;
	this.log		= app.log;
	this.config		= app.config;
	this.tasks		= app.tasks;
	
	// Create app
	this.app = express();
	
	// Initialise resources
	require('./resources').call(this);
	
	// Listen
	this.app.listen(3031);
	this.log.debug('Playback API server listening on port 3031');
	
};