import * as React from "react"
import { Link } from "react-router-dom"

interface Recipe {
  id: string
  image: string
  title: string
}
const RecipeList = (props: { recipes: Recipe[] }) => {
  const recipeItems = props.recipes.map((recipe: any, idx: number) => {
    const image = recipe.image || "placeholder.png"
    return (
      <Link to={`/recipe/${recipe.id}`} className="RecipePreview" key={idx}>
        <img alt="recipe" src={image} width={200} height={200} />
        <div className="recipe-title">{recipe.title}</div>
      </Link>
    )
  })

  return <section className="RecipeList">{recipeItems}</section>
}
export default RecipeList
