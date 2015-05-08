var Dropbox = require('dropbox');

module.exports = function() {

	var TAG = 'DropboxSync: ',
        log = this.get('log'),
		config = this.get('config').get('networks.dropbox'),
        settingsModel = this.get('model.settings'),
		hooks = ['afterCreate', 'afterDestroy', 'afterUpdate'],
		models = ['model.show', 'model.media'],
        client = null,
        datastore = null,
        self = this;
			
	log.debug(TAG + 'Initialising');
	
	// Create a Dropbox Client with an auth token
	var createClientWithToken = function(token) {
		log.debug(TAG + 'Create Dropbox client with auth token');
	
		client = new Dropbox.Client({
			key: config.appKey,
			token: token
		});
		
		openDataStore();
	};
	
	// Create an unauthorized Dropbox Client
	var createClient = function() {
		log.debug(TAG + 'Create client');
	
		client = new Dropbox.Client({
			key: config.appKey
		});
	};
	
	// Listen for new settings with the dropbox token key
	var listenForDropboxSetting = function() {
		log.debug(TAG + 'Listen for dropbox setting');

        settingsModel.afterCreate(function(setting) {
			log.debug(TAG + 'Setting created');

			if(setting.key === settingsModel.Key.Sync.Dropbox.Token) {
				log.debug(TAG + 'Dropbox token setting created');
				
				createClientWithToken(this.value);
			}
		});
	};
	
	// Attempt to load a Dropbox Auth token from the settings
	var loadDropboxToken = function() {
		log.debug(TAG + 'Attempt to load Dropbox token');

        settingsModel.valueForKey(settingsModel.Key.Sync.Dropbox.Token, function(value) {
			if(value) {
				log.debug(TAG + 'Dropbox token found');
				
				createClientWithToken(value);
			}
			else {
				log.debug(TAG + 'Dropbox token not found, wait for updates');
			
				createClient();
				listenForDropboxSetting();
			}
		});
	};

	/**
	 * Sync a local object with Dropbox
	 *
	 * @param object
	 */
	var syncModel = function(object) {
		if (typeof object.type == 'string' && object.type == app.model.Media.Type.TV) {
			// Ignore episodes. We only want TV shows & movies
			return;
		}

		log.debug(TAG + 'Syncing model to Dropbox - ' + object.Model.tableName + ' (' + object.id + ')');
	
		var table = datastore.getTable(object.Model.tableName);
		var record = table.get(object.dropboxId);
		
		if(!record) {
			app.log.debug(TAG + 'Object doesn\'t exist on Dropbox. Creating.');

			record = table.insert();
		}

		record.update(object.dropboxData());
	};

	/**
	 * Fetch data from dropbox and update local entity
	 *
	 * @param	Sequelize.Model	model	The model to be updated, stored in app.model
	 */
	var updateModel = function(model) {
		log.debug(TAG + 'Update local model with Dropbox data for table: ' + model.tableName);
	
		var table 			= datastore.getTable(model.tableName);
		var remoteObjects 	= table.query();
		
		log.debug(TAG + 'Total remote objects: ' + remoteObjects);
		
		remoteObjects.forEach(function(remoteObject) {
			log.debug(TAG + 'Syncing remote object with ID: ' + remoteObject.get('remoteId'));

			if (remoteObject.isDeleted()) {
				app.log.debug(TAG + 'Object deleted. Delete locally');
				app.model[model.TableName].deleteWithRemoteId(remoteObject.get('remoteId'));
			} else {
				// Call create, which updates if exists, or creates
				app.model[model.TableName].createWithRemoteId(remoteObject.get('remoteId'), function() {});
			}
		});
	};

	/**
	 * Iterate available models, update it from Dropbox and monitor future changes
	 */
	var configureModelWatch = function() {
		log.debug(TAG + 'Configure model watch');
		
		for(var m in models) {
			var model = self.get(models[m]);
			
			log.debug(TAG + 'Configure model watch for: ' + model.tableName);
			
			for(var h in hooks) {
				model.addHook(hooks[h], syncModel);
			}
			
			updateModel(model);
		}
	};

	/**
	 * Iterate all syncable models and update them locally with the data from Dropbox
	 */
	var updateRemoteModels = function() {
		for(var m in models) {
			updateModel(self.get(models[m]));
		}
	};

	/**
	 * Create a Dropbox Datastore object and begin the sync process
	 */
	var openDataStore = function() {
		log.debug(TAG + 'Opening datastore');
	
		// Open data store for playback
		client.getDatastoreManager().openDefaultDatastore(function (error, datastore) {
			log.debug(TAG + 'datastore request finished');
		
			if(error) {
				log.error(TAG + 'Failed to open data store with error: ' + error);
				
				return;
			}
			
			log.debug(TAG + 'Datastore successfully opened');

			// Update local models
			configureModelWatch();
			
			// Listen for future remote changes
			datastore.recordsChanged.addListener(function() {
				updateRemoteModels();
			});
		});
	};

	// Listen for the models to successfully sync with the
	/*this.get('events').on('model-sync', function() {
		log.debug(TAG + 'Model synced, configuring dropbox sync');

		loadDropboxToken();
	});*/
};