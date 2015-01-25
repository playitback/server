/**
 * Created by nickbabenko on 25/01/15.
 */

var keys = require('./settings');

var Defaults = {};
Defaults[keys.General.MediaDirectory] = process.cwd() + '/media';

module.exports = Defaults;