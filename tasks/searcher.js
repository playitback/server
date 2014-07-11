var CronJob = require('cron').CronJob;

module.exports = function() {
	
	// !Private
	
	var run = function() {
		
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
		this.job = new CronJob('00 00 * * * *', run.call(this));
	};
	
	
	// !Init
	
	this.start();
	
}