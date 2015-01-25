var Transmission = require('../app/lib/transmission'),
    CronJob = require('cron').CronJob;

module.exports = function(app) {

    var TAG = 'tasks.downloader ',
        job;

    // !Private

    var run = function() {
        app.log.debug(TAG + 'run');

        var transmission = new Transmission(app);

        app.model.Media.findAll({ where: { state: app.model.Media.State.Downloading } })
            .then(function(downloadingMedia) {
                downloadingMedia.forEach(function(media) {
                    if (typeof media.get('transmissionId') != 'number') {
                        return;
                    }

                    app.log.debug(TAG + 'check download for media ' + media.get('id') + ' - ' + media.get('transmissionId'));

                    transmission.get(media.get('transmissionId'), function(err, result) {
                        if (result.torrents.length > 0) {
                            var torrent = result.torrents[0];

                            console.log(torrent);
                        }
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