var Dropbox = require('dropbox');

module.exports = function() {

	var TAG 		= 'DropboxSync: ',
		app 		= this,
		config		= app.config.get('networks.dropbox'),
		hooks		= ['afterCreate', 'afterDestroy', 'afterUpdate'],
		models		= ['Show', 'Media'];
			
	app.log.debug(TAG + 'Initialising');
	
	// Create a Dropbox Client with an auth token
	var createClientWithToken = function(token) {
		app.log.debug(TAG + 'Create Dropbox client with auth token');
	
		app.client = new Dropbox.Client({
			key: config.appKey,
			token: token
		});
		
		openDataStore();
	};
	
	// Create an unauthorized Dropbox Client
	var createClient = function() {
		app.log.debug(TAG + 'Create client');
	
		app.client = new Dropbox.Client({
			key: config.appKey
		});
	};
	
	// Listen for new settings with the dropbox token key
	var listenForDropboxSetting = function() {
		app.log.debug(TAG + 'Listen for dropbox setting');
		
		app.Setting.afterCreate(function(setting) {
			console.log(TAG + 'Setting created');

			if(setting.key === app.Setting.Key.Sync.Dropbox.Token) {
				app.log.debug(TAG + 'Dropbox token setting created');
				
				createClientWithToken(this.value);
			}
		});
	};
	
	// Attempt to load a Dropbox Auth token from the settings
	var loadDropboxToken = function() {
		app.log.debug(TAG + 'Attempt to load Dropbox token');
	
		app.Setting.valueForKey(app.Setting.Key.Sync.Dropbox.Token, function(value) {		
			if(value) {
				app.log.debug(TAG + 'Dropbox token found');
				
				createClientWithToken(value);
			}
			else {
				app.log.debug(TAG + 'Dropbox token not found, wait for updates');
			
				createClient();
				listenForDropboxSetting();
			}
		});
	};
	
	// Updates a model on dropbox
	var syncModel = function(object) {
		app.log.debug(TAG + 'Syncing model to Dropbox - ' + object.Model.tableName + ' (' + object.id + ')');
	
		var table 		= app.datastore.getTable(object.Model.tableName);
		var remoteModel = table.get(object.remoteId);
		
		if(!remoteModel) {
			app.log.debug(TAG + 'Object doesn\'t exist on Dropbox. Creating.');
			
			remoteModel.createWithRemoteId(object.remoteId, function() {});
		}
		else {
			app.log.debug(TAG + 'Object exists on Dropbox. Ignoring.');
		}
	};

	/**
	 * Fetch data from dropbox and update local entity
	 *
	 * @param	Sequelize.Model	model	The model to be updated, stored in app.model
	 */
	var updateModel = function(model) {
		app.log.debug(TAG + 'Update local model with Dropbox data for table: ' + model.tableName);
	
		var table 			= app.datastore.getTable(model.tableName);
		var remoteObjects 	= table.query();
		
		app.log.debug(TAG + 'Total remote objects: ' + remoteObjects);
		
		remoteObjects.forEach(function(remoteObject) {
			app.log.debug(TAG + 'Syncing remote object with ID: ' + remoteObject.remoteId);
			
			app.model[model.TableName].find({ where: { remoteId: remoteObject.remoteId } }).success(function(localObject) {
				if(!localObject) {
					app.log.debug(TAG + 'Remote object doesn\'t exist locally. Creating.');
					
					app.model[model.TableName].createWithRemoteId(remoteObject.remoteId, function() {});
				}
				else {
					app.log.debug(TAG + 'Remote object already exists locally. Ignoring.');
				}
			});
		});
	};

	/**
	 * Iterate available models, update it from Dropbox and monitor future changes
	 */
	var configureModelWatch = function() {
		app.log.debug(TAG + 'Configure model watch');
		
		for(var m in models) {
			var model = app[models[m]];
			
			app.log.debug(TAG + 'Configure model watch for: ' + model.tableName);
			
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
			var model = app[models[m]];

			updateModel(model);
		}
	};

	/**
	 * Create a Dropbox Datastore object and begin the sync process
	 */
	var openDataStore = function() {
		app.log.debug(TAG + 'Opening datastore');
	
		// Open data store for playback
		app.client.getDatastoreManager().openDefaultDatastore(function (error, datastore) {
			app.log.debug(TAG + 'datastore request finished');
		
			if(error) {
				app.log.error(TAG + 'Failed to open data store with error: ' + error);
				
				return;
			}
			
			app.log.debug(TAG + 'Datastore successfully opened');
			
			app.datastore = datastore;
		
			// Update local models
			configureModelWatch();
			
			// Listen for future remote changes
			datastore.recordsChanged.addListener(function() {
				updateRemoteModels();
			});
		});
	};

	// Listen for the models to succesfully sync with the
	app.on('model-sync', function() {
		app.log.debug(TAG + 'Model synced, configuring dropbox sync');

		//loadDropboxToken();
	});
};