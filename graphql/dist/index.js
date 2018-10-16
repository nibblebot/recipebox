// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"resolvers.js":[function(require,module,exports) {
var _recipes = [{
  name: "Oat Waffles"
}, {
  directions: "",
  ingredients: ["8 to 10 ounces dried Chinese-style wheat noodles", "2 kaffir lime leaves (sliced very thinly, or cut into thin strips with scissors (remove stem))", "2 shallots (thinly sliced and diced)", "4 cloves garlic (minced)", "1 piece galangal (or ginger, sliced thinly)", "1 red chilli, sliced finely (and de-seeded if milder noodles are desired)", "1/2 package firm tofu (if non-vegetarian, you can substitute shrimp or bite-size pieces of chicken)", "3 tomatoes (cut into bite-size pieces)", "1 head broccoli (cut into florets, OR 1 cup bok choy or other Chinese-type cabbage)", "1 to 2 cups bean sprouts", "1/2 cup fresh coriander leaves", "1/2 cup fresh basil (roughly chopped if leaves are large)", "vegetable oil for stir-frying ", '1 1/2 tablespoons ground bean sauce (also called "yellow bean" - actually a soy bean sauce found in Asian food stores)', "1 tablespoon rice vinegar (or substitute white vinegar)", "1 tablespoon fish sauce OR 1 1/2 tablespoons soy sauce", "1 1/2 tablespoons lime juice", "1 tablespoon brown sugar "],
  name: "Tofu Drunken Noodles",
  thumbnail: "/tofu-drunken-noodles.jpg"
}];
module.exports = {
  Query: {
    recipes: function recipes() {
      return _recipes;
    }
  }
};
},{}],"typeDefs.js":[function(require,module,exports) {
var _templateObject = _taggedTemplateLiteral(["\n  type Recipe {\n    thumbnail: String\n    name: String\n    ingredients: [String]\n    directions: String\n  }\n\n  type Query {\n    recipes: [Recipe]\n  }\n"], ["\n  type Recipe {\n    thumbnail: String\n    name: String\n    ingredients: [String]\n    directions: String\n  }\n\n  type Query {\n    recipes: [Recipe]\n  }\n"]);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _require = require('apollo-server-express'),
    gql = _require.gql;

module.exports = gql(_templateObject);
},{}],"index.ts":[function(require,module,exports) {
"use strict";

var _apolloServerExpress = require("apollo-server-express");

var _express = _interopRequireDefault(require("express"));

var _fs = _interopRequireDefault(require("fs"));

var _http = _interopRequireDefault(require("http"));

var _https = _interopRequireDefault(require("https"));

var _resolvers = _interopRequireDefault(require("./resolvers"));

var _typeDefs = _interopRequireDefault(require("./typeDefs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var configurations = {
  development: {
    ssl: false,
    port: 4000,
    hostname: "localhost"
  },
  // Note: You may need sudo to run on port 443
  production: {
    ssl: true,
    port: 443,
    hostname: "example.com"
  }
};
var environment = process.env.NODE_ENV || "production";
var config = configurations[environment];
var apollo = new _apolloServerExpress.ApolloServer({
  typeDefs: _typeDefs.default,
  resolvers: _resolvers.default
});
var app = (0, _express.default)();
apollo.applyMiddleware({
  app: app
}); // Create the HTTPS or HTTP server, per configuration

var server;

if (config.ssl) {
  // Assumes certificates are in .ssl folder from package root. Make sure the files
  // are secured.
  server = _https.default.createServer({
    cert: _fs.default.readFileSync("./ssl/" + environment + "/server.crt"),
    key: _fs.default.readFileSync("./ssl/" + environment + "/server.key")
  }, app);
} else {
  server = _http.default.createServer(app);
} // Add subscription support


apollo.installSubscriptionHandlers(server);
server.listen({
  port: config.port
}, function () {
  return console.log("🚀 Server ready @", "http" + (config.ssl ? "s" : "") + "://" + config.hostname + ":" + config.port + apollo.graphqlPath);
});
},{"./resolvers":"resolvers.js","./typeDefs":"typeDefs.js"}]},{},["index.ts"], null)
//# sourceMappingURL=/index.map