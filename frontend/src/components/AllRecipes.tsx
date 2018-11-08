import gql from "graphql-tag"
import * as React from "react"
import { Query } from "react-apollo"
import RecipeList from "./RecipeList"

const AllRecipes = () => (
  <Query
    query={gql`
      {
        recipes {
          id
          title
          image
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) {
        return <p>Loading...</p>
      }
      if (error) {
        return <p>Error :(</p>
      }
      return <RecipeList recipes={data.recipes} />
    }}
  </Query>
)
export default AllRecipes
