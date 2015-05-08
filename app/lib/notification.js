/**
 * Created by nickbabenko on 29/01/15.
 */

var Prowl = require('node-prowl');

module.exports = function() {

    var settings = this.get('settings'),
        settingsModel = this.get('model.settings');

    var services = [ 'prowl'],
        handlers = {
            prowl: {
                handlerStore: null,
                handler: function() {
                    if (!handlers.prowl.handlerStore) {
                        handlers.prowl.handlerStore = new Prowl(
                            settings.get(settingsModel.Key.Notification.prowl.ApiKey)
                        );
                    }

                    return handlers.prowl.handlerStore;
                },
                downloadStart: function(media) {
                    var prowl = handlers.prowl.handler();

                    prowl.push('Download started ' + media.get('title'), 'Playback', function() { });
                },
                downloadRenamed: function(media) {
                    var prowl = handlers.prowl.handler();

                    prowl.push('Download complete ' + media.get('title'), 'Playback', function() { });
                }
            }
        };

    this.notifyOnDownloadStart = function(media) {
        for (var s in services) {
            var identifier = services[s];

            if (!settings.get(settingsModel.Key.Notification[identifier].Enabled) ||
                !settings.get(settingsModel.Key.Notification[identifier].DownloadStart) ||
                typeof settings.get(app.model.Setting.Key.Notification[identifier].ApiKey) != 'string' ||
                typeof handlers[identifier] != 'object' ||
                typeof handlers[identifier].downloadStart != 'function') {
                continue;
            }

            handlers[identifier].downloadStart(media);
        }
    };

    this.notifyOnDownladRenamed = function(media) {
        for (var s in services) {
            var identifier = services[s];

            if (!settings.get(settingsModel.Key.Notification[identifier].Enabled) ||
                !settings.get(settingsModel.Key.Notification[identifier].DownloadRenamed) ||
                typeof settings.get(settingsModel.Key.Notification[identifier].ApiKey) != 'string' ||
                typeof handlers[identifier] != 'object' ||
                typeof handlers[identifier].downloadRenamed != 'function') {
                continue;
            }

            handlers[identifier].downloadRenamed(media);
        }
    };

};