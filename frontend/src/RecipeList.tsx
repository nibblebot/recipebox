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
          name
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
          <div className="RecipePreview" key={idx}>
            <Link to={`/recipe/${recipe.id}`}>
              <img alt="recipe" src={image} width={200} height={200} />
              <div className="recipe-name">{recipe.name}</div>
            </Link>
          </div>
        )
      })

      return <section className="RecipeList">{recipeItems}</section>
    }}
  </Query>
)
export default RecipeList
