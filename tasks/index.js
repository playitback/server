module.exports = function(app) {

	var tag = 'tasks ',
		self = this;
	
	app.on('model-sync', function() {
		app.log.debug(tag + 'init tasks');

		self.searcher 		= require('./searcher')(app);
		self.downloader 	= require('./downloader')(app);
	});
	
}