import { useQuery, gql } from "@apollo/client"
import * as React from "react"
import RecipeList from "./RecipeList"

const RECIPES_BY_INGREDIENT = gql`
  query RecipesByIngredient($ingredient: String!) {
    recipesByIngredient(ingredient: $ingredient) {
      id
      title
      image
    }
  }
`

const RecipesByIngredient = (props: {
  match: { params: { ingredient: string } }
}) => {
  const ingredient = props.match.params.ingredient
  const { loading, error, data } = useQuery(RECIPES_BY_INGREDIENT, {
    variables: { ingredient },
  })

  if (loading) {
    return <p>Loading...</p>
  }
  if (error) {
    console.error(error)
    return <p>Error :(</p>
  }
  return (
    <>
      <h2>Recipes with "{ingredient}"</h2>
      <RecipeList recipes={data.recipesByIngredient} />
    </>
  )
}
export default RecipesByIngredient
