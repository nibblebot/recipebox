const { gql } = require('apollo-server-express')

module.exports = gql`
  type Recipe {
    thumbnail: String
    name: String
    ingredients: [String]
    directions: String
  }

  type Query {
    recipes: [Recipe]
  }
`;