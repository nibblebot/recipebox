import { ApolloServer } from "apollo-server-express";
import * as express from "express";
import * as fs from "fs";
import * as http from "http";
import * as https from "https";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";

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
apollo.installSubscriptionHandlers(server as http.Server);

server.listen({ port: config.port }, () =>
  console.log(
    "🚀 Server ready @",
    `http${config.ssl ? "s" : ""}://${config.hostname}:${config.port}${
      apollo.graphqlPath
    }`
  )
);
