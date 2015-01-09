define('view/settings', ['backbone', 'backbone.forms', 'const/settings', 'dropbox'], function(Backbone, BackboneForm, Settings, Dropbox) {
	
	return Backbone.View.extend({
		
		id: 'settings',
		
		initialize: function() {
			this.tabs 		= $('<ul></ul>', { 'class': 'nav nav-tabs', role: 'tablist' });
		},
		
		render: function() {
			var self = this;
		
			this.container = $('<div></div>', { 'class': 'tab-content' });
		
			$('#content')
				.html('')
				.append(this.$el);
				
			this.$el.append(this.tabs);
			this.$el.append(this.container);
			
			var first = true;
			
			_.each(Settings, function(tab, tabKey) {
				var tabId		= 'tab-' + tabKey,
					tabContent 	= $('<div></div>', { id: tabId, 'class': 'tab-pane' }),
					schema		= {};
					
				self.tabs.append(
					$('<li></li>', { 'class': (first ? 'active' : null) })
						.append(
							$('<a></a>', { 'href': '#' + tabId, role: 'tab', 'data-toggle': 'tab', text: tab.title })
						)
				);
				
				Settings[tabKey].form = new Backbone.Form({
					schema: tab.schema
				})
				.render();
				
				tabContent.append(Settings[tabKey].form.$el);
				
				self.container.append(tabContent);
				
				tabContent.toggle(first);
				
				first = false;

			});
			
			this.tabs.find('li a').click(function(e) {
				$(this).tab('show');
				
				self.container.find('.tab-pane').hide();
				self.container.find('.tab-pane#' + $(this).attr('href').substr(1)).show();
				
				e.preventDefault();
				
				return false;
			});
			
			this.initializeDropboxAuthenticate();
		},
		
		initializeDropboxAuthenticate: function() {
			console.log(window.settings);

			var dropboxSetting = window.settings.where({ key: Settings.sync.schema.sync_enabled.key }),
				dropboxToggle = Settings.sync.$el.find('input[name="sync_enabled"]');

			dropboxToggle.on('change', function() {
				if($(this).is(':checked')) {
					var client = new Dropbox.Client({ key: '2ntaq9oocp8j9he' });

					client.authenticate(function (error) {
						if (error) {
							alert('Failed to authenticate your dropbox account.');

							dropboxToggle.attr('checked', false);
						}
						else {
							dropboxSetting.save({ value: client.credentials().token }, {
								success: function() {

								},
								error: function() {

								}
							});
						}
					});
				}
			});
		}
		
	});
	
});