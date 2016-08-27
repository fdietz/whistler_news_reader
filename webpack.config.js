/* eslint-env node */
var path = require('path');
var webpack = require('webpack');
const validate = require('webpack-validator');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var env = process.env.NODE_ENV || process.env.MIX_ENV || 'dev';
var hot = process.env.WEBPACK_ENV === 'hot';
var prod = env === 'prod' || env === 'production';

var plugins = [
  new webpack.NoErrorsPlugin(),
  new CopyWebpackPlugin([
    { from: './client/assets' }
  ]),
  new HtmlWebpackPlugin({
    showErrors: true,
    template: './client/index.tmpl.html',
    filename: 'index.html'
  })
];

var loaders = ['babel?cacheDirectory'];
var publicPath = hot ? 'http://localhost:4001/' : '/';
if (prod) publicPath = '/';

var uglifyJSOptions = {
  compressor: {
    screw_ie8: true,
    warnings: false
  },
  mangle: {
    screw_ie8: true
  },
  output: {
    comments: false,
    screw_ie8: true
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
