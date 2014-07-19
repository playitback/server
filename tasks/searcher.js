var CronJob = require('cron').CronJob;

module.exports = function() {
	
	// !Private
	
	var run = function() {
		var self = this;
	
		this.model.Media.findAllAvailableAndWanted(function(availableMedia) {
			self.log.debug('Found ' + availableMedia.length + ' media file(s) waiting to be searched');
			
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
		if(typeof this.job != 'undefined' && typeof this.job.stop === 'function') {
			this.job.stop();
		}
	};
	
	this.start = function() {
		this.job = new CronJob('00 00 * * * *', run.bind(this));
		
		run.call(this);
	};
	
	
	// !Init
	
	this.start();
	
}