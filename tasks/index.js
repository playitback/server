module.exports = function() {
	
	this.on('model-sync', function() {
		this.searcher 		= require('./searcher').call(this);
		this.downloader 	= require('./downloader').call(this);
	});
	
}