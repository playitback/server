/**
 * Created by nickbabenko on 08/05/15.
 */

module.exports = function(app) {

    var config = this.get('config'),
        settings = this.get('settings'),
        settingsModel = this.get('model.settings');

    this.search = function(query, callback) {
        var providers = settings.get(settingsModel.Key.Downloader.Providers),
            providerConfig = config.get('providers');

        if (typeof providers == 'object' && typeof providers.length == 'number' && providers.length > 0) {
            var total = providers.length,
                complete = 0;

            for (var key in providers) {
                provider = null;

                if (typeof providerConfig[key] == 'object') {
                    var details = providerConfig[key],
                        provider = this.get(details.reference);

                    if (typeof provider.search != 'function') {
                        throw 'Invalid provider. No search method.';
                    }

                    provider.search(query, function() {
                        complete++;

                        if (complete == total) {
                            callback();
                        }
                    });
                }

                if (provider === null) {
                    total--;
                }
            }
        } else {
            app.log.warning('No providers enabled.');
        }
    };

};