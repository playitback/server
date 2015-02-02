var express 		= require('express'),
	TheMovieDB		= require('themoviedb'),
	winston			= require('winston'),
	events			= require('events'),
	Config			= require('./lib/config'),
	Model			= require('../model'),
	Settings		= require('./lib/setting'),
	Tasks			= require('../tasks'),
	Bootstrap		= require('./bootstrap'),
	Router			= require('./lib/router'),
	Notification 	= require('./lib/notification'),
	routes 			= require('./config/routes');

var App = function() {
	
	// Bind to event emitter
	events.EventEmitter.call(this);
	
	// Initialize external parameters
	this.env			= process.env.ENV || 'dev';	
	this.server 		= express();
	this.log			= winston;
	
	// Initialize app files
	new Bootstrap(this);
	new Router(this, routes);
	
	// Initialize libraries and external entities
	this.config			= new Config(this);
	this.model 			= new Model(this);
	this.settings 		= new Settings(this);
	this.tasks			= new Tasks(this);
	this.notification	= new Notification(this);
	//this.broadcast		= require('./lib/broadcast')(this);

	// Initialize API libraries
	this.theMovieDb 	= new TheMovieDB({ apiKey: this.config.get('networks.theMovieDb.apiKey') });
	
	this.log.remove(winston.transports.Console);
	this.log.addColors({
		debug: 'blue',
		info: 'green',
		warn: 'yellow',
		error: 'red'
	});
	this.log.add(winston.transports.Console, { level: 'debug', colorize:true });
	
	// Listen for events
	this.server.listen(3030);
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