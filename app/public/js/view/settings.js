define('view/settings', ['backbone', 'backbone.forms', 'const/settings'], function(Backbone, BackboneForm, Settings) {
	
	return Backbone.View.extend({
		
		id: 'settings',
		
		initialize: function() {
			this.tabs = $('<ul></ul>', { 'class': 'nav nav-tabs', role: 'tablist' });
		},
		
		render: function() {
			$('section#content')
				.html('')
				.append(this.$el);
				
			this.$el.append(this.tabs);
			
			for(var tabKey in Settings) {
				var tab 		= Settings[tabKey],
					tabId		= 'tab-' + tabKey,
					tabContent 	= $('<div></div>', { id: tabId, 'class': 'tab-pane' }),
					schema		= {};
					
				this.tabs.append(
					$('<li></li>', { 'class': (this.tabs.find('ul').length === 0 ? 'active' : null) })
						.append(
							$('<a></a>', { 'href': '#' + tabId, role: 'tab', 'data-toggle': 'tab', text: tab.title })
						)
				);
				
				setting.form = new BackboneForm({
					schema: tab.schema
				})
				.render();
				
				tabContent.append(setting.form.$el);
				
				this.$el.append(tabContent);
			}
		}
		
	});
	
});