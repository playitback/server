var Sequelize = require('sequelize'),
	Model;

module.exports = function() {

	this.sequelize = new Sequelize({
		dialect: 'sqlite',
		storage: 'mediamanager.sqlite'
	}),

	this.Poster		= require('./poster').call(this);
	this.Media 		= require('./media').call(this);
	this.Season 	= require('./season').call(this);
	this.Show		= require('./show').call(this);
	
	this.Show.hasMany(this.Season);
	this.Season.hasMany(this.Media);
	this.Show.hasOne(this.Poster);
	this.Season.hasOne(this.Poster);
	this.media.hasOne(this.Poster);

};