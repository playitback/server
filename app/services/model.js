var Sequelize 	= require('sequelize'),
    events		= require('events');

module.exports = function(app) {

    var sequelize = new Sequelize('database', 'username', 'password', {
        dialect: 'sqlite',
        storage: 'mediamanager.sqlite'
    });

    // Instantiate and load models
    var settings = this.get('model.settings'),
        poster = this.get('model.poster'),
        media = this.get('model.media'),
        season = this.get('model.season'),
        show = this.get('model.show'),
        torrent = this.get('model.torrent');

    show.hasMany(season, { as: 'seasons', onDelete: 'CASCADE' });
    show.hasOne(poster, { onDelete: 'CASCADE' });
    season.hasMany(media, { as: 'episodes', onDelete: 'CASCADE' });
    season.hasOne(poster, { onDelete: 'CASCADE' });
    season.belongsTo(show);
    media.hasOne(poster, { as: 'still', onDelete: 'CASCADE' });
    media.hasOne(poster, { onDelete: 'CASCADE' });
    media.hasMany(torrent, { onDelete: 'CASCADE', foreignKey: 'MediaId' });
    media.hasOne(torrent, { as: 'downloadingTorrent', foreignKey: 'DownloadingTorrentId' });
    media.belongsTo(season);
    torrent.belongsTo(media, { as: 'media' });

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

    app.log.debug('DB & Models initialized');

    return this;
};