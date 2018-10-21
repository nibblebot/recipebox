import { gql } from "apollo-server-express"

export default gql`
  type RecipePreview {
    id: ID!
    name: String!
    image: String
  }
  type Recipe {
    id: ID!
    name: String!
    image: String
    ingredients: [String]
  }

  type Query {
    recipe(id: ID!): Recipe
    recipes: [RecipePreview]
  }
`
