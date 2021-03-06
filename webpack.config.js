const path = require('path');
const glob = require('glob');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const {WebpackManifestPlugin} = require('webpack-manifest-plugin');
const TerserPlugin = require("terser-webpack-plugin");
// Create an interface to glob https://github.com/isaacs/node-glob
// https://stackoverflow.com/questions/32874025/how-to-add-wildcard-mapping-in-entry-of-webpack/34545812#34545812
const stylesForPages = pattern => glob.sync(pattern);
module.exports = (env, argv) => ({
  resolve: {
    // Fixes for using EJS client side
    alias: {
      fs: false,
      path: false
    }
  },
  entry: {
    app: ['./src/index.js',  './_scss/main.scss', ...stylesForPages('./_scss/_pages/*.scss')]
  },
  optimization: {
    minimize: (argv.mode !== 'development'),
    minimizer: [
      new TerserPlugin({
        extractComments: {
          condition: /^\**!|@preserve|@license|@cc_on/i,
          filename: (fileData) => {
            // The "fileData" argument contains object with "filename", "basename", "query" and "hash"
            return `LICENSE.txt${fileData.query}`;
          },
          banner: (licenseFile) => {
            return `License information can be found in ${licenseFile}`;
          },
        },
        terserOptions: {
          ecma: undefined,
          parse: {},
          compress: {},
          mangle: {
            properties: false,
            reserved: [
              "DD",
              "cookies",
              "i18next",
              "bootstrap",
              "emitter",
              "commands",
              "rws",
              "loader",
              "renderer",
              "actions",
              "todos",
              "todo",
              "error",
              "home",
              "filter",
              "locale",
              "routerMiddleware",
              "createBrowserHistory",
              "logic",
              "persist",
              "routerReducer",
              "reducers",
              "configuration",
              "store",
              "startListener",
              "header",
              "input",
              "list",
              "foot",
              "router",
              "persistence"
            ]
          }
        }
      })
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  },
  devtool: argv.mode === 'production' ? false : 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      // This is structure for compiling scss into css and placing it into the dist directory
      // It is a departure from typical thinking of including css inside javascript to facilitate
      // runtime loading of modules with their supporting styles as one would with React,
      // Angular or Vue where that is the norm.
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: { outputPath: 'css/', name: '[name].min.css'}
          },
          {
            loader: 'sass-loader',
            options: {
              // Use Dart SASS
              implementation: require('sass'),
              outputStyle: 'compressed'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [{from: './_assets', to: './'}]
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['vendor', 'app'],
      hash: true,
      template: './_html/index.html',
      filename: 'index.html'
    }),
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.js(\?.*)?$/i
    }),
    new WebpackManifestPlugin(),
    new webpack.ProvidePlugin({
      _: 'lodash',
      $: 'jquery',
      jQuery: 'jquery',
      i18next: 'i18next', // <= this does not seem to work, I still have to use => window['i18next'] = i18next;
      ejs: 'ejs',
      cookies: 'cookies',
      popper: 'popper',
      bootstrap: 'bootstrap',
    })
  ],
  devServer: {
    contentBase: 'dist',
    clientLogLevel: 'debug',
    watchContentBase: true,
    historyApiFallback: true,
    publicPath: '/',
    host: 'localhost',
    port: 80
  }
});
