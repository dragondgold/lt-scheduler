/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const distFolder = path.resolve(__dirname, '../..', 'dist');
const getVariant = (variant) => {
    switch (variant) {
        case 'beta':
        case 'release':
            return variant;
        default:
            return 'development';
    }
};

module.exports = (env, argv) => {
    return {
        target: 'node',
        node: {
            __dirname: false,
            __filename: false
        },
        entry: {
            dist: path.join(__dirname, '..', 'index.ts')
        },
        devtool: 'source-map',
        output: {
            path: distFolder,
            filename: 'app.js'
        },
        resolve: {
            extensions: ['.ts', '.js'],
            alias: {
                '@': path.resolve(__dirname, '../'),
                '@extTypes': path.resolve(__dirname, '../../../common/typings')
            }
        },
        externals: [nodeExternals()],
        module: {
            rules: [
                {
                    test: /\.ts?$/,
                    loader: 'ts-loader',
                    include: [path.resolve(__dirname, '..')],
                    exclude: [/node_modules(\/|\\)(?!())/]
                }
            ]
        },
        watchOptions: {
            // We need polling method to detect file changes inside the docker container
            aggregateTimeout: 200,
            poll: 200
        },
        plugins: [
            new NodemonPlugin({
                // We need polling method to detect file changes inside the docker container
                legacyWatch: true,
                // So we can attach a debugger
                nodeArgs: ['--inspect=0.0.0.0:9230']
            }),
            new CleanWebpackPlugin({
                cleanStaleWebpackAssets: false
            }),
            new webpack.DefinePlugin({
                'process.env.TARGET_ENV': JSON.stringify(getVariant(argv.variant))
            }),
            new ESLintPlugin()
        ]
    };
};
