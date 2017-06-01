
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var cssPlugin = new ExtractTextPlugin('[name].css');

module.exports = function makeWebpackConfig(opt) {

    var BUILD = !!opt.BUILD;

    var commonPlugins = [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
            }
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            pkg: require('./package.json'),
            template: './sandbox/index.html',
            inject: 'body'
        }),
        cssPlugin
    ];

    return {
        entry: BUILD
            ? [__dirname + "/sdk/src/BlipWebSDK.js"]
            : ['webpack/hot/dev-server', 'webpack-dev-server/client?http://localhost:3002', __dirname + "/sdk/src/BlipWebSDK.js"],
        output: {
            path: __dirname + '/sdk/dist',
            filename: 'blipWebSdk.js',
            library: 'BlipWebSDK',
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
        module: {
            loaders: [
                { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
                { test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader', exclude: /node_modules/ },
                { test: /\.html$/, loader: 'html', query: { minimize: true } }
            ]
        },
        devServer: {
            debug: true,
            watch: true,
            inline: true,
            progress: true,
            colors: true,
            hot: true
        },
        // PRODUCTION ==> common + production plugins
        plugins: BUILD ? commonPlugins.concat([

            new webpack.optimize.UglifyJsPlugin({
                minimize: true,
                mangle: false,
                compress: {
                    warnings: false
                }
            }),
            cssPlugin
        ])
            // DEVELOPMENT ==> common + development plugins
            : commonPlugins.concat([
                new webpack.NoErrorsPlugin(),
            ]),
    }
};
