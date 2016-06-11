/* eslint-env node */
var path = require('path');
var webpack = require('webpack');
const validate = require('webpack-validator');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var FaviconsWebpackPlugin = require('favicons-webpack-plugin');

var env = process.env.NODE_ENV || process.env.MIX_ENV || 'dev';
var prod = env === 'prod' || env === 'production';

var plugins = [
  new webpack.NoErrorsPlugin(),
  // new CopyWebpackPlugin([{ from: './client/assets' }]),
  new FaviconsWebpackPlugin({
    logo: './client/assets/favicons/android-icon-192x192.png',
    title: "whistl'er news reader",
    background: '#27323F'
  }),
  new HtmlWebpackPlugin({
    template: './client/index.tmpl.html.ejs',
    inject: 'body',
    filename: 'index.html'
  }),
];

var loaders = ['babel?cacheDirectory'];
// var publicPath = 'http://localhost:4001/';
var publicPath = prod ? '/' : 'http://localhost:4001/';

var uglifyJSOptions = {
  compress: {
    warnings: false
  }
};

var definePluginOptions = {
  'process.env.NODE_ENV': JSON.stringify('production')
};

if (prod) {
  plugins.push(new webpack.DefinePlugin(definePluginOptions));
  plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
  plugins.push(new webpack.optimize.DedupePlugin());
  plugins.push(new webpack.optimize.UglifyJsPlugin(uglifyJSOptions));
} else {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  loaders.unshift('react-hot');
}

var entry = './client/js/bundle.js';
var devEntry = {
  app: [
    'webpack-dev-server/client?' + publicPath,
     // 'only', prevents reload on syntax error
    'webpack/hot/only-dev-server',
    entry
  ]
};
var prodEntry = {
  app: entry
}

var config = {
  devtool: prod ? null : 'eval-source-map',
  entry: prod ? prodEntry : devEntry,
  output: {
    path: path.join(__dirname, './priv/static'),
    filename: 'js/bundle.js',
    publicPath: publicPath
  },
  plugins: plugins,
  resolve: {
    root: [
      path.resolve('./client/js'),
      path.resolve('./client/css'),
      path.resolve('./client/assets')
    ]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        loaders: loaders,
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loaders: [
          'style',
          'css?sourceMap',
          'sass?sourceMap',
          'autoprefixer?browsers=last 2 version'
        ]
      },
      {
        test: /\.(svg|jpg|png)$/,
        loader: 'file-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }
};

// module.exports = validate(config);
module.exports = config;
