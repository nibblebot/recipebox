import { useQuery, gql } from "@apollo/client"
import * as React from "react"
import RecipeList from "./RecipeList"

const ALL_RECIPES = gql`
  query {
    recipes {
      id
      title
      image
    }
  }
`

const AllRecipes = () => {
  const { loading, error, data } = useQuery(ALL_RECIPES, { errorPolicy: "all" })
  if (loading) {
    return <p>Loading...</p>
  }
  if (error) {
    console.error(error)
    return <p>Error :(</p>
  }
  return <RecipeList recipes={data.recipes} />
}
export default AllRecipes
