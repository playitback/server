var webpack = require('webpack'),
    path = require('path'),
    ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

var publicAssetsPath = path.join('public', 'assets'),
    DEBUG = JSON.parse(process.env.DEBUG || "1");

module.exports = {
    context: __dirname + '/app/public/js',
    entry: {
        app: 'bootstrap.js'
    },
    output: {
        path: __dirname + '/app/public/dist',
        filename: '[name].js',
        publicPath: '/app/public/dist'
    },
    plugins: [
        new webpack.ProvidePlugin({
            _: 'lodash'
        }),
        // this plugin makes webpack not only looking for package.json, but also for a bower.json with a main-field
        new webpack.ResolverPlugin([
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
        ]),
        new webpack.DefinePlugin({
            VERSION: JSON.stringify('alpha'),
            ASSETS_PATH: JSON.stringify(publicAssetsPath + '/'),
            DEVEL: DEBUG
        })
    ],
    module: {
        loaders: [
            {
                test: /[\/]angular\.js$/,
                loader: "exports?angular"
            },
            {
                test: /\.less$/,
                loader: 'style!css!less'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js'],
        root: [ __dirname + '/app/public/js', __dirname + '/app/public/lib' ],
        alias: {
            angular: 'angular/angular',
            angularRoute: 'angular-route/angular-route',
            angularBackbone: 'ng-backbone/ng-backbone',
            angularSanitize: 'angular-sanitize/angular-sanitize',
            angularUiRouter: 'angular-ui-router/release/angular-ui-router',
            angularLazyImage: 'ng-directive-lazy-image/release/lazy-image',
            backbone: 'backbone/backbone',
            ionic: 'ionic/js/ionic',
            ionicAngular: __dirname + '/public/assets/lib/ionic/js/ionic-angular',
            ionicTinderCards: 'ionic-contrib-tinder-cards/ionic.tdcards',
            collide: 'collide/collide',
            lodash: 'lodash/lodash',
            moment: 'moment/moment'
        }
    }
};

if (!DEBUG) {
    module.exports.plugins.push(new ngAnnotatePlugin({
        add: true
    }));
    module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin({
        mangle: true
    }));
}