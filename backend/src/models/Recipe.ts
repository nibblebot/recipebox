import mongoose from "mongoose"

export const IngredientSchema = new mongoose.Schema({
  name: String,

  image: String
})

export const RecipeSchema = new mongoose.Schema({
  name: String,

  image: String,

  cook_time: Number,
  prep_time: Number,

  directions: String,
  ingredients: [String]
})

export const Ingredient = mongoose.model("Ingredient", IngredientSchema)
export const Recipe = mongoose.model("Recipe", RecipeSchema)
