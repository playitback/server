var express = require('express');

var App = function() {
	
	this.env	= process.env.ENV || 'dev';
	this.app 	= express();
	this.model 	= require('../model')();
	
	require('./lib/config').call(this);
	require('./lib/router').call(this, require('./routes'));
	
	this.app.listen(3030);
	
};

App();