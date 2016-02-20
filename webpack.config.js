var path = require("path");
var webpack = require("webpack");
var CopyWebpackPlugin = require("copy-webpack-plugin");

var env = process.env.MIX_ENV || "dev";
var prod = env === "prod";

var entry = "./web/static/js/bundle.js";
var plugins = [
  new webpack.NoErrorsPlugin(),
  new CopyWebpackPlugin([
    { from: "./web/static/assets" },
    { from: "./deps/phoenix_html/web/static/js/phoenix_html.js",
      to: "js/phoenix_html.js" }
  ])
];
var loaders = ["babel"];
var publicPath = "http://localhost:4001/";

if (prod) {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
} else {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  loaders.unshift("react-hot");
}

module.exports = {
  // devtool: prod ? null : "eval-sourcemaps",
  devtool: prod ? null : "source-map",
  entry: prod ? entry : [
    "webpack-dev-server/client?" + publicPath,
    "webpack/hot/only-dev-server",
    entry
  ],
  output: {
    path: path.join(__dirname, "./priv/static/js"),
    filename: "bundle.js",
    publicPath: publicPath
  },
  resolve: {
    alias: {
      phoenix: __dirname + "/deps/phoenix/web/static/js/phoenix.js"
    }
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
        loaders: ["style", "css?sourceMap", "sass?sourceMap", "autoprefixer?browsers=last 2 version"]
        // loader: "style!css!sass!autoprefixer?browsers=last 2 version"
      },
      {
        test: /\.(svg|jpg|png)$/,
        loader: "file-loader"
      }
    ]
  }
};
