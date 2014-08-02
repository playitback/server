define('view/settings', ['backbone', 'form'], function(Backbone, Form) {
	
	return Backbone.View.extend({
		
		id: 'settings',
		
		render: function() {
			$('section#content')
				.html('')
				.append(this.$el);
				
			this.initializeForm();
		},
		
		initializeForm: function() {
			var settingForm = new Form()
				.setBuilder(function() {
					this.add('setting', 'entity');
				});
		
			var form = new Form()
				.setBuilder(function() {
					this.add('settings', 'collection', {
						type: settingForm
					});
				});
				
			this.$el.append(form.render());
		}
		
	});
	
});