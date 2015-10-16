var gulp = require('gulp'),
    webpack = require('webpack'),
    gutil = require('gutil');

gulp.task('webpack-dev', function(callback) {
    // run webpack
    process.env.DEBUG = 1;
    webpack(require('./webpack.config'), function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    });
});

gulp.task('webpack-prod', function(callback) {
    // run webpack
    process.env.DEBUG = 0;
    webpack(require('./webpack.config'), function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    });
});