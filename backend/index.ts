import { ApolloServer } from "apollo-server-express";
import * as express from "express";
import * as http from "http";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";

const configurations = {
  development: { port: 4000, hostname: "localhost" }
};

const environment = "development";
const config = configurations[environment];

const apollo = new ApolloServer({ typeDefs, resolvers });

const app = express();
apollo.applyMiddleware({ app });

// Create the HTTPS or HTTP server, per configuration
const server = http.createServer(app);

// Add subscription support
apollo.installSubscriptionHandlers(server as http.Server);

server.listen({ port: config.port }, () =>
  console.log(
    "🚀 Server ready @",
    `http://${config.hostname}:${config.port}${apollo.graphqlPath}`
  )
);
