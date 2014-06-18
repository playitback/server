var express 		= require('express'),
	expressLess 	= require('express-less'),
	bodyParser		= require('body-parser');

module.exports = function() {
	
	var config;
	
	try {
		config = require('../config/' + this.env);
	}
	catch(e) {
		throw 'Configuration for environment (' + this.env + ') doesn\'t exist.';
	}
	
	// Configure defaults
	app.use(express.static(__dirname + '/../public'));
	app.use('/css', expressLess(__dirname + '/../public/less'));
	app.set('view engine', 'jade');
	app.set('views', __dirname + '/../views');
	app.use(bodyParser.urlencoded());
	app.use(bodyParser.json());
	
	config(this.app);
	
}