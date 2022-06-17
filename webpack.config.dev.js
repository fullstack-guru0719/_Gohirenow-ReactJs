const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = env => {
    let currentENVpath = '.env';
    if (env.production) {
        currentENVpath = '.env.production';
    } else if (env.development) {
        currentENVpath = '.env.development';
    } else if (env.staging) {
        currentENVpath = '.env.staging';
    }
    return {
        entry: './src/index.js',
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                },
                {
                    test: /\.html$/,
                    use: [
                        {
                            loader: "html-loader"
                        }
                    ]
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                        },
                    ],
                },
                {
                    test: /\.css$/,

                    use : [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                // you can specify a publicPath here
                                // by default it uses publicPath in webpackOptions.output
                                publicPath: '../',
                                hmr: process.env.NODE_ENV === 'development',
                            },
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                            }
                        }
                    ]
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf|OTF)$/,
                    loader: "file-loader",
                    options : {
                        outputPath: 'fonts/'
                    }
                }
            ]
        },
        devServer: {
            contentBase: path.join(__dirname, 'src'),
            compress: true,
            port: 9000,
            historyApiFallback: true,
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].[hash].css',
            }),
            new CopyPlugin([
                { from: 'public', to: './', ignore: ['index-wp.html'], },
            ]),
            new HtmlWebPackPlugin({
                template: "./public/index-wp.html",
                filename: "./index.html"
            }),
            new Dotenv({path: currentENVpath}),
        ],
    }
};