/**
 * Created by nickbabenko on 25/01/15.
 */

var keys = require('./settings');

var Defaults = {};

// General
Defaults[keys.General.MediaDirectory] = process.cwd() + '/media';

// Media
Defaults[keys.Media.DefaultQuality.movie] = '1080p';
Defaults[keys.Media.DefaultQuality.tv] = '720p';
Defaults[keys.Media.Renamer.MoveRemaining] = false;

module.exports = Defaults;