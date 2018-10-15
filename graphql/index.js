const fs = require("fs");
const https = require("https");
const http = require("http");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

const configurations = {
  development: { ssl: false, port: 4000, hostname: "localhost" },
  // Note: You may need sudo to run on port 443
  production: { ssl: true, port: 443, hostname: "example.com" }
};

const environment = process.env.NODE_ENV || "production";
const config = configurations[environment];

const apollo = new ApolloServer({ typeDefs, resolvers });

const app = express();
apollo.applyMiddleware({ app });

// Create the HTTPS or HTTP server, per configuration
let server;
if (config.ssl) {
  // Assumes certificates are in .ssl folder from package root. Make sure the files
  // are secured.
  server = https.createServer(
    {
      cert: fs.readFileSync(`./ssl/${environment}/server.crt`),
      key: fs.readFileSync(`./ssl/${environment}/server.key`)
    },
    app
  );
} else {
  server = http.createServer(app);
}

// Add subscription support
apollo.installSubscriptionHandlers(server);

server.listen({ port: config.port }, () =>
  console.log(
    "🚀 Server ready at",
    `http${config.ssl ? "s" : ""}://${config.hostname}:${config.port}${
      apollo.graphqlPath
    }`
  )
);
