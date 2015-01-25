module.exports = function() {

	var tag = 'tasks ';
	
	this.on('model-sync', function() {
		this.log.debug(tag + 'init tasks');

		this.searcher 		= require('./searcher').call(this);
		this.downloader 	= require('./downloader').call(this);
	});
	
}