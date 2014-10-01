define('view/media/dialog/search', ['view/abstract/dialog'], function(DialogView) {
	
	var template = $('<div></div>')
		.append(
			$('<form></form>')
				.append(
					$('<input />', { type: 'search', name: 'query', placeholder: 'Enter your search query here...' })
				)
		)
		.append(
			$('<ul></ul>')
		);
	
	return DialogView.extend({
	
		className: 'search',
		
		render: function() {
			this.content.append(template.clone());
		}
		
	});
	
});