module.exports = function() {
	
	this.searcher 		= require('./searcher').call(this);
	this.downloader 	= require('./downloader').call(this);
	
}