define('view/media/dialog/search', ['view/abstract/dialog', 'collection/search'], function(DialogView, SearchCollection) {
	
	var template = $('<div></div>')
		.append(
			$('<form></form>')
				.append(
					$('<input />', { type: 'search', name: 'query', placeholder: 'Enter your search query here...' })
				)
				.append(
					$('<i></i>', { 'class': 'icon' })
				)
				.append(
					$('<a></a>', { 'class': 'clear' })
				)
		)
		.append(
			$('<ul></ul>')
		);
	
	var resultTemplate = $('<li></li>')
		.append(
			$('<label></label>')
		)
		.append(
			$('<span></span>')
		);
	
	return DialogView.extend({
	
		className: 'search',
		
		render: function() {
			if(typeof this.options.type != 'string') {
				throw 'Invalid search type defined: ' + this.options.type;
			}
		
			this.mediaView = this.options.mediaView;
			this.collection = new SearchCollection({ type: this.options.type });
		
			this.content.append(template.clone());
			
			this.createEvents();
		},
		
		createEvents: function() {
			var self = this;
		
			this.content.find('form input').on('keyup', function() {
				if($(this).val().length > 3) {
					self.performSearch($(this).val());
				}
			});
				
			this.collection
				.off('remove', this.handleResultRemove, this)
				.on('remove', this.handleResultRemove, this);
		},
		
		performSearch: function(query) {
			var self = this;
		
			if(typeof this.previousRequest != 'undefined') {
				this.previousRequest.abort();
			}
					
			this.previousRequest = this.collection.fetch({
				remove: false,
				data: {
					query: query,
					type: this.options.type
				},
				success: function() {
					self.clearResults();
					self.updateResults();
				}
			});
		},
		
		// Setting remove: true doesn't call the remove method - daft
		clearResults: function() {
			var toBeRemoved = [];
			
			for(var i = 0; i <= this.collection.length; i++) {
				this.collection.remove(this.collection.at(i));
			}
		},
		
		updateResults: function() {
			var self = this;
		
			this.collection.forEach(function(result) {
				self.handleResultAdd(result);
			});
		},
		
		handleResultAdd: function(result) {
			if(typeof result === 'undefined') {
				return;
			}
						
			var self = this;
			var resultView = resultTemplate.clone();
						
			resultView.find('label').text(result.label());
			resultView.find('span').text(result.year());
		
			this.content.find('ul')
				.append(resultView)
				.show();
			
			result.resultView = resultView;
			
			resultView.on('click', function() {
				self.addResult(result);
			});
			
			this.center();
		},
		
		handleResultRemove: function(result) {
			if(typeof result.resultView == 'undefined') {
				return;
			}
		
			result.resultView.remove();
			
			this.center();
		},
		
		addResult: function(result) {
			this.$el.find('form input').val('');
			
			if(this.mediaView.type == result.get('type')) {
				this.mediaView.addMedia(result.mediaObject());
			}
			else {
				result.mediaObject().save();
			}
			
			this.close();
		}
		
	});
	
});