import gql from "graphql-tag"
import * as React from "react"
import { Query } from "react-apollo"

interface RecipeItemProps {
  match: {
    params: {
      id: string
    }
  }
}

const RecipeItem = (props: RecipeItemProps) => (
  <Query
    query={gql`
      query Recipe($id: ID!) {
        recipe(id: $id) {
          id
          name
          image
          ingredients
        }
      }
    `}
    variables={{ id: props.match.params.id }}
  >
    {({ loading, error, data }) => {
      if (loading) {
        return <p>Loading...</p>
      }
      if (error) {
        return <p>Error :(</p>
      }
      const recipe = data.recipe
      const image = recipe.image || "placeholder.png"
      return (
        <div className="RecipeItem">
          <h2>{recipe.name}</h2>
          <img alt="recipe" src={image} width={200} height={200} />
          <div className="ingredients">
            {recipe.ingredients &&
              recipe.ingredients.map((ingredient: string, id: number) => (
                <div className="ingredient" key={id}>
                  {ingredient}
                </div>
              ))}
          </div>
        </div>
      )
    }}
  </Query>
)
export default RecipeItem
