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
    ingredients: [Ingredient]!
  }
  type Ingredient {
    amount: String
    unit: String
    ingredient: String!
  }

  type Query {
    recipe(id: ID!): Recipe
    recipes: [RecipePreview]
    recipesByIngredient(ingredient: String): [RecipePreview]
  }
`
