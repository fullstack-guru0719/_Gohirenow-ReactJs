const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const path = require('path')
const glob = require('glob-all')
const PUBLIC_PATH = process.env.PUBLIC_PATH || '/';
const PurgecssPlugin = require('purgecss-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
const PATHS = {
    src: path.join(__dirname, 'src')
}
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
        output: {
            publicPath: PUBLIC_PATH,
            filename: '[name].[contenthash].js',
        },
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
                            options : {
                                outputPath: 'images/'
                            }
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
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].[hash].css',
            }),
            new ManifestPlugin(),
            new CopyPlugin([
                { from: 'public', to: './', ignore: ['index-wp.html'], },
                { from: 'src/styles/Fonts', to: './p/Fonts', ignore: ['index-wp.html'], },
            ]),
            new HtmlWebPackPlugin({
                template: "./public/index-wp.html",
                filename: "./index.html"
            }),
            new CleanWebpackPlugin(),
            new Dotenv({path: currentENVpath}),
        ],
        optimization: {
            minimize: true,
            minimizer: [new TerserPlugin({terserOptions: {
                    extractComments: 'none',
                    compress: {
                        warnings: false,
                        drop_console: true,
                        drop_debugger: true
                    },
                    comments: false
                }})],
            splitChunks: {
                chunks: 'all',
            },
        },
    }
};