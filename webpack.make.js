var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function makeWebpackConfig(opt) {
    var cssPlugin = new ExtractTextPlugin('[name].css');
    var BUILD = !!opt.BUILD;

    var commonPlugins = [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
            }
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                output: {
                    path: __dirname + '/sdk/dist',
                }
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
            libraryTarget: 'umd'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    use: [
                        { loader: 'style-loader' },
                        { loader: 'css-loader' }
                    ],
                    exclude: /node_modules/
                },
                {
                    test: /\.html$/,
                    use: {
                        loader: 'html-loader',
                        query: { minimize: true }
                    }
                }
            ]
        },
        node: {
            inline: true,
            progress: true,
            colors: true,
            hot: true
        },
        devServer: {
            debug: true,
            watch: true,
        },
        // PRODUCTION ==> common + production plugins
        plugins: BUILD ? commonPlugins.concat([

            new webpack.optimize.UglifyJsPlugin({
                minimize: true,
                mangle: false,
                compress: {
                    warnings: false
                }
            })
        ])
            // DEVELOPMENT ==> common + development plugins
            : commonPlugins.concat([
                new webpack.NoErrorsPlugin(),
            ]),
    }
};
