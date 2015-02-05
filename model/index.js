var Sequelize 	= require('sequelize'),
	events		= require('events'),
	DropboxSync	= require('../app/lib/dropboxsync');

module.exports = function(app) {

	this.app = app;

	this.sequelize = new Sequelize('database', 'username', 'password', {
		dialect: 'sqlite',
		storage: 'mediamanager.sqlite'
	}),

	this.Setting	= require('./setting').call(this, app);
	this.Poster		= require('./poster').call(this, app);
	this.Media 		= require('./media').call(this, app);
	this.Season 	= require('./season').call(this, app);
	this.Show		= require('./show').call(this, app);
	this.Torrent	= require('./torrent').call(this, app);
			
	this.Show.hasMany(this.Season, { onDelete: 'CASCADE' });
	this.Season.hasMany(this.Media, { as: 'Episodes', onDelete: 'CASCADE' });
	this.Show.hasOne(this.Poster, { onDelete: 'CASCADE' });
	this.Season.hasOne(this.Poster, { onDelete: 'CASCADE' });
	this.Media.hasOne(this.Poster, { as: 'Still', onDelete: 'CASCADE' }); 	// TV
	this.Media.hasOne(this.Poster, { onDelete: 'CASCADE' });				// Movie
	this.Media.hasMany(this.Torrent, { onDelete: 'CASCADE', foreignKey: 'MediaId' });
	this.Media.hasOne(this.Torrent, { as: 'DownloadingTorrent', foreignKey: 'DownloadingTorrentId' });
	this.Torrent.belongsTo(this.Media, { as: 'Media' });

	this.sequelize.sync({  }).then(function() {
		//self.Setting.setValueWithKey('pl1DmfdZ2uIAAAAAAAAL4K9qSvlLJXSShdFboHBZ5nZsUsickQ8i64HO2eqX2PQA', self.Setting.Key.DropboxToken, function() {});
	
		app.emit('model-sync');
	});
	//this.sequelize.sync({ force: true });

	// Helpers
	
	this.mediaModelWithType = function(type) {
		if(type === this.Media.Type.TV) {
			return this.Show;
		}
		else if(type === this.Media.Type.Movie) {
			return this.Media;
		}
		else {
			throw 'invalid_type';
		}
	};

	this.mediaUpdateWithTypeAndRemoteId = function(type, remoteId, callback) {
		var self = this;

		this.sequelize.transaction().then(function(transaction) {
			self.mediaModelWithType(type).createWithRemoteId(remoteId, transaction, function(error, media) {
				if (!error && media) {
					transaction.commit();

					callback(null, media);
				}
				else {
					callback(error, null);
				}
			});
		});
	};
	
	DropboxSync.call(app);

	app.log.debug('DB & Models initialized');
		
	return this;

};