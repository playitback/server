/**
 * Created by nickbabenko on 25/01/15.
 */

var defaults = require('../const/settings.defaults');

module.exports = function() {

    var settings = {},
        settingsModel = this.get('model.settings');

    var initialize = function() {
        // Load all settings to the local key=>val store
        settingsModel.findAll().then(function(settings) {
           settings.forEach(function(setting) {
              settings[setting.get('key')] = setting.get('value');
           });
        });
    };

    this.get = function(key) {
        return settings[key] || defaults[key] || null;
    };

    this.set = function(key, value, callback) {
        // Load record
        settingsModel.find({where: {key: key}}).then(function (setting) {
            if (setting) {
                setting.updateAttributes({value: value}).then(function () {
                    // Set locally for next get call
                    settings[key] = value;

                    callback(true);
                });
            }
            else {
                callback(false);
            }
        });
    };

    initialize();

    return this;

};