import { gql } from "apollo-server-express"

export default gql`
  type RecipePreview {
    id: ID!
    title: String!
    image: String!
  }
  type Recipe {
    id: ID!
    title: String!
    image: String!
    ingredients: [Ingredient!]
  }
  type Ingredient {
    ingredient: String!
    amount: String
    unit: String
  }

  type Query {
    recipe(id: ID!): Recipe
    recipes: [RecipePreview]
  }
`
