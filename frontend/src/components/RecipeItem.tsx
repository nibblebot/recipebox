import gql from "graphql-tag"
import * as React from "react"
import { Query } from "react-apollo"
import { Link } from "react-router-dom"

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
          title
          image
          ingredients {
            amount
            unit
            ingredient
          }
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
          <h2>{recipe.title}</h2>
          <img alt="recipe" src={image} width={200} height={200} />
          <div className="ingredients">
            <h3>Ingredients</h3>
            {recipe.ingredients &&
              recipe.ingredients.map(
                (ingredient: { ingredient: string; amount: string; unit: string }, id: number) => (
                  <div className="ingredient" key={id}>
                    {ingredient.amount && (
                      <div className="ingredient--amount">{ingredient.amount}</div>
                    )}
                    {ingredient.unit && <div className="ingredient--unit">{ingredient.unit}</div>}
                    <div className="ingredient--ingredient">
                      <Link to={`/recipes/byIngredient/${ingredient.ingredient}`}>
                        {ingredient.ingredient}
                      </Link>
                    </div>
                  </div>
                )
              )}
          </div>
        </div>
      )
    }}
  </Query>
)
export default RecipeItem
