var express 	= require('express'),
	TheMovieDB	= require('themoviedb'),
	winston		= require('winston'),
	events		= require('events');

var App = function() {
	
	events.EventEmitter.call(this);
	
	this.env			= process.env.ENV || 'dev';	
	this.app 			= express();
	this.log			= winston;
	
	require('./bootstrap').call(this);
	require('./lib/config').call(this);
	require('./lib/router').call(this, require('./routes'));
	
	this.config			= require('./lib/config').call(this);
	this.model 			= require('../model').call(this);
	this.broadcast		= require('./lib/broadcast').call(this);
	
	this.theMovieDb 	= new TheMovieDB({ apiKey: this.config.get('theMovieDb.apiKey') }); // @TODO: load from config
	
	this.log.debug('Playback server started and running on port 3030');
	this.app.listen(3030);
		
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