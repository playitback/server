require('./bootstrap')(function() {

	var self = this;

	describe('app', function() {
		var context = this;

        self.triggerRequest('media/search', {
            type: 'tvshow',
            query: 'Elementary'
        }, function() {
            var response = this;

            it('should have a valid result array', function() {
                self.assert.equals(typeof response.jsonResponse.results === 'object');
                self.assert.equals(typeof response.jsonResponse.results.length === 'number');
            });
            it('should have one or more results', function() {
                self.assert.equals(response.jsonResponse.length > 0);
            });
        });
	});
	
});