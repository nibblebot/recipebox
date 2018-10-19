import { gql } from "apollo-server-express";

export default gql`
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
