import gql from "graphql-tag"
import * as React from "react"
import { Query } from "react-apollo"
import RecipeList from "./RecipeList"

const RecipesByIngredient = (props: { match: { params: { ingredient: string } } }) => {
  const ingredient = props.match.params.ingredient
  return (
    <Query
      query={gql`
        query RecipesByIngredient($ingredient: String!) {
          recipesByIngredient(ingredient: $ingredient) {
            id
            title
            image
          }
        }
      `}
      variables={{ ingredient }}
    >
      {({ loading, error, data }) => {
        if (loading) {
          return <p>Loading...</p>
        }
        if (error) {
          return <p>Error :(</p>
        }
        return (
          <>
            <h2>Recipes with "{ingredient}"</h2>
            <RecipeList recipes={data.recipesByIngredient} />
          </>
        )
      }}
    </Query>
  )
}
export default RecipesByIngredient
