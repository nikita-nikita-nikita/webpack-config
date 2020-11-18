'use strict'
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack')

module.exports = ({MODE: NODE_ENV = 'production'}) => {
    const isDev = NODE_ENV === 'development';
    const isProd = NODE_ENV === 'production';

    // PLUGINS
    const plugins = [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: 'public/index.html'
        })
    ];
    const prodPlugins = [
        new MiniCssExtractPlugin({
            filename: 'name-[hash].css'
        })
    ];
    if(isProd) plugins.push(...prodPlugins);

    const devPlugins = [new webpack.HotModuleReplacementPlugin()];
    if(isDev) plugins.push(...devPlugins);
    // that's variables looks redundant but we clearly see what we add for each mode

    // LOADERS
    // style-loader/MiniCssExtractPlugin.loader
    const styleLoader = isDev ? 'style-loader' : MiniCssExtractPlugin.loader;
    // babel-loader.plugins
    const babelPlugins = ["@babel/proposal-class-properties"];
    if(isDev) babelPlugins.push('react-hot-loader/babel');

    //ENTRY
    const entry = isDev ? {entry: ['react-hot-loader/patch', './src']} : {}

    return {
        ...entry,
        mode: NODE_ENV,
        devServer: {
            port: 9000,
            open: true,
            hot: isDev
        },
        resolve: {
            extensions: ['.js', '.jsx', '.json']
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: "bundle.js"
        },
        module: {
            rules: [
                // js
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: [
                        'react-hot-loader/webpack',
                        {
                            loader:'babel-loader',
                            options: {
                                presets: [
                                    [
                                        "@babel/env",
                                        {
                                            corejs: "3.7.0",
                                            useBuiltIns: "usage",
                                            debug: isDev,
                                            modules: false
                                        }
                                    ],
                                    "@babel/react"
                                ],
                                plugins: babelPlugins
                            }
                        }
                    ]
                },
                // files
                {
                    test: /\.(jpg|png)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                outputPath: 'images',
                                name: '[name]-[sha1:hash:7].[ext]'
                            }
                        },
                    ]
                },
                // css
                {
                    test: /\.css$/,
                    use: [styleLoader, "css-loader"]
                },
                //scss
                {
                    test: /\.s[ac]ss$/,
                    use: [styleLoader, "css-loader", "sass-loader"]
                }
            ]
        },
        plugins
    };
}
