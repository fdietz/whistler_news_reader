const path = require('path');

function resolve(relativePath) {
  return path.resolve(__dirname, relativePath);
}

module.exports = {
  appBuild: resolve('../../priv/static'),
  appHtml: resolve('../index.tmpl.html'),
  appFavicon: resolve('../assets/favicon-96x96.ico'),
  appPackageJson: resolve('../../package.json'),
  appSrc: resolve('../'),
  appNodeModules: resolve('../../node_modules'),
  ownNodeModules: resolve('../../node_modules')
};
