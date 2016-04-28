var path = require("path");
var webpack = require("webpack");
const validate = require("webpack-validator");

var env = process.env.MIX_ENV || "dev";
var prod = env === "prod";

var plugins = [
  new webpack.NoErrorsPlugin()
];

var loaders = ["babel"];
var publicPath = "http://localhost:4001/";

var uglifyJSOptions = {
  compress: {
    warnings: false,
    drop_console: true
  },
  mangle: {
    // Mangle matching properties
    props: /matching_props/,
    // Don't mangle these
    except: [
      "Array", "BigInteger", "Boolean", "Buffer"
    ]
  }
};

var definePluginOptions = {
  NODE_ENV: JSON.stringify("production")
};

if (prod) {
  plugins.push(new webpack.DefinePlugin(definePluginOptions));
  plugins.push(new webpack.optimize.UglifyJsPlugin(uglifyJSOptions));
} else {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  loaders.unshift("react-hot");
}

var entry = "./web/static/js/bundle.js";
var devEntry = [
  "webpack-dev-server/client?" + publicPath,
  "webpack/hot/only-dev-server",
  entry
];

var config = {
  devtool: prod ? null : "eval-source-map",
  entry: prod ? entry : devEntry,
  output: {
    path: path.join(__dirname, "./priv/static/js"),
    filename: "bundle.js",
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

module.exports = validate(config);
