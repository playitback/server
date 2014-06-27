var express 	= require('express'),
	TheMovieDB	= require('themoviedb'),
	winston		= require('winston');

var App = function() {
	
	this.env			= process.env.ENV || 'dev';
	
	this.app 			= express();
	this.log			= winston;
	this.model 			= require('../model').call(this);
	this.theMovieDb 	= new TheMovieDB({ apiKey: 'fd8c8d9adabc2d072ef3d436396a87fb' }); // @TODO: load from config
	
	require('./lib/config').call(this);
	require('./lib/router').call(this, require('./routes'));
	
	this.app.listen(3030);
	
	this.log.debug('Playback server started and running on port 3030');
	
};

var app = App();

if(typeof test != 'undefined') {
	test.app = app;
	
	test.run();
}