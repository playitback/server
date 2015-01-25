var CronJob = require('cron').CronJob;

module.exports = function(app) {

	var tag = 'tasks.searcher ',
		job;

	// !Private

	var run = function() {
		app.log.debug(tag + 'run');

		app.model.Media.findAll({ where: { state: app.model.Media.State.Wanted, availableDate: { lte: new Date() } } })
			.then(function(availableMedia) {
				app.log.debug(tag + 'Found ' + availableMedia.length + ' media file(s) waiting to be searched');
			
				availableMedia.forEach(function(media) {
					media.download();
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
		app.log.debug(tag + 'start cronjob');

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
	
}