const webpack = require('webpack');
const path = require('path');

const buildPath = path.resolve(__dirname, 'WP_BUILD_PATH');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const TransferWebpackPlugin = require('transfer-webpack-plugin');
const config = {
    // Entry points to the project
    entry: [
        'webpack/hot/dev-server',
        'webpack/hot/only-dev-server',
        path.join(__dirname, 'WP_ENTRY_POINT')
    ],
    // Server Configuration options
    devServer: {
        contentBase: 'WP_CONTENT_BASE',
        port: WP_SERVER_PORT, // Port Number
        host: 'localhost', // Change to '0.0.0.0' for external facing server
    },
    output: {
        path: buildPath, // Path of output file
        filename: 'WP_OUTPUT_NAME',
    },
    plugins: [
        // Enables Hot Modules Replacement
        new webpack.HotModuleReplacementPlugin(),
        // Allows error warnings but does not stop compiling.
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [
            {
                // React-hot loader and
                test: /\.js$/, // All .js files
                loaders: ['react-hot', 'babel-loader'], // react-hot is like browser sync and babel loads jsx and es6-7
                exclude: [nodeModulesPath]
            },
        ],
    }
};

module.exports = config;
