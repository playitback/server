/**
 * Created by nickbabenko on 25/01/15.
 */

var defaults = require('../const/settings.defaults');

module.exports = function(app) {

    var settings = {};

    var initialize = function() {
        // Load all settings to the local key=>val store
        app.model.Setting.findAll().then(function(settings) {
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
        app.model.Setting.find({where: {key: key}}).then(function (setting) {
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