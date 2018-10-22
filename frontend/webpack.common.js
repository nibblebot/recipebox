const path = require("path")
module.exports = {
  paths: {
    appPublic: path.resolve("public"),
    appSrc: path.resolve("src"),
    appEntry: path.resolve("src/index.tsx"),
    appHtml: path.resolve("public/index.html"),
    appTsConfig: path.resolve("tsconfig.json"),
    appTsLint: path.resolve("tslint.json"),
    appPackageJson: path.resolve("package.json"),
    appNodeModules: path.resolve("node_modules"),
    yarnLockFile: path.resolve("yarn.lock"),
    publicPath: "/"
  },
  env: {
    NODE_ENV: process.env.NODE_ENV || "development",
    // Useful for resolving the correct path to static assets in `public`.
    // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
    // This should only be used as an escape hatch. Normally you would put
    // images into the `src` and `import` them in code to get their paths.
    PUBLIC_URL: ""
  }
}
