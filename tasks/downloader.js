var Transmission = require('../app/lib/transmission'),
    CronJob = require('cron').CronJob,
    uuid = require('transmission/lib/utils').uuid;

module.exports = function(app) {

    var TAG = 'tasks.downloader ',
        job;

    // !Private

    var run = function() {
        app.log.debug(TAG + 'run');

        var transmission = new Transmission(app);

        // Fetch all hashes/ids, so we can link the torrent hash to id
        transmission.callServer({
            arguments : {
                fields : [ 'hashString', 'id', 'percentDone', 'files' ]
            },
            method : transmission.methods.torrents.get,
            tag : uuid()
        }, function(error, transmissionTorrents) {
            if (error || typeof transmissionTorrents != 'object' || typeof transmissionTorrents.torrents != 'object' ||
                typeof transmissionTorrents.torrents.length != 'number') {
                app.log.debug(TAG + 'No torrents found in Transmission with error: ' + error);

                return;
            }

            // Create a map of hash string to id, so we can relate the torrent to the transmission torrent
            var torrentHashMap = {};
            for (var t in transmissionTorrents.torrents) {
                torrentHashMap[transmissionTorrents.torrents[t]['hashString']] = transmissionTorrents.torrents[t];
            }

            app.model.Media.findAll({ where: { state: app.model.Media.State.Downloading }})
                .then(function (downloadingMedia) {
                    downloadingMedia.forEach(function (media) {
                        media.getDownloadingTorrent().then(function(torrent) {
                            if (!torrent) {
                                app.log.warn(TAG + 'Media has no downloading torrent ' + media.id);

                                return;
                            }

                            var transmissionInfo = torrentHashMap[torrent.get('infoHash')];

                            if (typeof transmissionInfo != 'object' ||
                                typeof transmissionInfo.percentDone != 'number') {
                                app.log.warn('Invalid torrent from transmission ' + JSON.stringify(transmissionInfo));

                                return;
                            }

                            // Get a percentage from the ratio
                            transmissionInfo.percentDone *= 100;

                            app.log.debug(TAG + 'Check download for media ' + media.id + ', transmissionId: ' +
                                transmissionInfo.id + ', percentage: ' + transmissionInfo.percentDone);

                            media.updateAttributes({ downloadProgress: transmissionInfo.percentDone }).then(function() {
                                // If the torrent has finished, start rename process
                                if (typeof transmissionInfo.percentDone == 'number' && transmissionInfo.percentDone == 100) {
                                    media.moveToMediaDirectory(transmissionInfo);
                                }
                                else {
                                    app.log.debug(TAG + 'Media not finished');
                                }
                            });
                        });
                    });
                });
        });
    };


    // !Public

    this.restart = function() {
        this.stop();
        this.start();
    };

    this.stop = function() {
        if(typeof job == 'object' && typeof job.stop === 'function') {
            job.stop();
        }
    };

    this.start = function() {
        app.log.debug(TAG + 'start cronjob');

        if (typeof job === 'object' && typeof job.running == 'boolean') {
            if (!job.running) {
                job.start();
            }

            return;
        }

        // Every minute
        // TODO: make time configurable
        job = new CronJob('0 */1 * * * *', run.bind(this));
        job.start();

        // TODO: setting for run on boot
        run.call(this);
    };


    // !Init

    this.start.call(this);

    return this;
	
};