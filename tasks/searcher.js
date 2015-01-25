var CronJob = require('cron').CronJob;

module.exports = function() {

	var tag = 'tasks.searcher ';

	var running = false;

	// !Private
	
	var run = function() {
		this.log.debug(tag + 'run');

		var self = this;
		
		this.model.Media.findAll({ where: { state: this.model.Media.State.Wanted, availableDate: { lte: new Date() } } })
			.then(function(availableMedia) {
				self.log.debug(tag + 'Found ' + availableMedia.length + ' media file(s) waiting to be searched');
			
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
		if(typeof this.job == 'object' && typeof this.job.stop === 'function') {
			this.job.stop();
		}
	};
	
	this.start = function() {
		this.log.debug(tag + 'start cronjob');

		// Every minute
		// TODO: make time configurable
		this.job = new CronJob('0 */1 * * * *', run.bind(this));
		this.job.start();

		// TODO: setting for run on boot
		run.call(this);
	};
	
	
	// !Init
	
	this.start.call(this);
	
}