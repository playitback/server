var express 	= require('express'),
	TheMovieDB	= require('themoviedb'),
	winston		= require('winston'),
	events		= require('events');

var App = function() {
	
	// Bind to event emitter
	events.EventEmitter.call(this);
	
	// Initialize external parameters
	this.env			= process.env.ENV || 'dev';	
	this.app 			= express();
	this.log			= winston;
	
	// Initialize app files
	require('./bootstrap').call(this);
	require('./lib/router').call(this, require('./config/routes'));
	
	// Initialize libraries and external entities
	this.config			= require('./lib/config').call(this);
	this.broadcast		= require('./lib/broadcast').call(this);
	this.model 			= require('../model').call(this);
	this.tasks			= require('../tasks').call(this);
	this.settings 		= require('./lib/setting').call(this);
	
	// Initialize API libraries
	this.theMovieDb 	= new TheMovieDB({ apiKey: this.config.get('networks.theMovieDb.apiKey') }); // @TODO: load from config
	
	this.log.remove(winston.transports.Console);
	this.log.addColors({
		debug: 'blue',
		info: 'green',
		warn: 'yellow',
		error: 'red'
	})
	this.log.add(winston.transports.Console, { level: 'debug', colorize:true });
	
	// Listen for events
	this.app.listen(3030);
	this.log.debug('Playback server started and running on port 3030');
		
};

App.super_ = events.EventEmitter;
App.prototype = Object.create(events.EventEmitter.prototype, {
	constructor: {
		value: App,
		enumerable: false
	}
});

var app = new App();

if(typeof test != 'undefined') {
	test.app = app;
	
	test.run();
}