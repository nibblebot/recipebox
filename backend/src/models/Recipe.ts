import mongoose from "mongoose"

export const RecipeSchema = new mongoose.Schema({
  title: String,
  image: String,
  cook_time: Number,
  prep_time: Number,
  directions: String,
  ingredients: [
    {
      ingredient: String,
      amount: String,
      unit: String
    }
  ],
  originalUrl: String,
  slug: String
})

export const Recipe = mongoose.model("Recipe", RecipeSchema)
