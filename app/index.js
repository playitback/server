var express 	= require('express'),
	TheMovieDB	= require('themoviedb');

var App = function() {
	
	this.env			= process.env.ENV || 'dev';
	
	this.app 			= express();
	this.model 			= require('../model')();
	this.theMovieDb 	= new TheMovieDB({ apiKey: 'fd8c8d9adabc2d072ef3d436396a87fb' }); // @TODO: load from config
	
	require('./lib/config').call(this);
	require('./lib/router').call(this, require('./routes'));
	
	this.app.listen(3030);
	
};

var app = App();

if(typeof test != 'undefined') {
	test.app = app;
	
	test.run();
}