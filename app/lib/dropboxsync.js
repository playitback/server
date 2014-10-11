var Dropbox = require('dropbox');

module.exports = function() {

	var tag 		= 'DropboxSync: ',
		config		= this.config.get('dropbox'),
		hooks		= ['afterCreate', 'afterDestroy', 'afterUpdate'],
		models		= ['Show', 'Media'],
		self		= this;
			
	this.log.debug(tag + 'Starting dropbox sync');
	
	// Create a Dropbox Client with an auth token
	var createClientWithToken = function(token) {
		self.log.debug(tag + 'createClientWithToken');
	
		self.client = new Dropbox.Client({
			key: config.appKey,
			token: token
		});
		
		openDataStore();
	};
	
	// Create an unauthorized Dropbox Client
	var createClient = function() {
		self.log.debug(tag + 'createClient');
	
		self.client = new Dropbox.Client({
			key: config.appKey
		});
	};
	
	// Listen for new settings with the dropbox token key
	var listenForDropboxSetting = function() {
		self.log.debug(tag + 'listenForDropboxSetting');
		
		self.Setting.afterCreate(function(setting) {
			console.log('afterCreate setting');
			if(setting.key === self.Setting.Key.Sync.Dropbox.Token) {
				self.log.debug(tag + 'Dropbox setting created');
				
				createClientWithToken(this.value);
			}
		});
	};
	
	// Attempt to load a Dropbox Auth token from the settings
	var loadDropboxToken = function() {
		self.log.debug(tag + 'loadDropboxToken');
	
		self.Setting.valueForKey(self.Setting.Key.Sync.Dropbox.Token, function(value) {		
			if(value) {
				self.log.debug(tag + 'token not found');
				
				createClientWithToken(value);
			}
			else {
				self.log.debug(tag + 'Value not found');
			
				createClient();
				listenForDropboxSetting();
			}
		});
	};
	
	// Updates a model on dropbox
	var syncModel = function(object) {
		self.log.debug(tag + 'Syncing model to Dropbox - ' + object.Model.tableName + ' (' + object.id + ')');
	
		var table 		= self.datastore.getTable(object.Model.tableName);
		var remoteModel = table.get(object.remoteId);
		
		if(!remoteModel) {
			self.log.debug(tag + 'Object doesn\'t exist on Dropbox. Creating.');
			
			remoteModel.createWithRemoteId(object.remoteId, function() {});
		}
		else {
			self.log.debug(tag + 'Object exists on Dropbox. Ignoring.');
		}
	};
	
	// Fetch data from dropbox and update local entity
	var updateModel = function(model) {
		self.log.debug(tag + 'Update local model with Dropbox data for table: ' + model.tableName);
	
		var table 			= self.datastore.getTable(model.tableName);
		var remoteObjects 	= table.query();
		
		self.log.debug(tag + 'Total remote objects: ' + remoteObjects);
		
		remoteObjects.forEach(function(remoteObject) {
			self.log.debug(tag + 'Syncing remote object with ID: ' + remoteObject.remoteId);
			
			self.model[model.TableName].find({ where: { remoteId: remoteObject.remoteId } }).success(function(localObject) {
				if(!localObject) {
					self.log.debug(tag + 'Remote object doesn\'t exist locally. Creating.');
					
					self.model[model.TableName].createWithRemoteId(remoteObject.remoteId, function() {});
				}
				else {
					self.log.debig(tag + 'Remote object already exists locally. Ignoring.');
				}
			});
		});
	};
		
	// Iterate available models, update it from Dropbox and monitor future changes
	var configureModelWatch = function() {
		self.log.debug(tag + 'Configure model watch');
		
		for(var m in models) {
			var model = self[models[m]];
			
			self.log.debug(tag + 'Configure model watch for: ' + model.tableName);
			
			for(var h in hooks) {
				model.addHook(hooks[h], syncModel);
			}
			
			updateModel(model);
		}
	};
	
	var openDataStore = function() {
		self.log.debug(tag + 'Opening datastore');
	
		// Open data store for playback
		self.client.getDatastoreManager().openDefaultDatastore(function (error, datastore) {
			self.log.debug(tag + 'datastore request finished');
		
			if(error) {
				self.log.error(tag + 'Failed to open data store with error: ' + error);
				
				return;
			}
			
			self.log.debug(tag + 'Satastore successfully opened');
			
			self.datastore = datastore;
		
			// Update local models
			configureModelWatch();
			
			// Listen for future remote changes
			datastore.recordsChanged.addListener(function() {
				
			});
		});
	};
	
	this.on('model-sync', function() {
		loadDropboxToken();
	});
};