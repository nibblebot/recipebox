import gql from "graphql-tag"
import * as React from "react"
import { Query } from "react-apollo"
import { Link } from "react-router-dom"

const RecipeList = () => (
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
      const recipeItems = data.recipes.map((recipe: any, idx: number) => {
        const image = recipe.image || "placeholder.png"
        return (
          <Link to={`/recipe/${recipe.id}`} className="RecipePreview" key={idx}>
            <img alt="recipe" src={image} width={200} height={200} />
            <div className="recipe-title">{recipe.title}</div>
          </Link>
        )
      })

      return <section className="RecipeList">{recipeItems}</section>
    }}
  </Query>
)
export default RecipeList
