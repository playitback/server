/**
 * Created by nickbabenko on 08/05/15.
 */

module.exports = function(appRoot) {

    var container = {},
        config = {},
        self = this;

    this.accessor = {
        /**
         * Get a service from the DI registry
         *
         * @param {string} reference
         * @returns {*|null}
         */
        get: function (reference) {
            if (typeof reference != 'string') {
                throw 'Unsupported DI reference. Only supports string';
            }

            if (typeof container[reference] == 'undefined') {
                container[reference] = loadWithReference(reference);
            }

            return container[reference] || null;
        },

        /**
         * Set an object instance in the DI container
         *
         * @param {string} reference
         * @param {*} instance
         */
        set: function (reference, instance) {
            if (typeof reference == 'object') {
                for (var ref in reference) {
                    self.accessor.set(ref, reference[ref]);
                }
            } else if (typeof reference == 'string' && typeof instance != 'undefined') {
                container[reference] = instance;

                self.extend(instance);
            } else {
                throw 'Incorrect usage of DI.set';
            }
        },

        /**
         * Load service references in to memory
         *
         * @param {string} reference
         * @returns {*}
         */
        load: function(reference) {
            // Accept arrays
            if (typeof reference == 'object' && typeof reference.length == 'number') {
                for (var key in reference) {
                    this.load(reference[key]);
                }

                return this;
            }

            if (typeof reference != 'string') {
                throw 'Unsupported DI reference. Only supports string';
            }

            if (typeof container[reference] == 'undefined') {
                container[reference] = loadWithReference(reference);
            }

            return this;
        },
        container: function() {
            return self;
        }
    };

    /**
     * Extends an object to give it DI access
     *
     * @param object
     */
    this.extend = function(object) {
        for (var method in this.accessor) {
            object[method] = this.accessor[method];
        }
    };

    // Private

    var loadWithReference = function(reference) {
        if (typeof config[reference] != 'undefined') {
            var instance = require(appRoot + '/' + config[reference]);

            // Instantiate, if required. Pass an app reference
            if (typeof instance == 'function') {
                // Extend proto, so they're instantly available
                instance.prototype = self.accessor;

                instance = new instance();
            }

            return instance;
        }

        return null;
    };

    var loadConfig = function() {
        config = require('../config/services');
    };

    loadConfig();

    this.extend(this);

};