var Sequelize = require('sequelize'),
	Model;

module.exports = function() {

	this.sequelize = new Sequelize('database', 'username', 'password', {
		dialect: 'sqlite',
		storage: 'mediamanager.sqlite'
	}),

	this.Poster		= require('./poster').call(this);
	this.Media 		= require('./media').call(this);
	this.Season 	= require('./season').call(this);
	this.Show		= require('./show').call(this);
	this.Torrent	= require('./torrent').call(this);
		
	this.Show.hasMany(this.Season);
	this.Season.hasMany(this.Media, { as: 'Episodes' });
	this.Show.hasOne(this.Poster);
	this.Season.hasOne(this.Poster);
	this.Media.hasOne(this.Poster, { as: 'Still' });
	this.Media.hasMany(this.Torrent);
	
	this.sequelize.sync();
	//this.sequelize.sync({ force: true });
	
	// Helpers
	
	this.modelWithType = function(type) {
		if(type === this.Media.Type.TV) {
			return this.Show;
		}
		else if(type === this.Media.Type.Movie) {
			return this.Media;
		}
		else {
			throw 'invalid_type';
		}
	}
	
	this.log.debug('DB & Models initialized');
	
	return this;

};