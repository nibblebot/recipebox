import { gql } from "apollo-server-express"

export default gql`
  type Recipe {
    image: String
    name: String
    ingredients: [String]
  }

  type Query {
    recipes: [Recipe]
  }
`
