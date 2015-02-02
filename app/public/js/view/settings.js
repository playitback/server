define('view/settings', [
		'backbone',
		'backbone.forms',
		'const/settings',
		'dropbox',
		'model/setting'
],
function(Backbone, BackboneForm, Settings, _Dropbox, SettingModel) {

	return Backbone.View.extend({
		
		id: 'settings',

		/** @var string hashTab The tab from the urls hash */
		hashTab: null,
		/** @var SettingsModel dropboxSetting The dropbox auth token setting model */
		dropboxSetting: null,
		
		initialize: function(options) {
			this.hashTab	= options && options.type || null;
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
			this.$el.append($('<div></div>', { 'class': 'clearfix' }));
			
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

			// If we have a tab from the hash, click it
			if (this.hashTab) {
				this.tabs.find('li a[href="#tab-' + this.hashTab + '"]').trigger('click');
			}
			
			this.initializeDropboxAuthenticate();
		},
		
		initializeDropboxAuthenticate: function() {
			var self = this;

			this.dropboxSetting = app.settings.findWhere({ key: Settings.sync.schema.sync_enabled.key });

			// Create if not already created
			if (!this.dropboxSetting) {
				this.dropboxSetting = new SettingModel({ key: Settings.sync.schema.sync_enabled.key });
			}

			this.loadQueryStringDropboxToken();

			/** @var jqObject dropboxToggle The field used to toggle dropbox enabled */
			var dropboxToggle = Settings.sync.form.$el.find('input[name="sync_enabled"]');
			/** @var Dropbpx.Client dropboxClient */
			var dropboxClient = new Dropbox.Client({ key: 'uosa4j4l4tv9qug', token: this.dropboxSetting.get('value') });

			// Mark checkbox based on authenticated status
			dropboxToggle.attr('checked', dropboxClient.isAuthenticated());

			// Listen for changes to checkbox and authenticate or remove dependant on value
			dropboxToggle.on('change', function() {
				if($(this).is(':checked')) {
					dropboxClient.authenticate(function (error) {
						if (error) {
							alert('Failed to authenticate your dropbox account.');

							dropboxToggle.attr('checked', false);
						}
						else {
							self.updateDropboxToken(client.credentials().token);
						}
					});
				}
				else {
					self.updateDropboxToken(null);
				}
			});
		},

		loadQueryStringDropboxToken: function() {
			var hash = window.location.hash;

			if ('string' == typeof hash && hash.indexOf('?access_token=') > -1) {
				var queryHash = hash.split('?');

				if ('object' == typeof queryHash && 'number' == typeof queryHash.length && queryHash.length > 1) {
					queryHash = queryHash[1];

					var queryParts = queryHash.split('&');

					if ('object' == typeof queryParts && 'number' == typeof queryParts.length && queryParts.length > 0) {
						for (var i in queryParts) {
							var queryPart = queryParts[i];

							if ('string' == typeof queryPart) {
								var keyValue = queryPart.split('=');

								if ('object' == typeof keyValue && 'number' == typeof keyValue.length && queryParts.length >= 2) {
									if (keyValue[0] == 'access_token') {
										this.dropboxSetting.set('value', keyValue[1]);
										this.updateDropboxToken(keyValue[1]);
									}
								}
							}
						}
					}
				}
			}
		},

		updateDropboxToken: function(token) {
			this.dropboxSetting.save({ value: token }, {
				success: function() {

				},
				error: function() {

				}
			});
		}
		
	});
	
});