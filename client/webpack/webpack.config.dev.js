// Lot's of inspiration from https://github.com/facebookincubator/create-react-app
const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');

const NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'development');
const env = {
  'process.env.NODE_ENV': NODE_ENV
};
const hot = process.env.WEBPACK_ENV === 'hot';
const publicPath = hot ? 'http://localhost:4001/' : '/';

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?' + publicPath,
    require.resolve('webpack/hot/dev-server'),
    require.resolve('./polyfills'),
    path.join(paths.appSrc, 'js', 'bundle')
  ],
  output: {
    path: paths.appBuild,
    pathinfo: true,
    filename: 'js/bundle.js',
    publicPath
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx', ''],
  },
  resolveLoader: {
    root: paths.ownNodeModules,
    moduleTemplates: ['*-loader']
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        loader: 'babel',
        query: require('./babel.dev')
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass!postcss'
      },
      {
        test: /\.json$/,
        exclude: /app_manifest\.json/,
        loader: 'json'
      },
      {
        test: /app_manifest\.json$/,
        loader: 'file?name=app_manifest.json!web-app-manifest'
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        exclude: /\/favicon.ico$/,
        loader: 'file',
        query: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      // A special case for favicon.ico to place it into build root directory.
      {
        test: /\/favicon.ico$/,
        include: [paths.appSrc],
        loader: 'file',
        query: {
          name: 'favicon.ico?[hash:8]'
        }
      },
      {
        test: /\.(mp4|webm)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      // "html" loader is used to process template page (index.html) to resolve
      // resources linked with <link href="./relative/path"> HTML tags.
      {
        test: /\.html$/,
        loader: 'html',
        query: {
          attrs: ['link:href'],
        }
      }
    ]
  },
  postcss() {
    return [
      autoprefixer({
        browsers: ['last 2 versions']
      }),
    ];
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: paths.appHtml,
      filename: 'index.html'
    }),
    new webpack.DefinePlugin(env),
    new webpack.HotModuleReplacementPlugin()
  ]
};
