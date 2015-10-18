var Sequelize 	= require('sequelize'),
    events		= require('events');

module.exports = function(app) {

    var sequelize = new Sequelize('database', 'username', 'password', {
        dialect: 'sqlite',
        storage: 'mediamanager.sqlite'
    });
    // Register in DI container
    this.set('sequelize', sequelize);

    var log = this.get('log'),
        events = this.get('events');

    // Instantiate and load models
    var settings = this.get('model.settings'),
        poster = this.get('model.poster'),
        media = this.get('model.media'),
        season = this.get('model.season'),
        show = this.get('model.show'),
        torrent = this.get('model.torrent');

    show.hasMany(season, { as: 'seasons', onDelete: 'CASCADE' });
    show.hasOne(poster, { onDelete: 'CASCADE' });
    show.hasOne(poster, { as: 'backdrop', onDelete: 'CASCADE' });
    season.hasMany(media, { as: 'episodes', onDelete: 'CASCADE' });
    season.hasOne(poster, { onDelete: 'CASCADE' });
    season.belongsTo(show);
    media.hasOne(poster, { as: 'still', onDelete: 'CASCADE', foreignKey: 'StillId' });
    media.hasOne(poster, { as: 'poster', onDelete: 'CASCADE', foreignKey: 'PosterId' });
    media.hasOne(poster, { as: 'backdrop', onDelete: 'CASCADE', foreignKey: 'BackdropId' });
    media.hasMany(torrent, { onDelete: 'CASCADE', foreignKey: 'MediaId' });
    media.hasOne(torrent, { as: 'downloadingTorrent', foreignKey: 'DownloadingTorrentId' });
    media.belongsTo(season);
    torrent.belongsTo(media, { as: 'media' });

    sequelize.sync({  }).then(function() {
        //self.Setting.setValueWithKey('pl1DmfdZ2uIAAAAAAAAL4K9qSvlLJXSShdFboHBZ5nZsUsickQ8i64HO2eqX2PQA', self.Setting.Key.DropboxToken, function() {});

        events.emit('model-sync');
    });
    //this.sequelize.sync({ force: true });

    // Helpers

    this.mediaModelWithType = function(type) {
        if(type === media.Type.TV) {
            return show;
        } else if(type === media.Type.Movie) {
            return media;
        } else {
            throw 'invalid_type';
        }
    };

    this.mediaUpdateWithTypeAndRemoteId = function(type, remoteId, callback) {
        var self = this;

        sequelize.transaction().then(function(transaction) {
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

    log.debug('DB & Models initialized');

    return this;
};