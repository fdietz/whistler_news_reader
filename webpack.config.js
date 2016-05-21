/* eslint-env node */
var path = require("path");
var webpack = require("webpack");
const validate = require("webpack-validator");
var CopyWebpackPlugin = require("copy-webpack-plugin");

var env = process.env.MIX_ENV || "dev";
var prod = env === "prod";

var plugins = [
  new webpack.NoErrorsPlugin(),
  new CopyWebpackPlugin([{ from: './web/static/assets' }])
];

var loaders = ["babel?cacheDirectory"];
var publicPath = "http://localhost:4001/";

var uglifyJSOptions = {
  compress: {
    warnings: false
  }
};

var definePluginOptions = {
  "process.env.NODE_ENV": JSON.stringify("production")
};

if (prod) {
  plugins.push(new webpack.DefinePlugin(definePluginOptions));
  plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
  plugins.push(new webpack.optimize.DedupePlugin());
  plugins.push(new webpack.optimize.UglifyJsPlugin(uglifyJSOptions));
} else {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  loaders.unshift("react-hot");
}

var entry = "./web/static/js/bundle.js";
var devEntry = {
  app: [
    "webpack-dev-server/client?" + publicPath,
     // "only", prevents reload on syntax error
    "webpack/hot/only-dev-server",
    entry
  ]
};
var prodEntry = {
  app: entry
}

var config = {
  devtool: prod ? null : "eval-source-map",
  entry: prod ? prodEntry : devEntry,
  output: {
    path: path.join(__dirname, "./priv/static"),
    filename: "bundle.js",
    publicPath: publicPath
  },
  plugins: plugins,
  resolve: {
    root: [
      path.resolve('./web/static/js'),
      path.resolve('./web/static/css'),
      path.resolve('./web/static/assets')
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
          "style",
          "css?sourceMap",
          "sass?sourceMap",
          "autoprefixer?browsers=last 2 version"
        ]
      },
      {
        test: /\.(svg|jpg|png)$/,
        loader: "file-loader"
      }
    ]
  }
};

// module.exports = validate(config);
module.exports = config;
