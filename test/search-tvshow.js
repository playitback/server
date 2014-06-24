require('./bootstrap')(function() {

	var self = this;

	describe('app', function() {
		var context = this;
		
		context.req.params.type = 'tvshow';
		context.response = function(response) {
			it('should have a valid result array', function() {
				self.assert.equals(typeof response.results === 'object' && typeof response.results.length === 'number');
			});
		};
		
		require('../app/controller/media').getSearch.call(context);
	});
	
});