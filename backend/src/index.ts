import { ApolloServer } from "apollo-server-express"
import express from "express"
import * as http from "http"
import mongoose from "mongoose"
import resolvers from "./resolvers"
import typeDefs from "./typeDefs"

const configurations = {
  development: { port: 4000, hostname: "localhost" }
}

const environment = "development"
const config = configurations[environment]

const mongoURI = "mongodb://localhost:27017/test"
mongoose.connect(
  mongoURI,
  { useNewUrlParser: true }
)

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))

const startApollo = () => {
  const apollo = new ApolloServer({ typeDefs, resolvers })

  const app = express()
  apollo.applyMiddleware({ app })

  // Create the HTTPS or HTTP server, per configuration
  const server = http.createServer(app)

  // Add subscription support
  apollo.installSubscriptionHandlers(server as http.Server)

  server.listen({ port: config.port }, () => {
    console.log(
      "🚀 Apollo Server ready @",
      `http://${config.hostname}:${config.port}${apollo.graphqlPath}`
    )
  })
}

db.once("open", () => {
  console.log("🚀 MongoDB connection ready @", mongoURI)
  startApollo()
})
