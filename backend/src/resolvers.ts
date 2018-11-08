import mongoose from "mongoose"
import { Recipe } from "./models/Recipe"

export default {
  Query: {
    recipe: (_: any, args: { id: mongoose.Types.ObjectId }) =>
      Recipe.findById(args.id).exec(),
    recipes: () =>
      Recipe.find()
        .select("title image")
        .exec(),
    recipesByIngredient: (_: any, args: { ingredient: string }) =>
      Recipe.find({ "ingredients.ingredient": args.ingredient })
  }
}
