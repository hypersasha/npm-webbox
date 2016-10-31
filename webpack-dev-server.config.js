const webpack = require('webpack');
const path = require('path');

const buildPath = path.join(__dirname, 'WP_BUILD_PATH');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const config = {
    entry: [path.join(__dirname, 'WP_ENTRY_POINT')],
    devtool: 'source-map',
    output: {
        // Path of output file
        path: buildPath,
        filename: 'WP_OUTPUT_NAME'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        // Minify the bundle
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                // suppresses warnings, usually from module minification
                warnings: false,
            },
        }),
        // Allows error warnings but does not stop compiling.
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel-loader'],
                exclude: [nodeModulesPath]
            },
        ],
    }
};
module.exports = config;
